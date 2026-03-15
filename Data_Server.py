from fastapi import FastAPI, Depends,  UploadFile, File,Form, HTTPException, Query
from models import *
from datetime import datetime,date,timedelta
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from Database_models import *
from Database import session,engine
from typing import Annotated
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy import (
    create_engine, Column, Integer, String, ForeignKey,JSON, and_,
    select, DateTime, func, or_,Identity, desc
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from typing import List, Optional, Dict, Any

# from io import BytesIO
import io
# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str):
#     return pwd_context.hash(password)

app = FastAPI()

# Allow all origins (for dev/testing purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow any origin
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)

base.metadata.create_all(engine)


def init_db():
    db = session()
    try: 
        yield db
    finally:
        db.close()

def find_user_from_profiles(db: Session, staff: str):
    """Returns userProfiles row for staff number or None."""
    staff = staff.strip()
    return db.execute(
        select(UserProfile).where(func.trim(UserProfile.userID) == staff)
    ).scalar_one_or_none()

def Insert_Measurement_Parameters():
    db = next(init_db())

    count = db.query(Measuring_Instruments).count()

    if count == 0:    # only insert once

        instruments = [
            Measuring_Instruments(
                Description="Vernier Calipers",
                Equipment_ID=1,
                Measuring_Accuracy=0.02,
                Make_Model="Mitutoyo CD-6CS",
                Cal_Date=datetime.strptime("10-01-2024", "%d-%m-%Y"),
                Due_Date=datetime.strptime("10-01-2025", "%d-%m-%Y")
            ),
            Measuring_Instruments(
                Description="Scale",
                Equipment_ID=2,
                Measuring_Accuracy=0.03,
                Make_Model="Fisher Scale 150mm",
                Cal_Date=datetime.strptime("15-02-2024", "%d-%m-%Y"),
                Due_Date=datetime.strptime("15-02-2025", "%d-%m-%Y")
            ),
            Measuring_Instruments(
                Description="Tape",
                Equipment_ID=3,
                Measuring_Accuracy=0.01,
                Make_Model="Stanley 3M Tape",
                Cal_Date=datetime.strptime("20-03-2024", "%d-%m-%Y"),
                Due_Date=datetime.strptime("20-03-2025", "%d-%m-%Y")
            ),
        ]

        db.add_all(instruments)
        db.commit()

    db.close()

def seed_dimension_types():
    db = next(init_db())
    count = db.query(DimensionType).count()
    if count==0:
        names = ["Height", "Width", "Length", "Thickness","Resistance","Capacitance","Voltage","Conductance"]
        for name in names:
            exists = db.query(DimensionType).filter_by(Name=name).first()
            if not exists:
                db.add(DimensionType(Name=name))
        db.commit()

def seed_dimension_reports(db, ref_no: str):
    count  = db.query(DimensionReport).filter(DimensionReport.Reference_No==ref_no).count()
    if count == 0:

        types = db.query(DimensionType).all()
        for t in types:

            basic = 50.0  # Example
            tolerance = 0.2

            report = DimensionReport(
                Reference_No=ref_no,
                Dimension_Type_Id=t.Id,
                Basic_Dimension=basic,
                # Measuring_Instr_Id=1,  
                Tolerance=tolerance,
                Min=basic - tolerance,
                Max=basic + tolerance
            )
            db.add(report)
            db.commit()

        # Add 15 empty samples
        # for i in range(1, 16):
        #     sample = DimensionSample(
        #         Report_Id=report.Id,
        #         Sample_No=i,
        #         Value=None,
        #         Status=None
        #     )
        #     db.add(sample)

        # db.commit()

Insert_Measurement_Parameters()
seed_dimension_types()


def initialize_subcontract_entries(db: Session, data:dict):
    print("1")

    # Fetch all Reference_Nos from QRRecord_Generated
    qr_records = db.query(QRRecord_Generated).all()
    inserted = 0
    
    ref = data.get("Reference_No")
    # Get last used SAN_NO and Control_No
    last_entry = db.query(SubContract_Inspection).order_by(
        SubContract_Inspection.SAN_NO.desc()
    ).first()
    

    if last_entry:
  
        next_san = last_entry.SAN_NO + 1
        next_control = last_entry.Control_No + 1
    else:
    
        next_san = 1
        next_control = 1000

    # for qr in qr_records:

        # Skip if already exists
    exists = db.query(SubContract_Inspection).filter(
        SubContract_Inspection.Reference_No == data['Reference_No']
    ).first()
    qr = db.query(QRRecord_db).filter(QRRecord_db.Reference_No==ref).first()
    print(qr.Reference_No)
    if not exists:
        # print("6: ",exists.Reference_No )
        # continue
        print("7", next_san)
        subcontract = SubContract_Inspection(
            Control_No=next_control,
            SAN_NO=next_san,
            Part_No=qr.BEL_Part_Number,
            Description=qr.Description,
            PO_NO=qr.BEL_PO_No,
            Vendor_Name=qr.Vendor_Name,
            Quantity=qr.Quantity,
            Sample="5 Nos",
            Sale_Order="SO-1234",
            Drg_Issue_Level=1,
            Reference_No=ref,
            Date=date.today()
        )

        db.add(subcontract)
        print("subcontract: ",subcontract.Reference_No)
        db.commit()
        # Increment counters
        next_san += 1
        next_control += 1
        inserted += 1

    db.commit()

    return inserted

def initialize_material_inspection_entries(db: Session, ref_no:str):
    # Fetch all records from the generated QR table
    qr_records = db.query(QRRecord_Generated).all()
    inserted = 0

    for qr in qr_records:
        # Check if an inspection entry already exists
        exists = db.query(MaterialInspection).filter(
            MaterialInspection.Reference_No == qr.Reference_No
        ).first()

        if exists:
            continue

        # Map QRRecord_Generated fields to MaterialInspection fields
        new_inspection = MaterialInspection(
            Reference_No=qr.Reference_No,
            Batch_Lot_No=qr.Batch_Lot_No,
            Description=qr.Description,
            PO_Number=qr.BEL_PO_No,
            GR_Number=qr.GR_No,
            GR_Date=qr.GR_Date.strftime("%Y-%m-%d") if qr.GR_Date else None,
            Vendor_Name=qr.Vendor_Name,
            Sale_Order="SO-1234",
            # Plant=qr.Manufacturing_Place,
            # Placeholder/Default values
            Revision_Level="00",
            Valuation_Type="Standard"
        )
        db.add(new_inspection)
        inserted += 1

    db.commit()
    return inserted

############################################ endpoints #####################################################


@app.get("/Instrumentdetails")
def get_details(db:Session = Depends(init_db)):
    db_records = db.query(Measuring_Instruments).all()
    return db_records



@app.post("/updatedetails")
def add_details(data: dict, db: Session = Depends(init_db)):
    try:
        # 1. Determine the logic based on BEL_Part_Number FIRST
        part_number = str(data.get('BEL_Part_Number', ''))
        ref_no = data.get('Reference_No')
        if part_number.startswith('4'):
            inspection_type_val = "Material Inspection"
            added_count = initialize_material_inspection_entries(db, data)
        else:
            inspection_type_val = "Subcontract Inspection"
            added_count = initialize_subcontract_entries(db,data)

        # 2. Assign the value to the data dict or the object
        # Ensure 'inspection_type' is a column in your QRRecord_Generated model
        common_row = QRRecord_Generated(**data)
        common_row.inspection_type = inspection_type_val  # <--- THIS SAVES IT TO DB
        
        db.add(common_row)
        print("Here")
        # 3. Cleanup: Remove the temporary record
        
        
        if ref_no:
            print(ref_no)
            db.query(QRRecord_db).filter(QRRecord_db.Reference_No == ref_no).delete()
            # print(record.Reference_No)
        print("done")
        # 4. Commit all changes at once
        db.commit()
        db.refresh(common_row)

        return {
            "status": "success",
            "message": "Added successfully",
            "inspection_routed_to": inspection_type_val,
            "records_initialized": added_count
        }

    except Exception as e:
        db.rollback() # Undo changes if something fails
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

###################################  Inspection endpoints #####################################################


@app.get("/generateddetails")
def get_generated_details(db:Session = Depends(init_db)):
    db_records = db.query(QRRecord_Generated).all()
    return db_records




###################################  Approver endpoints #####################################################


@app.get("/inspecteddetails")
def get_minspected_details(db:Session = Depends(init_db)):
    db_records = db.query(QRRecord_Generated).all()

    # result=[]
    # for a in db_records:
    #     refno = a.Reference_No

    #     data = db.query(Authorized_Person).filter(Authorized_Person.Reference_No==refno).all()
    #     for b in data:
    #         result.append({
            
    #         "Reference_No" : refno,
    #         "BEL_Part_Number" : a.BEL_Part_Number,
    #         "BEL_PO_No" : a.BEL_PO_No,
    #         "GR_No": a.GR_No,
    #         # "Serial_No" : a.serialNo,

    #         "inspectorID":b.insUserID, 
    #         "insUserName":b.insUserName , 
    #         "insUserRole":b.insUserRole,
    #         "insUserSBU" :b.insUserSBU,
    #         "insUserSBUDIV":b.insUserSBUDIV,

    #         })

    # return result
    return db_records


###################################### Subcontract Endpoints ###############################################################################


@app.get("/subcontractinspectionreport")
def get_subcontract_report(Ref_No: str, db: Session = Depends(init_db)):
    seed_dimension_reports(db,Ref_No)
    record = db.query(SubContract_Inspection).filter(
        SubContract_Inspection.Reference_No == Ref_No
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No subcontract inspection report found for Reference_No {Ref_No}"
        )

    return record      


from fastapi import HTTPException

@app.put("/subcontractinspectionreport")
def update_subcontract_report(
    Ref_No: str,
    updated_data: dict,
    db: Session = Depends(init_db)
):

    # Fetch existing record
    record = db.query(SubContract_Inspection).filter(
        SubContract_Inspection.Reference_No == Ref_No
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No subcontract inspection report found for Reference_No {Ref_No}"
        )

    # Update only provided fields
    for field, value in updated_data.items():
        if hasattr(record, field) and value is not None:
            setattr(record, field, value)

    db.commit()
    db.refresh(record)

    return {"message": "Subcontract inspection report updated successfully", "data": record}





@app.get("/dimensionreport")
def get_dimensions(Ref_No: str, db: Session = Depends(init_db)):

    reports = (
        db.query(DimensionReport)
        .join(DimensionType)
        .filter(DimensionReport.Reference_No == Ref_No)
        .all()
    )

    result = []
    for r in reports:
        result.append({
            "Reference_No":r.Reference_No,
            "Dimension_Report_Id": r.Id,
            "Dimension_Name_Unit": r.dimension_type.Name,
            "Basic_Dimension": r.Basic_Dimension,
            "Tolerance": r.Tolerance,
            "Min": r.Min,
            "Max": r.Max
        })

    return result

@app.post("/dimensionreport/samples")
def save_dimension_report(payload: dict, db: Session = Depends(init_db)):
    ref_no = payload["Reference_No"]
    print(payload)
    
    # 1. Instrument Mapping
    instrument_id = payload.get('Instrument_id', [])
    for id in instrument_id:
        count = db.query(Measuring_Instruments_Used).filter(
            Measuring_Instruments_Used.Reference_No == ref_no,
            Measuring_Instruments_Used.Equipment_ID == id
        ).count()
        if count == 0:
            intrument_used = Measuring_Instruments_Used(
                Reference_No=ref_no,
                Equipment_ID=id
            )
            db.add(intrument_used)
            db.commit()

    # 2. Save COMMON DATA (Updated with Electrical Fields)
    common_data = payload.get("Common", {})
    
    common_row = DimensionCommonReport(
        Reference_No=ref_no,
        Remarks=common_data.get("Remarks"),
        Marking_On_Material=common_data.get("Marking_On_Material"),
        Dimension_Remark=common_data.get("Dimension_Remark"),
        Visual_Inspection_Report=common_data.get("Visual_Inspection_Report"),
        
        # --- NEW ELECTRICAL FIELDS ---
        Electrical_Inspection_Remark=common_data.get("Electrical_Inspection_Remark"),
        Electrical_Parameter=common_data.get("Electrical_Parameter"),
        Functional=common_data.get("Functional"),
        Dimensions=common_data.get("Dimensions_Check"), # Mapped from 'Dimensions' dropdown
        Visual_Inspection=common_data.get("Visual_Inspection_Status"), # Mapped from 'Visual Inspection' dropdown
        COC=common_data.get("COC"),
        Test_Reports=common_data.get("Test_Reports"),
        Imported_Doc_Received=common_data.get("Imported_Doc_Received"),
        Malware_Free_Cert=common_data.get("Malware_Free_Cert"),
        FOD_Check=common_data.get("FOD_Check"),
        Counterfeit_Checked=common_data.get("Counterfeit_Checked"),
        MFG_Date=common_data.get("MFG_Date") if common_data.get("MFG_Date") else None,
        Exp_Date=common_data.get("Exp_Date") if common_data.get("Exp_Date") else None,
        # -----------------------------

        Qty_Received=common_data.get("Qty_Received"),
        Qty_Inspected=common_data.get("Qty_Inspected"),
        Qty_Accepted=common_data.get("Qty_Accepted"),
        Qty_Rejected=common_data.get("Qty_Rejected"),
        Inspection_Remarks=common_data.get("Inspection_Remarks"),
        userID=common_data.get("userID"),
        userName=common_data.get("userName"),
        userRole=common_data.get("userRole"),
        userSBU=common_data.get("userSBU"),
        userSBUDIV=common_data.get("userSBUDIV")
    )

    # Delete existing common record if it exists to allow update
    existing_record = db.query(DimensionCommonReport).filter(
        DimensionCommonReport.Reference_No == ref_no
    ).first()

    if existing_record:
        db.delete(existing_record)
        db.commit()
    
    db.add(common_row)
    db.commit()

    # 3. Save Dimensions Samples (Existing logic)
    for dim in payload["Dimensions"]:
        report = db.query(DimensionReport).filter(DimensionReport.Id == dim["Report_Id"]).first()
        if report:
            db.query(DimensionSample).filter(DimensionSample.Report_Id == report.Id).delete()
            db.commit()
            for s in dim["Samples"]:
                sample = DimensionSample(
                    Report_Id=report.Id,
                    Sample_No=s["Sample_No"],
                    Value=s["Value"],
                    Status=s["Status"],
                    Remarks=s["Remarks"],
                    Dimension_View_Parameter=s["Dimension_View_Parameter"],
                    Dimension_Parameter_Unit=s["Dimension_Parameter_Unit"]
                )
                db.add(sample)
            db.commit()

    return {"status": "success", "message": "Dimension data saved successfully"}



@app.post("/authorized-person/upload")
async def upload_authorized_person(
    Reference_No: str=Form(None),
    insUserID: str=Form(None),
    insUserName: str=Form(None),
    insUserRole: str=Form(None),
    # insUserSBU: str=Form(None),
    # insUserSBUDIV: str=Form(None),
    insdate : date=Form(None),

    insRemarks: str=Form(None),

    ins_file: UploadFile = File(...),

    appUserID: str=Form(None),
    appUserName: str=Form(None),
    appUserRole: str=Form(None),
    appUserSBU: str=Form(None),
    appUserSBUDIV: str=Form(None),

    db: Session = Depends(init_db)
):
    print(appUserSBUDIV)
    inspector_details = db.query(UserProfile).filter(UserProfile.userID==insUserID).first()
    # 1. Check if data already exists in Authorized_Person table
    existing_entry = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == Reference_No
    ).first()

    if existing_entry:
        raise HTTPException(
            status_code=400, 
            detail=f"Data for Reference No {Reference_No} already exists."
        )

    # 2. Validate that the Reference Number exists in the master QR table
    ref_master = db.query(QRRecord_Generated).filter(
        QRRecord_Generated.Reference_No == Reference_No
    ).first()

    
    if not ref_master:
        raise HTTPException(status_code=404, detail="Reference_No not found in master records.")

    # 2. Read Installer file
    ins_bytes = await ins_file.read()
    
    # 3. Create the row with ONLY Installer data
    new_row = Authorized_Person(
        Reference_No=Reference_No,
        insUserID=insUserID,
        insUserName=insUserName,
        insUserRole=insUserRole,
        insUserSBU=inspector_details.sbu,
        insUserSBUDIV=inspector_details.subdivision,

        insfilename=ins_file.filename,
        insmimetype=ins_file.content_type,
        insdata=ins_bytes,

        insRemarks=insRemarks,

        appUserID = appUserID,
        appUserName = appUserName,
        appUserRole = appUserRole,
        appUserSBU = appUserSBU,
        appUserSBUDIV = appUserSBUDIV,
    )
    
    ref_master.overall_status = "Inspected"


    db.add(new_row)
    db.commit()
    db.refresh(new_row)

    return {"status": "success", "id": new_row.id}

@app.put("/approver/ud")
async def approve_person(
    Ref_No: str = Form(...),
    appRemarks: str = Form(None),
    appDate: str = Form(None),
    Status: str = Form(...), 
    app_file: UploadFile = File(None),
    db: Session = Depends(init_db)
):
    person_record = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == Ref_No
    ).first()

    if not person_record:
        raise HTTPException(status_code=404, detail="Authorized Person record not found.")

    if app_file:
        app_bytes = await app_file.read()
        person_record.appdata = app_bytes
        person_record.appfilename = app_file.filename
        person_record.appmimetype = app_file.content_type

    person_record.appDate = appDate
    person_record.appRemarks = appRemarks

    qr_record = db.query(QRRecord_Generated).filter(
        QRRecord_Generated.Reference_No == Ref_No
    ).first()
    
    if qr_record:
        qr_record.overall_status = Status 

    db.commit()
    db.refresh(person_record)

    return {"status": "Updated successfully", "overall_status": Status, "Reference_No": Ref_No}


@app.get("/authorized-person/list")
def list_authorized_person(Reference_No: str, db: Session = Depends(init_db)):
    rows = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == Reference_No
    ).all()

    if not rows:
        return {"count": 0, "data": []}

    result = []
    for r in rows:
        result.append({
            "id": r.id,
            "Reference_No": r.Reference_No,
            # Inspector Data
            "inspector": {
                "name": r.insUserName,
                "staff_no": r.insUserID,
                "role": r.insUserRole,
                "date": r.insDate,
                "filename": r.insfilename,
            },
            # Approver Data
            "approver": {
                "name": r.appUserName,
                "staff_no": r.appUserID,
                "role": r.appUserRole,
                "date": r.appDate,
                "filename": r.appfilename,
            }
        })

    return {"count": len(result), "data": result}



import io
from fastapi import HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

@app.get("/authorized-person/file/{ref_no}/{file_type}")
def download_authorized_person_file(ref_no: str, file_type: str, db: Session = Depends(init_db)):
    """
    Downloads the specific signature file.
    :param ref_no: The Reference_No of the record.
    :param file_type: Either 'inspector' or 'approver'.
    """
    # 1. Fetch the combined record using the Reference_No
    record = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == ref_no
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # 2. Logic to select the correct file data based on the type requested
    if file_type.lower() == "inspector":
        file_content = record.insdata
        mimetype = record.insmimetype
        filename = record.insfilename
    elif file_type.lower() == "approver":
        file_content = record.appdata
        mimetype = record.appmimetype
        filename = record.appfilename
    else:
        raise HTTPException(
            status_code=400, 
            detail="Invalid file_type. Use 'inspector' or 'approver'."
        )

    # 3. Check if the specific file exists in the record
    if not file_content:
        raise HTTPException(
            status_code=404, 
            detail=f"No {file_type} signature file found for this record."
        )

    # 4. Return the file as a stream
    return StreamingResponse(
        io.BytesIO(file_content),
        media_type=mimetype,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@app.get("/debug/userprofiles")
def debug_userprofiles(db: Session = Depends(init_db)):
    return db.execute(select(UserProfile.userID)).scalars().all()

    #related for UI Visualization


@app.get("/inspection/full")
def get_full_inspection(Ref_No: str, db: Session = Depends(init_db)):

    # ---------------------------------------------------------
    # 1. QR RECORD
    # ---------------------------------------------------------
    qr = db.query(QRRecord_Generated).filter(
        QRRecord_Generated.Reference_No == Ref_No
    ).first()

    if not qr:
        raise HTTPException(404, f"Reference_No {Ref_No} not found")

    qr_data = {
        "Reference_No": qr.Reference_No,
        "BEL_Part_Number": qr.BEL_Part_Number,
        "Vendor_Name": qr.Vendor_Name,
        "Quantity": qr.Quantity,
        "GR_No": qr.GR_No,
        "Invoice_No": qr.Invoice_No,
        "MPN": qr.MPN,
        "Batch_Lot_No": qr.Batch_Lot_No,
        "DateCode": qr.DateCode,
        "Description": qr.Description,
        "Timestamp": str(qr.Timestamp) if qr.Timestamp else None,
        "Type" : qr.inspection_type
    }

    # ---------------------------------------------------------
    # 2. SUBCONTRACT
    # ---------------------------------------------------------
    subcontract = db.query(SubContract_Inspection).filter(
        SubContract_Inspection.Reference_No == Ref_No
    ).first()

    subcontract_data = None
    if subcontract:
        subcontract_data = {
            "SAN_NO": subcontract.SAN_NO,
            "Control_No": subcontract.Control_No,
            "Part_No": subcontract.Part_No,
            "Description": subcontract.Description,
            "PO_NO": subcontract.PO_NO,
            "Vendor_Name": subcontract.Vendor_Name,
            "Quantity": subcontract.Quantity,
            "Sample": subcontract.Sample,
            "Sale_Order": subcontract.Sale_Order,
            "Drg_Issue_Level": subcontract.Drg_Issue_Level,
            "Visual_Inspection": subcontract.Visual_Inspection,
            "Raw_Material_Supplied": subcontract.Raw_Material_Supplied,
            "Raw_Material_Test_Report": subcontract.Raw_Material_Test_Report,
            "Date": str(subcontract.Date) if subcontract.Date else None,
        }

    # ---------------------------------------------------------
    # 3. COMMON DIMENSION REPORT
    # ---------------------------------------------------------
    common = db.query(DimensionCommonReport).filter(
        DimensionCommonReport.Reference_No == Ref_No
    ).first()

    common_data = None
    if common:
        common_data = {
            "Remarks": common.Remarks,
            "Marking_On_Material": common.Marking_On_Material,
            "Dimension_Remark": common.Dimension_Remark,
            "Visual_Inspection_Report": common.Visual_Inspection_Report,
            "Electrical_Inspection_Remark": common.Electrical_Inspection_Remark,
            "Electrical_Parameter": common.Electrical_Parameter,
            "Functional": common.Functional,
            "Dimensions": common.Dimensions,
            "Visual_Inspection": common.Visual_Inspection,
            "COC": common.COC,
            "Test_Reports": common.Test_Reports,
            "Imported_Doc_Received": common.Imported_Doc_Received,
            "Malware_Free_Cert": common.Malware_Free_Cert,
            "FOD_Check": common.FOD_Check,
            "Counterfeit_Checked": common.Counterfeit_Checked,
            "MFG_Date": str(common.MFG_Date) if common.MFG_Date else None,
            "Exp_Date": str(common.Exp_Date) if common.Exp_Date else None,
            "Qty_Received": common.Qty_Received,
            "Qty_Inspected": common.Qty_Inspected,
            "Qty_Accepted": common.Qty_Accepted,
            "Qty_Rejected": common.Qty_Rejected,
            "Inspection_Remarks": common.Inspection_Remarks
        }


    # ---------------------------------------------------------
    # 4. DIMENSIONS + SAMPLES
    # ---------------------------------------------------------
    dimension_rows = (
        db.query(DimensionReport)
        .join(DimensionType, DimensionReport.Dimension_Type_Id == DimensionType.Id)
        .filter(DimensionReport.Reference_No == Ref_No)
        .all()
    )

    dimensions_list = []

    for d in dimension_rows:

        # Convert Measuring Instrument CSV → list[int]
        # if d.Measuring_Instr_Id:
        #     instrument_ids = [int(x) for x in d.Measuring_Instr_Id.split(",")]
        # else:
        # 2. Fetch Instrument IDs used for this inspection
        instruments_used = db.query(Measuring_Instruments_Used).filter(
            Measuring_Instruments_Used.Reference_No == Ref_No
        ).all()
        # Extract only the Equipment_ID into a list
        instrument_ids = [instr.Equipment_ID for instr in instruments_used]

        # instrument_ids = []

        # Fetch samples
        sample_rows = db.query(DimensionSample).filter(
            DimensionSample.Report_Id == d.Id
        ).order_by(DimensionSample.Sample_No).all()

        instrument = db.query(Measuring_Instruments).filter(
            Measuring_Instruments.Equipment_ID == Measuring_Instruments_Used.Equipment_ID).first()
        

        samples_list = [
            {
                "Id": s.Id,
                "Sample_No": s.Sample_No,
                "Value": s.Value,
                "Status": s.Status,
                "Remarks": s.Remarks,
                "Dimension_View_Parameter": s.Dimension_View_Parameter,
                "Dimension_Parameter_Unit": s.Dimension_Parameter_Unit,
            }
            for s in sample_rows
        ]

        dimensions_list.append({
            "Report_Id": d.Id,
            "Dimension_Type_Id": d.Dimension_Type_Id,
            "Dimension_Name": d.dimension_type.Name,
            "Basic_Dimension": d.Basic_Dimension,
            "Tolerance": d.Tolerance,
            "Min": d.Min,
            "Max": d.Max,
            "Measuring_Instruments": instrument,
            "Samples": samples_list
        })


    


    # dimension = db.query(DimensionSample).filter(
    #     DimensionSample.Reference_No == Ref_No
    # ).all()

    # dimension = None
    # if dimension:
    #     dimension_data = {
    #         "Id":dimension.Id,
    #         # Report_Id 
    #         # Sample_No 
    #         # Value 
    #         # Status 
    #         # Remarks 
    #         # Dimension_View_Parameter 
    #         # Dimension_Parameter_Unit 
    #     },

    dimension_data = db.query(DimensionReport).options(joinedload(DimensionReport.samples))\
        .filter(DimensionReport.Reference_No == Ref_No).all()

    results = []
    indentor = db.query(Intender_Report).filter(
        Intender_Report.Reference_No == Ref_No
    ).all()

    for indent in indentor:

            indent = {
                "Project_SaleOrder" : indent.Project_SaleOrder,
                "Serial_Numbers": indent.Serial_Numbers,
                "Result" : indent.Result,
                "Remarks": indent.Remarks,
                "Date" : indent.Date,
                "Status" :indent.Status,
                "UserID" : indent.userID,
                "UserName" : indent.userName,
                "UserRole" : indent.userRole,
                "UserSBU" : indent.userSBU,
                "UserSBUDIV" : indent.userSBUDIV,
            },
            results.append({"Data" : indent})




    record = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == Ref_No
    ).first()


    remarks = {
        "Remarks": record.insRemarks if record else "",
        
        "insUserID" : record.insUserID if record else "",
        "insUserName" : record.insUserName if record else "",
        "insUserRole" : record.insUserRole if record else "",
        "insUserSBU" : record.insUserSBU if record else "",
        "insUserSBUDIV" : record.insUserSBUDIV if record else "",
        "insDate" : record.insDate if record else "",       

        "appUserID" : record.appUserID if record else "",
        "appUserName" : record.appUserName if record else "",
        "appUserRole" : record.appUserRole if record else "",
        "appUserSBU" : record.appUserSBU if record else "",
        "appUserSBUDIV" : record.appUserSBUDIV if record else "",
        
        }

    material = db.query(MaterialTables).filter(
        MaterialTables.Reference_No == Ref_No
    ).all()
    
    

    # ---------------------------------------------------------
    # FINAL RESPONSE
    # ---------------------------------------------------------
    return {
        "QR_Record": qr_data,
        "SubContract": subcontract_data,
        "Common_Dimension": common_data,
        "Dimensions": dimensions_list,
        "Indentor_Data": results,
        "dimensions": dimension_data, 
        "materialrecords": material,     
        "Inspection_Report" : remarks,
        
    }



from fastapi import Query

@app.get("/indenter/details")
def get_indenter_details( sbu:str, db: Session = Depends(init_db)):
    """
    Retrieves user details from UserProfile table 
    filtered by a specific SBU and the 'Indenter' role.
    """
    TARGET_ROLE = "Indentor"

    records = db.query(UserProfile).filter(
        UserProfile.userRole == TARGET_ROLE,
        UserProfile.sbu == sbu,
    ).all()
    
    result = []
    for r in records:
        result.append({
            "username": r.username ,
            "userID":  r.userID,
            "userRole": r.userRole,
            "sbu":r.sbu,
            "subdivision": r.subdivision,
        })
    
    return result

@app.get("/approver/details")
def get_indenter_details( sbu:str, db: Session = Depends(init_db)):
    if not sbu:
        raise HTTPException(400, "sbu missing")
    TARGET_ROLE = "Approver"

    records = db.query(UserProfile).filter(
        UserProfile.userRole == TARGET_ROLE,
        UserProfile.sbu == sbu,
    ).all()
    
    result = []
    for r in records:
        result.append({
            "username": r.username ,
            "userID":  r.userID,
            "userRole": r.userRole,
            "sbu":r.sbu,
            "subdivision": r.subdivision,
        })
    
    return result





############################Indentor Endpoints###############################

@app.get("/indentor/all")
def get_indenter_ref_all(db: Session = Depends(init_db)):
    
    data = db.query(IndenterApproval).all()

    result=[]
    for a in data:
        refno = a.Reference_No

        details = db.query(QRRecord_Generated).filter(QRRecord_Generated.Reference_No==refno).first()

        result.append({
        
           "Reference_No" : refno,

           "BEL_Part_Number" : details.BEL_Part_Number,
           "BEL_PO_No" : details.BEL_PO_No,
           "GR_No": details.GR_No,
           "Serial_No" : a.serialNo,
           "Status": a.Status,

           "inspector_name":a.insUserID, 
           "insUserName":a.insUserName , 
            "insUserRole": a.insUserRole,
            "insUserSBU" : a.insUserSBU,
            "insUserSBUDIV": a.insUserSBUDIV,
        })

    return result
  
@app.get("/indentor/Inspected/verification/details")
def get_indentor_ref_details(Ref_No:str,SerialNo:str,Inspection_type:str,db: Session = Depends(init_db)):

    print(Ref_No, SerialNo,Inspection_type )

    record = db.query(QRRecord_Generated).filter(
        QRRecord_Generated.Reference_No == Ref_No
    ).first()
    # print(type(record))
    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No Generated QR report found for Reference_No {Ref_No}"
        )

    saleorder=""
    if Inspection_type=="SubContract_Inspection":
        sub_record = db.query(SubContract_Inspection).filter(
            SubContract_Inspection.Reference_No == Ref_No
        ).first()
        if not sub_record:
            raise HTTPException(
                status_code=404,
                detail=f"No subcontract inspection report found for Reference_No {Ref_No}"
            )
        else:
            saleorder = sub_record.Sale_Order
    elif Inspection_type=="Material_Inspection":
        Mat_record = db.query(MaterialInspection).filter(
            MaterialInspection.Reference_No == Ref_No
        ).first()
        if not Mat_record:
            raise HTTPException(
                status_code=404,
                detail=f"No subcontract inspection report found for Reference_No {Ref_No}"
            )
        else:
            saleorder = Mat_record.SO_Number if Mat_record.SO_Number else ""
    else:
        raise HTTPException(
                status_code=404,
                detail=f"Inspection type invalid"
            )




    Ind_record = db.query(IndenterApproval).filter(
        IndenterApproval.Reference_No == Ref_No,IndenterApproval.serialNo==SerialNo
    ).first()
    if not Ind_record:
        raise HTTPException(
            status_code=404,
            detail=f"No Indentor record found for Reference_No {Ref_No}"
        )


    result = {

        "SO_Number":saleorder,
        


        "Reference_No":Ref_No,
        "Description":record.Description,
        "PO_Number":record.BEL_PO_No,
        "Part_Number":record.BEL_Part_Number,
        "GR_Number":record.GR_No,
        "Supplier":record.Vendor_Name,
        "Quantity":record.Quantity,


        "Serial_No":Ind_record.serialNo,
        "insUserID" : Ind_record.insUserID,
        "insUserName" : Ind_record.insUserName,
        "insUserRole" : Ind_record.insUserRole,
        "insUserSBU" : Ind_record.insUserSBU,
        "insUserSBUDIV" : Ind_record.insUserSBUDIV

    }
    return result


# @app.get("/indentor/status")
# def get_indentor_status(Ref_No: str, db: Session = Depends(init_db)):
#     if not Ref_No:
#         raise HTTPException(400, "Reference_No missing")
    
#     # Use .all() to get all matching records
#     records = db.query(Intender_Report).filter(
#         Intender_Report.Reference_No == Ref_No
#     ).all()


#     # Return a list of dictionaries
#     return [
#         {
#             "Reference_No": Ref_No,
#             "Result": rec.Result,
#             "Serial_Numbers": rec.Serial_Numbers,
#             "Remarks": rec.Remarks,
#             "Status": rec.Status,
#         } for rec in records
#     ]

@app.get("/indentor/status")
def get_indentor_status(Ref_No: str, db: Session = Depends(init_db)):
    if not Ref_No:
        raise HTTPException(400, "Reference_No missing")
    
    # Use .all() to get all matching records
    records = db.query(Intender_Report).filter(
        Intender_Report.Reference_No == Ref_No
    ).all()

    # records2 = db.query(IndenterApproval).filter(
    #     IndenterApproval.Reference_No == Ref_No
    # ).all()

    # Return a list of dictionaries
    result = []
    for rec in records:
        result.append({
            "Reference_No": Ref_No,
            "Result": rec.Result,
            "Serial_Numbers": rec.Serial_Numbers,
            "Remarks": rec.Remarks,
            "Status": rec.Status,
        }) 

   
    # result[0].update({"pending_status": records2[0].Status})

    return result


@app.get("/indentor/responsestatus")
def responsestatus(Ref_No: str, db: Session = Depends(init_db)):
    if not Ref_No:
        raise HTTPException(400, "Reference_No missing")
    result=[]
    records2 = db.query(IndenterApproval).filter(
        IndenterApproval.Reference_No == Ref_No
    ).all()
    for rec in records2 :
        result.append({
        
            "Reference_No": Ref_No,
            "Serial_Numbers": rec.serialNo,

            "pending_status": rec.Status,
        }) 
    return result

    



@app.post("/indentor/report")
def save_intender_report(payload: dict, db: Session = Depends(init_db)):

    try:
        ref_no = payload.get("Reference_No")
        if not ref_no:
            raise HTTPException(400, "Reference_No missing")

        # Check if the reference exists in QRRecord_Generated
        qr = db.query(QRRecord_Generated).filter(
            QRRecord_Generated.Reference_No == ref_no
        ).first()

        if not qr:
            raise HTTPException(
                status_code=404,
                detail=f"Reference_No '{ref_no}' does not exist in QRRecord_Generated"
            )

        # Insert new Intender report entry
        new_entry = Intender_Report(
            Reference_No=ref_no,
            Project_SaleOrder=payload.get("Project_SaleOrder"),
            Result=payload.get("Result"),
            Serial_Numbers=payload.get("Serial_Numbers"),
            Remarks=payload.get("Remarks"),
            Date=payload.get("Date"),
            Status=payload.get("Status"),
            userID = payload.get("userID"),
            userName = payload.get("userName"),
            userRole = payload.get("userRole"),
            userSBU = payload.get("userSBU"),
            userSBUDIV = payload.get("userSBUDIV")
        )
        assign = db.query(IndenterApproval).filter(IndenterApproval.Reference_No==ref_no).first()
        setattr(assign, "Status", payload.get("Status"))

        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)

        return {
            "status": "success",
            "message": "Intender report saved successfully",
            "data": {
                "Id": new_entry.Id,
                "Reference_No": new_entry.Reference_No
            }
        }

    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(500, f"Error saving Intender report: {e}")



@app.post("/indenter/update")
def update_status(payload: dict, db: Session = Depends(init_db)):
    # print(payload)
    # return {"message": "Updated"}
    try:
        ref_no = payload.get("Reference_No")
        if not ref_no:
            raise HTTPException(400, "Reference_No missing")

        # ind_ID = payload.get("indUserID")

        # # Check if the reference exists
        # # qr = db.query(IndenterApproval).filter(
        # #     IndenterApproval.Reference_No == ref_no
        # # ).first()

        # if not ind_ID:
        #     raise HTTPException(
        #         status_code=403,
        #         detail=f"Not Authorised"
        #     )

        # Insert new Intender report entry
        temp = payload.get("Serial_No")
        list_of_serials=temp.split(",")
        for i in list_of_serials:
            new_entry = IndenterApproval(
                Reference_No=payload.get("Reference_No"),
                serialNo =i,
                indUserID = payload.get("indUserID"),
                indUserName = payload.get("indUserName"),
                # indUserRole= payload.get("indUserRole"),
                indUserSBU= payload.get("indUserSBU"),
                indUserSBUDIV=payload.get("indUserSBUDIV"),
                indPhoneNo = payload.get("indPhoneNo"),
                # date=datetime.strptime(payload.get("date"), "%d-%m-%Y")
                #     if payload.get("date") else datetime.now(),
                date = payload.get("date"),
                insUserID = payload.get("insUserID"),
                insUserName = payload.get("insUserName"),
                insUserRole = payload.get("insUserRole"),
                insUserSBU = payload.get("insUserSBU"),
                insUserSBUDIV = payload.get("insUserSBUDIV"),
                Status=payload.get("Status")
            )
            db.add(new_entry)
            db.commit()
            db.refresh(new_entry)
        # status =db.get

        # assignment = db.get(PCBAssignment, log.assignment_id)

        # if current_step.next_step_id is None:
        # assignment.overall_status = "COMPLETED"
        # assignment.current_step_id = None
        # db.commit()
        # return

        

        return {
            "status": "success",
            "message": "Intender report updated successfully",
            "data": {
                # "Id": new_entry.Id,
                "Reference_No": new_entry.Reference_No
            }
        }

    except Exception as e:
        print(e)
        db.rollback()
        raise HTTPException(500, f"Error saving Intender report: {e}")

############################ End of Indentor Endpoints###############################





############################ LogData Endpoints ###############################
@app.get("/details")
def get_details(db:Session = Depends(init_db)):
    db_records = db.query(QRRecord_db).filter(QRRecord_db.GR_No!=None).all()
    return db_records

@app.get("/logdata")
def get_generated_details(db:Session = Depends(init_db)):
    db_records = db.query(LogBook_db).all()
    return db_records

@app.post("/logdata/save")
def save_logdata(payload: dict, db: Session = Depends(init_db)):

    print(payload)
    new_entry = LogBook_db(

        # SL_No = payload.get("Serial_Numbers"),
        Timestamp =payload.get("Timestamp"),
        BEL_Part_Number = payload.get("BEL_Part_Number"),
        MPN = payload.get("MPN"),
        Batch_Lot_No = payload.get("Batch_Lot_No"),
        DateCode = payload.get("DateCode"),
        Quantity = payload.get("Quantity"),
        BEL_PO_No = payload.get("BEL_PO_No"),
        Vendor_Name = payload.get("Vendor_Name"),
        OEM_Make = payload.get("OEM_Make"),
        Manufacturing_Place = payload.get("Manufacturing_Place"),
    )

    db.add(new_entry)
    db.commit()

    db.refresh(new_entry)

    return {
        "status": "success",
        "message": " log saved successfully",
        "data": {
            "Id": new_entry.SL_No,
            "BEL_Part_Number": new_entry.BEL_Part_Number
        }
    }


############################ Material Inspection Endpoints ###############################


@app.get("/materialinspectionreport")
def get_material_report(Ref_No: str, db: Session = Depends(init_db)):
    seed_dimension_reports(db,Ref_No)

    ref_exists = db.query(QRRecord_Generated).filter(
    QRRecord_Generated.Reference_No == Ref_No
    ).first()
    if not ref_exists:
        raise HTTPException(status_code=404, detail="Reference_No not found.")

    record = db.query(MaterialInspection).filter(
        MaterialInspection.Reference_No == Ref_No
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No subcontract inspection report found for Reference_No {Ref_No}"
        )
    
    # ref_exists.overall_status = "In Inspection"

    return record

@app.put("/materialinspectionreport")
def update_material_inspection_report(
    Ref_No: str,
    updated_data: dict,
    db: Session = Depends(init_db)
):

    # Fetch existing record
    record = db.query(MaterialInspection).filter(
        MaterialInspection.Reference_No == Ref_No
    ).first()

    if not record:
        raise HTTPException(
            status_code=404,
            detail=f"No MaterialInspection report found for Reference_No {Ref_No}"
        )

    # Update only provided fields
    for field, value in updated_data.items():
        if hasattr(record, field) and value is not None:
            setattr(record, field, value)

    db.commit()
    db.refresh(record)

    return {"message": "MaterialInspection  report updated successfully", "data": record}

@app.post("/materialinspection/save")
async def save_material_inspection(payload: dict, db: Session = Depends(init_db)):
    print(payload["inspection_rows"])
    payload2=payload["inspection_rows"]

    # for p in payload2:

    ref_no = payload.get("Reference_No")
    t_type = payload.get("Type")
    if not ref_no:
        raise HTTPException(status_code=400, detail="Reference_No missing")

    # db.query(MaterialTables).filter(MaterialTables.Reference_No == ref_no,MaterialTables.Type == t_type ).delete()

    for s in payload["inspection_rows"]:
        print(s["MIC_No"])
        new_entry = MaterialTables(

            Reference_No=ref_no,
            Type=payload.get("Type"),
            InspDate=date.today(),
            Remarks=payload.get("Remarks"),

            MIC_No=s["MIC_No"],
            MIC=s["MIC"],
            MIC_Desc=s["MIC_Desc"],
            Sampling_Procedure=s["Sampling_Procedure"],
            Sampling_Qty=s["Sampling_Qty"],
            Inspected_Qty=s["Inspected_Qty"],
            UoM=s["UoM"],
            TargetValue=s["TargetValue"],
            LowerLimit=s["LowerLimit"],
            UpperLimit=s["UpperLimit"],
            SampleNo=s["SampleNo"],
            Result=s["Result"],
            Valuation=s["Valuation"],
        )
        db.add(new_entry)
    db.commit()
    return {"status": "success", "message": "Inspection data saved"}


@app.post("/materialinspection/sample")
async def save_material_inspection(payload: dict, db: Session = Depends(init_db)):
    print(payload["inspection_rows"])
    payload2=payload["inspection_rows"]

    # for p in payload2:
    
    ref_no = payload.get("Reference_No")
    t_type = payload.get("Type")

    instrument_id = payload.get('Instrument_id',[])
    # print(instrument_id)
    for id in instrument_id:
        count = db.query(Measuring_Instruments_Used).filter(Measuring_Instruments_Used.Reference_No==ref_no,
         Measuring_Instruments_Used.Equipment_ID==id).count()
        if count ==0:
            intrument_used = Measuring_Instruments_Used(
                Reference_No = ref_no,
                Equipment_ID = id


            )
            db.add(intrument_used)
            db.commit()

    if not ref_no:
        raise HTTPException(status_code=400, detail="Reference_No missing")

    # db.query(MaterialTables).filter(MaterialTables.Reference_No == ref_no,MaterialTables.Type == t_type ).delete()
    for s in payload["inspection_rows"]:
        print(s["MIC_No"])
        new_entry = MaterialTables(

            Reference_No=ref_no,
            Type=payload.get("Type"),
            InspDate=date.today(),
            Remarks=payload.get("Remarks"),

            MIC_No=s["MIC_No"],
            MIC=s["MIC"],
            MIC_Desc=s["MIC_Desc"],
            Sampling_Procedure=s["Sampling_Procedure"],
            Sampling_Qty=s["Sampling_Qty"],
            Inspected_Qty=s["Inspected_Qty"],
            UoM=s["UoM"],
            TargetValue=s["TargetValue"],
            LowerLimit=s["LowerLimit"],
            UpperLimit=s["UpperLimit"],
            SampleNo=s["SampleNo"],
            Result=s["Result"],
            Valuation=s["Valuation"],
        )
        db.add(new_entry)
    db.commit()
    return {"status": "success", "message": "Inspection data saved"}


@app.get("/materialinspectionrecords")
def get_material_report(
    Ref_No :str,
    db : Session =Depends(init_db)
):
    record = db.query(MaterialTables).filter(
        MaterialTables.Reference_No == Ref_No
    ).all()

    return record


@app.post("/materialdimensionreport/samples")
def save_material_dimension_report(payload: dict, db: Session = Depends(init_db)):

    ref_no = payload["Reference_No"]

    instrument_id = payload.get('Instrument_id',[])
    # print(instrument_id)
    for id in instrument_id:
        count = db.query(Measuring_Instruments_Used).filter(Measuring_Instruments_Used.Reference_No==ref_no,
         Measuring_Instruments_Used.Equipment_ID==id).count()
        if count ==0:
            intrument_used = Measuring_Instruments_Used(
                Reference_No = ref_no,
                Equipment_ID = id


            )
            db.add(intrument_used)
            db.commit()
    # 1️⃣ Save COMMON DATA
    common = payload.get("Common", {})
    common_row = DimensionCommonReport(
        Reference_No=ref_no,
        **common
    )
    qr = db.query(DimensionCommonReport).filter(
            DimensionCommonReport.Reference_No == ref_no
        ).first()
    if not qr:
        db.add(common_row)
        db.commit()
    else:
        db.query(DimensionCommonReport).filter(
            DimensionCommonReport.Reference_No == ref_no
        ).delete()
        db.add(common_row)
        db.commit()
        # raise HTTPException(400, "Reference_No already exists")

    # 2️⃣ Save EACH DIMENSION + Samples
    for dim in payload["Dimensions"]:

        # Update or Insert Dimension Report
        report = db.query(MaterialTables).filter(
            MaterialTables.Id == dim["Report_Id"] 
        ).first()

        

        # if not report:
        #     report = MaterialTables(
        #         Id=dim["Report_Id"],
        #         Reference_No=ref_no
        #     )

        # report.Basic_Dimension = dim["Basic_Dimension"]
        # report.Tolerance = dim["Tolerance"]
        # report.Min = dim["Min"]
        # report.Max = dim["Max"]

        # db.add(report)
        # db.commit()

        # Clear old samples
        db.query(MaterialTables).filter(
            MaterialTables.Report_Id == report.Id
        ).delete()
        db.commit()

        # Insert new samples
        for s in dim["Samples"]:
            sample = MaterialTables(
                Report_Id=report.Id,

                # MIC_No = Column(Integer)	
                # MIC	= Column(String)
                # MIC_Desc = Column(String)
                # Sampling_Procedure = Column(String)
                # Sampling_Qty = Column(String)	
                # Inspected_Qty = Column(String)
                # UoM	= Column(String)
                # TargetValue	= Column(String)
                # LowerLimit = Column(String)
                # UpperLimit	= Column(String)
                # SampleNo = Column(Integer)	
                # Result = Column(String)
                # Valuation = Column(String)
                # InspDate = Column(Date)

               
                Sample_No=s["Sample_No"],
                Value=s["Value"],
                Status=s["Status"],
                Remarks = s['Remarks'],
                Dimension_View_Parameter = s['Dimension_View_Parameter'],
                Dimension_Parameter_Unit = s['Dimension_Parameter_Unit']
            )
            db.add(sample)

        db.commit()

    return {"status": "success", "message": "Dimension data saved successfully"}


############################ Traceability Endpoints ###############################

@app.get("/refs")
def get_ref_list( db: Session = Depends(init_db)):
    refs = db.query(QRRecord_Generated).all()
    return refs


@app.get("/reflist")
def get_ref_list( db: Session = Depends(init_db)):
    refs = db.query(QRRecord_Generated.BEL_Part_Number).all()
    ref_list =[r[0] for r in refs]

    return {"References" : ref_list}

@app.get("/traceability")
def get_traceability_details(ref_no: str, db: Session = Depends(init_db)):
    # 1. Fetch Log Entry (LogBook_db)
    # Note: LogBook_db doesn't have Reference_No in the snippet, 
    # but QRRecord_Generated (QR) is created from it. 
    # We'll use the QR record's timestamp as the generation point.
    
    qr_record = db.query(QRRecord_Generated).filter(
        QRRecord_Generated.Reference_No == ref_no
    ).first()

    

    if not qr_record:
        raise HTTPException(status_code=404, detail="Traceability record not found")

    ref_no = qr_record.Reference_No
    
    # 2. Fetch Inspection Start/End (Authorized_Person contains submission data)
    inspection_details = db.query(Authorized_Person).filter(
        Authorized_Person.Reference_No == ref_no
    ).first()

    # 3. Fetch Approver details (IndenterApproval / Authorized_Person)
    # Based on the models, 'Authorized_Person' stores appDate (Approval Date) 
    # and 'overall_status' in QRRecord_Generated tracks the stage.

    return {
        "reference_no": ref_no,
        "part_info": {
            "part_number": qr_record.BEL_Part_Number,
            "description": qr_record.Description,
            "vendor": qr_record.Vendor_Name,
            "po_no" :qr_record.BEL_PO_No,
            
        },
        "timeline": {
            "type": qr_record.inspection_type,
            "log_entry": qr_record.Timestamp,  # When the data was first logged
            "gr_no": qr_record.GR_No,
            "gr_date": qr_record.GR_Date,      # Goods Receipt Date
            "qr_generated": qr_record.Timestamp, # Timestamp when QR was finalized
            "ig_userID":qr_record.userID,
            "ig_userName": qr_record.userName,

            "inspection_started": inspection_details.insDate if inspection_details else None,
            "inspection_submitted": inspection_details.insDate if inspection_details else None,
            "inspectorID": inspection_details.insUserID if inspection_details else None,
            "inspectorName":inspection_details.insUserName if inspection_details else None,
            "inspection_remarks": inspection_details.insRemarks if inspection_details else None,
            "approval_date": inspection_details.appDate if inspection_details else None,
            "approval_status": qr_record.overall_status,
            "approver_remarks": inspection_details.appRemarks if inspection_details else None,
            "approverID": inspection_details.appUserID if inspection_details else None,
            "approverName": inspection_details.appUserName if inspection_details else None,
            "sbu": inspection_details.appUserSBU if inspection_details else None,
            "subdivision" : inspection_details.appUserSBUDIV if inspection_details else None,
        }
    }

############################################### Delete Endpoint #######################################################

@app.delete("/admin/reset_all")
def reset_all(db: Session = Depends(init_db)):
    # Order matters: Drop child tables (with Foreign Keys) before parent tables
    tables_to_reset = [
        "dimension_samples",           # Depends on dimension_reports
        "dimension_instrument_map",    # Depends on dimension_reports & measuring_instruments
        "measuring_instrument_used",   # Depends on generated_qr_records & measuring_instruments
        "subcontract_inspection",      # Depends on generated_qr_records
        "dimension_reports",           # Depends on generated_qr_records & dimension_types
        "dimension_common_report",     # Depends on generated_qr_records
        "intender_report",             # Depends on generated_qr_records
        "user_data",                   # Depends on generated_qr_records
        "indenter_approval_details",   # Depends on generated_qr_records
        "indenter_table",              # Depends on userProfiles (but we delete this link)
        # "generated_qr_records",        # Parent of many
        "qr_records",                  # Standalone
        "log_book",                    # Standalone
        "dimension_types",             # Parent of dimension_reports
        "measuring_instruments",       # Parent of linksS
    ]

    try:
        for tbl in tables_to_reset:
            if tbl in base.metadata.tables:
                # Use checkfirst=True to avoid errors if a table was already gone
                base.metadata.tables[tbl].drop(bind=engine, checkfirst=True)
        
        # Optional: Recreate them immediately so the app doesn't crash on next query
        # base.metadata.create_all(bind=engine)
        
        return {"message": "All tables except userProfiles have been reset."}
    
    except Exception as e:
        return {"error": str(e)}






############################################################################################################################################
###################################################### NPTRM ###############################################################################
############################################################################################################################################




def normalize_staff(value: Optional[str]) -> str:
    """Converts 169 → E169, e169 → E169 etc."""
    if not value:
        raise ValueError("staff cannot be empty")

    s = str(value).strip().upper()

    if s.startswith("E") and s[1:].isdigit():
        return f"E{int(s[1:])}"

    if s.isdigit():
        return f"E{int(s)}"

    return s


def find_user_from_profiles(db: Session, staff: str):
    """Returns userProfiles row for staff number or None."""
    staff = staff.strip()
    return db.execute(
        select(UserProfile).where(func.trim(UserProfile.userID) == staff)
    ).scalar_one_or_none()



# def get_indenters_by_role(session, role_name):
#     """
#     Fetches all Indenters where the linked User has a specific role.
#     """
#     return (
#         session.query(Indenter)
#         .join(UserProfile) # Links the two tables
#         .options(joinedload(Indenter.user)) # Optimizes performance
#         .filter(UserProfile.userRole == role_name) # Your filter
#         .all()
#     )

# ============================================================
# MODELS
# ============================================================



# ============================================================
# FILE READER
# ============================================================

def read_file_content(file: UploadFile):
    content = file.file.read()

    if file.filename.lower().endswith((".xlsx", ".xls")):
        try:
            return pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Excel read error: {e}")

    try:
        return pd.read_csv(io.StringIO(content.decode("utf-8")))
    except:
        return pd.read_csv(io.StringIO(content.decode("latin1")))

# ============================================================
# ADVANCE STEP
# ============================================================

def advance_step(db: Session, log: PCBProcessLog):
    """Moves PCB to next step and updates assignment.current_step_id."""
    current_step = db.get(ProcessFlowMaster, log.flow_step_id)
    if not current_step:
        return

    assignment = db.get(PCBAssignment, log.assignment_id)

    # LAST STEP → COMPLETED
    if current_step.next_step_id is None:
        assignment.overall_status = "COMPLETED"
        assignment.current_step_id = None
        db.commit()
        return

    # MOVE TO NEXT STEP
    next_step_id = current_step.next_step_id
    assignment.current_step_id = next_step_id
    db.add(assignment)

    # Create new log for next step
    new_log = PCBProcessLog(
        assignment_id=log.assignment_id,
        flow_step_id=next_step_id,
        process_status="PENDING"
    )
    db.add(new_log)
    db.commit()



# ============================================================
# REQUEST MODELS
# ============================================================

# class OperatorActionRequest(BaseModel):
#     log_id: int
#     operator_staff_no: str
#     action: str


# ============================================================
# FASTAPI APP
# ============================================================

# ============================================================
# UPLOAD TASK MATRIX
# ============================================================

@app.post("/upload_task_data")
def upload_task_data(file: UploadFile = File(...), db: Session = Depends(init_db)):
    """
    Upload Skill Matrix and update:
      ● ProcessFlowMaster (steps)
      ● OperatorStepMapping (operator-task mapping)
    Uses UserProfile table to validate operators.
    """

    # ---------------- READ FILE ----------------
    df = read_file_content(file)
    if df is None or df.empty:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    df.columns = df.columns.str.strip()

    REQUIRED = [
        "pcbProcessName",
        "assignedTo",
        "assignedToName",
        "assignedToNameInitial",
        "assignedToNameMRL",
        "assignedToNameMRLExpiry"
    ]

    missing = [c for c in REQUIRED if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing}")

    df["pcbProcessName"] = df["pcbProcessName"].astype(str).str.strip()
    df["assignedTo_raw"] = df["assignedTo"].astype(str).str.strip()

    # ---------------- RESOLVE OPERATORS ----------------
    resolved = []
    missing_users = set()

    for _, row in df.iterrows():
        raw = str(row["assignedTo_raw"]).strip()

        try:
            staff_canonical = normalize_staff(raw)
        except Exception:
            missing_users.add(raw)
            resolved.append(None)
            continue

        user = find_user_from_profiles(db, staff_canonical)

        if not user and staff_canonical.startswith("E"):
            user = find_user_from_profiles(db, staff_canonical[1:])

        resolved.append(user.userID if user else None)

    df["assignedTo_canonical"] = resolved

    # ---------------- CREATE UNIQUE STEPS ----------------
    unique_steps = []
    seen = set()

    for name in df["pcbProcessName"]:
        n = str(name).strip()
        if n and n not in seen:
            seen.add(n)
            unique_steps.append(n)

    existing_step_names = set(
        db.execute(select(ProcessFlowMaster.step_name)).scalars().all()
    )

    new_steps = []

    for step_name in unique_steps:
        if step_name not in existing_step_names:

            r = df.loc[df["pcbProcessName"] == step_name].iloc[0]

            # FIX: Convert numpy float / NaN to safe strings
            mrl = r["assignedToNameMRL"]
            mrl_exp = r["assignedToNameMRLExpiry"]

            mrl = None if pd.isna(mrl) else str(mrl)
            mrl_exp = None if pd.isna(mrl_exp) else str(mrl_exp)

            new_steps.append(
                ProcessFlowMaster(
                    step_name=step_name,
                    assignedToNameMRL=mrl,
                    assignedToNameMRLExpiry=mrl_exp
                )
            )

    if new_steps:
        db.add_all(new_steps)
        db.flush()

    # ---------------- SET step_order = flow_step_id ----------------
    all_steps = db.execute(select(ProcessFlowMaster)).scalars().all()
    for s in all_steps:
        s.step_order = s.flow_step_id
        db.add(s)

    db.flush()

    # ---------------- BUILD NEXT_STEP_ID MAPPING ----------------
    ordered_steps = db.query(ProcessFlowMaster).order_by(ProcessFlowMaster.step_order.asc()).all()

    for i in range(len(ordered_steps) - 1):
        ordered_steps[i].next_step_id = ordered_steps[i + 1].flow_step_id
        db.add(ordered_steps[i])

    if ordered_steps:
        ordered_steps[-1].next_step_id = None
        db.add(ordered_steps[-1])

    db.flush()

    # ---------------- CREATE OPERATOR → STEP MAPPING ----------------
    new_maps = []
    mappings_count = 0

    for _, r in df.iterrows():
        operator_id = r["assignedTo_canonical"]
        if not operator_id:
            continue
        MRL_level =str(r["assignedToNameMRL"]).strip()
        name = str(r["assignedToName"]).strip()
        Initial= str(r[ "assignedToNameInitial"]).strip()
       
        expiry = str(r["assignedToNameMRLExpiry"]).strip()
        # print(operator_id,name,Initial,MRL_level,expiry)
        step_name = str(r["pcbProcessName"]).strip()

        step = db.execute(
            select(ProcessFlowMaster).where(ProcessFlowMaster.step_name == step_name)
        ).scalar_one_or_none()

        if not step:
            continue

        exists = db.execute(
            select(OperatorStepMapping)
            .where(OperatorStepMapping.flow_step_id == step.flow_step_id)
            .where(OperatorStepMapping.operator_staff_no == operator_id)
        ).first()

        if not exists:
            new_maps.append(
                OperatorStepMapping(
                    flow_step_id=step.flow_step_id,
                    operator_staff_no=operator_id,
                    operator_name = name,
                    operator_initial = Initial,
                    operator_MRL = MRL_level,
                    operator_MRL_Expiry= expiry

                )
            )
            mappings_count += 1

    if new_maps:
        db.add_all(new_maps)

    db.commit()

    return {
        "message": "Task upload completed",
        "steps_added": len(new_steps),
        "mappings_added": mappings_count,
        "missing_users": list(missing_users)
    }

# ============================================================
# SUPERVISOR ASSIGN PCB
# ============================================================


from fastapi import Request


# @app.post("/supervisor/assign")
# def supervisor_assign(
#     request: Request,
#     supervisor_staff_no: str = Query(...),
#     pcb_serial_parts: List[str] = Query(None, alias="pcb_serial_parts[]"),
#     db: Session = Depends(init_db)
# ):
#     """
#     FINAL VERSION
#     - Accepts pcb_serial_parts[] even when containing '$'
#     - Falls back to raw query parsing before 400 error occurs
#     """

#     # -----------------------------
#     # 1️⃣ Extract PCB list SAFELY
#     # -----------------------------
#     if not pcb_serial_parts:
#         raw_qs = request.scope.get("query_string", b"").decode()

#         import urllib.parse
#         parsed = urllib.parse.parse_qs(raw_qs)

#         pcb_serial_parts = (
#             parsed.get("pcb_serial_parts[]") or
#             parsed.get("pcb_serial_parts") or
#             []
#         )

#     if not pcb_serial_parts:
#         raise HTTPException(status_code=400, detail="No PCB serial numbers provided")

#     # -----------------------------
#     # 2️⃣ Validate supervisor
#     # -----------------------------
#     supervisor = find_user_from_profiles(db, supervisor_staff_no)
#     if not supervisor:
#         raise HTTPException(status_code=404, detail="Supervisor not found")

#     is_supervisor = (supervisor.userRole or "").strip().upper() in (
#         "SUPERVISOR", "SUPERVISOR INTERNAL", "SUPERVISORINTERNAL"
#     )
#     if not is_supervisor:
#         raise HTTPException(status_code=403, detail="Not authorized")

#     # -----------------------------
#     # 3️⃣ Load full process flow
#     # -----------------------------
#     flow = db.query(ProcessFlowMaster).order_by(ProcessFlowMaster.step_order.asc()).all()
#     if not flow:
#         raise HTTPException(status_code=500, detail="Process flow empty")

#     # find step order positions
#     first_step = flow[0].flow_step_id
#     step_15 = None
#     for s in flow:
#         if s.step_order == 15:
#             step_15 = s.flow_step_id
#             break

#     assign_count = 0

#     # -----------------------------
#     # 4️⃣ Process each PCB ID
#     # -----------------------------
#     for raw_id in pcb_serial_parts:

#         # Lookup PCB
#         pcb = db.execute(
#             select(PcbData).where(PcbData.PCBserialNoPartNumber == raw_id)
#         ).scalar_one_or_none()

#         if not pcb:
#             print("PCB NOT FOUND:", raw_id)
#             continue

#         # -----------------------------
#         # Prevent duplicate assignment
#         # -----------------------------
#         existing = db.execute(
#             select(PCBAssignment)
#             .where(PCBAssignment.assigned_pcb_id == raw_id)
#             .where(PCBAssignment.overall_status != "COMPLETED")
#         ).scalar_one_or_none()

#         if existing:
#             continue

#         # -----------------------------
#         # DETERMINE START STEP BY PCB TYPE
#         # -----------------------------
#         pcb_type = (pcb.Type or "").upper()

#         if pcb_type in ("HEXA-CHILD", "OCTA-CHILD"):
#             starting_flow_step_id = first_step      # Step 1
#         elif pcb_type in ("HEXA-MAIN", "OCTA-MAIN"):
#             starting_flow_step_id = step_15         # Step 15
#         else:
#             starting_flow_step_id = first_step      # Default

#         # -----------------------------
#         # Create new assignment
#         # -----------------------------
#         new_assign = PCBAssignment(
#             supervisor_staff_no=supervisor.userID,
#             assigned_pcb_id=raw_id,
#             overall_status="IN_PROGRESS"
#         )
#         db.add(new_assign)
#         db.flush()

#         # Update PCB status
#         pcb.status = "Assigned"
#         pcb.updatedAt = datetime.utcnow()
#         db.add(pcb)

#         # -----------------------------
#         # Insert logs: only from start
#         # -----------------------------
#         start_index = 0
#         for i, step in enumerate(flow):
#             if step.flow_step_id == starting_flow_step_id:
#                 start_index = i
#                 break

#         for i, step in enumerate(flow[start_index:]):
#             db.add(
#                 PCBProcessLog(
#                     assignment_id=new_assign.assignment_id,
#                     flow_step_id=step.flow_step_id,
#                     process_status="PENDING" if i == 0 else "STAGED",
#                     assigned_operator_staff_no=None
#                 )
#             )

#         assign_count += 1

#     db.commit()
#     return {"assigned": assign_count}



def can_proceed(pcb_serial_parts,db):
    pcbspt=pcb_serial_parts
    pcb_serial=pcbspt.split("$")[0]
    print("serial: ",pcb_serial)

    temp=db.query(PcbData,PCBAssignment).outerjoin(PCBAssignment,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PcbData.serialNo == pcb_serial).all()
    # print("temp: ",temp.serialNo)
    for i,j in temp:
        if i.Type == "OCTA-CHILD" or i.Type == "HEXA-CHILD":
            print("serial_naa: ",i.PCBserialNoPartNumber)
            check=db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id == i.PCBserialNoPartNumber).first()
            
            
            # child ehh assign avaledhu but we r tring to assign main part
            if check == None:
                print("check1: ",check)
                return False
            #child is assigned and also completed child processes
            elif check.current_step_id == None:
                print("check2: ",check.assigned_pcb_id)
                return True   
            #child is in progress not yet completed child         
            else:
                print("still in child process <=15")
                continue
    return False
        
def checking_main(pcbsnpt,db):
    temp=db.query(PcbData).filter(PcbData.PCBserialNoPartNumber == pcbsnpt,(PcbData.Type=="OCTA-MAIN") | (PcbData.Type=="HEXA-MAIN")).all()
    
    if len(temp) == 0:
        return False
    elif len(temp)==1:
        print(pcbsnpt,"is_main ka serial : ",temp[0].Type)
        return True

def check_child(serial_no,db):
    temp=db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id == serial_no).all()
    # print("in checking child: ",serial_no," temp",len(temp))
    if temp:
        return True
    return False


@app.post("/supervisor/assign")
def supervisor_assign(
    request: Request,
    supervisor_staff_no: str = Query(...),
    pcb_serial_parts: List[str] = Query(None, alias="pcb_serial_parts[]"),
    db: Session = Depends(init_db)
):
    """
    Supervisor assignment endpoint.
    - Supports pcb_serial_parts[] even when containing '$'
    - Reads raw query string if FastAPI fails to parse
    - Applies PCB workflow starting rules based on Type column
    """

    # ---------------------------------------------------------
    # 1️⃣ Extract PCB list (fallback to manual query parsing)
    # ---------------------------------------------------------
    # print("request: ",request)
    print("supervisor_staff_no: ",supervisor_staff_no)
    print("pcb_serial_parts: ",pcb_serial_parts)
    if not pcb_serial_parts:
        raw_qs = request.scope.get("query_string", b"").decode()
        import urllib.parse
        parsed = urllib.parse.parse_qs(raw_qs)

        pcb_serial_parts = (
            parsed.get("pcb_serial_parts[]") or
            parsed.get("pcb_serial_parts") or
            []
        )
    failed_upload_pcbs=[]
    can_proceed_pcbs=[]
    if not pcb_serial_parts:
        raise HTTPException(status_code=400, detail="No PCB serial numbers provided")
    print(pcb_serial_parts)
    for i in range(0,len(pcb_serial_parts)):
        print("i: ",i)
        print("**************************")
        is_main=checking_main(pcb_serial_parts[i],db)
        if is_main:
            cango=can_proceed(pcb_serial_parts[i],db)
            
            print("is_main: ",is_main," serial: ",pcb_serial_parts[i],end=" => ")
            if cango == False:
                failed_upload_pcbs.append(pcb_serial_parts[i])
                print("cango: ",cango)
                continue
            else:
                can_proceed_pcbs.append(pcb_serial_parts[i])
            print("cango: ",cango)
            print("******************************")
        else:
            if is_main == False:
                print("child: pcbs: ",pcb_serial_parts[i])
                is_present_in_assign_table=check_child(pcb_serial_parts[i],db)
                if is_present_in_assign_table == False:
                    can_proceed_pcbs.append(pcb_serial_parts[i])
    print("failed to upload pcbs: ",failed_upload_pcbs)
    print("success pcbs: ",can_proceed_pcbs)
    pcb_serial_parts.clear()
    print("pcb after clear ",pcb_serial_parts)
    pcb_serial_parts=can_proceed_pcbs
    print("after completd: ",pcb_serial_parts)



    #to check if flow is assigned or not
    check_flow_presence=db.query(ProcessFlowMaster).all()
    if len(check_flow_presence) == 0:
        print("No Flow is present")
        raise HTTPException(status_code=400, detail="No Flow is present")


    #to throw an error if all pcbs which are checked tick in front are not eligible for some kind of reason
    if not pcb_serial_parts:
        print("No PCB(s) are eligible to be assigned")
        raise HTTPException(status_code=400, detail="No PCB(s) are eligible to be assigned")


    
    # ---------------------------------------------------------
    # 2️⃣ Validate supervisor
    # ---------------------------------------------------------
    supervisor = find_user_from_profiles(db, supervisor_staff_no)
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    is_supervisor = (supervisor.userRole or "").strip().upper() in (
        "SUPERVISOR",
        "SUPERVISOR INTERNAL",
        "SUPERVISORINTERNAL"
    )
    
    if not is_supervisor:
        raise HTTPException(status_code=403, detail="Not authorized")

    # ---------------------------------------------------------
    # 3️⃣ Load full ordered process flow
    # ---------------------------------------------------------
    flow = db.query(ProcessFlowMaster).order_by(ProcessFlowMaster.step_order.asc()).all()
    if not flow:
        raise HTTPException(status_code=500, detail="Process flow empty")

    # Cache first step + step 15 flow_step_id
    first_step_id = flow[0].flow_step_id
    step_15_id = next((s.flow_step_id for s in flow if s.step_order == 16), None)
    assign_count = 0
    # ---------------------------------------------------------
    # 4️⃣ Iterate through PCB list
    # ---------------------------------------------------------
    for raw_id in pcb_serial_parts:

        pcb = db.execute(
            select(PcbData).where(PcbData.PCBserialNoPartNumber == raw_id)
        ).scalar_one_or_none()

        if not pcb:
            # print("PCB NOT FOUND:", raw_id)
            continue

        # Prevent double assignment
        existing = db.execute(
            select(PCBAssignment)
            .where(PCBAssignment.assigned_pcb_id == raw_id)
            .where(PCBAssignment.overall_status != "COMPLETED")
        ).scalar_one_or_none()

        if existing:
            continue

        # ---------------------------------------------------------
        # Determine starting step based on PCB Type
        # ---------------------------------------------------------
        pcb_type = (pcb.Type or "").strip().upper()
        print("pcb_type: ",pcb_type)

        # print("pcb_type",step_15_id)

        if pcb_type in ("HEXA-CHILD", "OCTA-CHILD"):
            starting_step_id = first_step_id  # step_order = 1
            end_index=15
            print("under child")
        elif pcb_type in ("HEXA-MAIN", "OCTA-MAIN"):
            starting_step_id = step_15_id     # step_order = 15
            end_index=43
            print("under main")
        else:
            starting_step_id = first_step_id  # default
            end_index=15

        # ---------------------------------------------------------
        # Create assignment
        # ---------------------------------------------------------
        print("raw_id: ",raw_id)
        
        new_assign = PCBAssignment(
            supervisor_staff_no=supervisor.userID,
            assigned_pcb_id=raw_id,
            overall_status="IN_PROGRESS",
            current_step_id=starting_step_id
        )
        db.add(new_assign)
        db.flush()

        # Update PCB status
        pcb.status = "Assigned"
        # pcb.updatedAt = datetime.utcnow()
        db.add(pcb)

        # ---------------------------------------------------------
        # Insert logs only from the determined starting step
        # ---------------------------------------------------------
        start_index = next(
            (i for i, s in enumerate(flow) if s.flow_step_id == starting_step_id),
            0
        )

        for index, step in enumerate(flow[start_index:end_index]):
            # print("index: ",index,"new_assign.assignment_id: ",new_assign.assignment_id," step.flow_step_id: ",step.flow_step_id)
            db.add(
                PCBProcessLog(
                    assignment_id=new_assign.assignment_id,
                    flow_step_id=step.flow_step_id,
                    process_status="PENDING" if index == 0 else "STAGED",
                    assigned_operator_staff_no=None
                )
            )

        assign_count += 1

    db.commit()
    return {"assigned": assign_count}



















# @app.post("/supervisor/assign")
# def supervisor_assign(
#     request: Request,
#     supervisor_staff_no: str = Query(...),
#     pcb_serial_parts: List[str] = Query(None, alias="pcb_serial_parts[]"),
#     db: Session = Depends(init_db)
# ):
#     """
#     Supervisor Assignment Endpoint

#     Supports:
#     - Fresh CHILD assignment
#     - Fresh MAIN assignment
#     - MAIN continuation after CHILD completed
#     - Safe reopening of workflow
#     - Duplicate step protection
#     """

#     # =========================================================
#     # 1️⃣ Extract PCB List (Fallback if FastAPI fails parsing)
#     # =========================================================
#     if not pcb_serial_parts:
#         raw_qs = request.scope.get("query_string", b"").decode()
#         parsed = urllib.parse.parse_qs(raw_qs)

#         pcb_serial_parts = (
#             parsed.get("pcb_serial_parts[]")
#             or parsed.get("pcb_serial_parts")
#             or []
#         )

#     if not pcb_serial_parts:
#         raise HTTPException(status_code=400, detail="No PCB serial numbers provided")

#     # =========================================================
#     # 2️⃣ Validate Supervisor
#     # =========================================================
#     supervisor = find_user_from_profiles(db, supervisor_staff_no)

#     if not supervisor:
#         raise HTTPException(status_code=404, detail="Supervisor not found")

#     if (supervisor.userRole or "").strip().upper() not in (
#         "SUPERVISOR",
#         "SUPERVISOR INTERNAL",
#         "SUPERVISORINTERNAL"
#     ):
#         raise HTTPException(status_code=403, detail="Not authorized")

#     # =========================================================
#     # 3️⃣ Load Full Process Flow
#     # =========================================================
#     flow = db.query(ProcessFlowMaster)\
#              .order_by(ProcessFlowMaster.step_order.asc())\
#              .all()

#     if not flow:
#         raise HTTPException(status_code=500, detail="Process flow empty")

#     first_step_id = flow[0].flow_step_id

#     # Find step_order = 15
#     step_15_id = next(
#         (s.flow_step_id for s in flow if s.step_order == 15),
#         None
#     )

#     assign_count = 0

#     # =========================================================
#     # 4️⃣ Iterate Through Each PCB
#     # =========================================================
#     print("pcb_serial_parts: ",pcb_serial_parts)
#     for raw_id in pcb_serial_parts:

#         pcb = db.execute(
#             select(PcbData).where(
#                 PcbData.PCBserialNoPartNumber == raw_id
#             )
#         ).scalar_one_or_none()

#         if not pcb:
#             continue

#         pcb_type = (pcb.Type or "").strip().upper()
#         print("pcb_type: ",pcb_type)
#         # -----------------------------------------------------
#         # Check Existing Assignment (even if completed)
#         # -----------------------------------------------------
#         # existing_assignment = db.execute(
#         #     select(PCBAssignment)
#         #     .where(PCBAssignment.assigned_pcb_id == raw_id)
#         # ).scalar_one_or_none()
#         print("raw_id: ",len(raw_id)," PCBAssignment.assigned_pcb_id: ",PCBAssignment.assigned_pcb_id)
#         existing_assignment=db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id == raw_id).all()
#         # print("")


#         # =====================================================
#         # 🔥 CASE 1: MAIN continuation on existing assignment
#         # =====================================================
#         print("existing_assignment.assigned_pcb_id",existing_assignment)
#         if existing_assignment and pcb_type in ("HEXA-MAIN", "OCTA-MAIN"):
#             print("inside case1")

#             # Get all existing logs
#             print("existing_assignment: ",existing_assignment)
#             existing_logs = db.query(PCBProcessLog).filter(
#                 PCBProcessLog.assignment_id == existing_assignment.assignment_id
#             ).all()

#             if not existing_logs:
#                 continue

#             existing_step_ids = {log.flow_step_id for log in existing_logs}

#             # Find last created step
#             last_step_id = max(existing_step_ids)

#             # Find its index in master flow
#             start_index = next(
#                 (i for i, s in enumerate(flow) if s.flow_step_id == last_step_id),
#                 None
#             )

#             if start_index is None:
#                 continue

#             # Insert remaining steps (after last_step_id)
#             inserted_steps = []

#             for index, step in enumerate(flow[start_index + 1:]):

#                 # Prevent duplicate insertion
#                 if step.flow_step_id not in existing_step_ids:

#                     status = "PENDING" if index == 0 else "STAGED"

#                     db.add(
#                         PCBProcessLog(
#                             assignment_id=existing_assignment.assignment_id,
#                             flow_step_id=step.flow_step_id,
#                             process_status=status,
#                             assigned_operator_staff_no=None
#                         )
#                     )

#                     inserted_steps.append(step.flow_step_id)

#             # -------------------------------------------------
#             # 🔥 Reopen workflow properly
#             # -------------------------------------------------
#             if inserted_steps:
#                 existing_assignment.overall_status = "IN_PROGRESS"
#                 existing_assignment.current_step_id = inserted_steps[0]

#                 assign_count += 1

#             continue

#         # =====================================================
#         # 🔹 CASE 2: Skip if active assignment already exists
#         # =====================================================
#         if existing_assignment and existing_assignment.overall_status != "COMPLETED":
#             continue

#         # =====================================================
#         # 🔹 CASE 3: Fresh Assignment (CHILD or MAIN)
#         # =====================================================
#         if pcb_type in ("HEXA-CHILD", "OCTA-CHILD"):
#             print("insdide hexa,ocat-child")
#             starting_step_id = first_step_id

#         elif pcb_type in ("HEXA-MAIN", "OCTA-MAIN"):
#             print("insdide hexa,ocat-main")
#             starting_step_id = step_15_id or first_step_id

#         else:
#             starting_step_id = first_step_id

#         # Create new assignment
#         new_assignment = PCBAssignment(
#             supervisor_staff_no=supervisor.userID,
#             assigned_pcb_id=raw_id,
#             overall_status="IN_PROGRESS",
#             current_step_id=starting_step_id
#         )

#         db.add(new_assignment)
#         db.flush()

#         pcb.status = "Assigned"
#         db.add(pcb)

#         # Insert logs from starting step
#         start_index = next(
#             (i for i, s in enumerate(flow) if s.flow_step_id == starting_step_id),
#             0
#         )

#         for index, step in enumerate(flow[start_index:]):

#             db.add(
#                 PCBProcessLog(
#                     assignment_id=new_assignment.assignment_id,
#                     flow_step_id=step.flow_step_id,
#                     process_status="PENDING" if index == 0 else "STAGED",
#                     assigned_operator_staff_no=None
#                 )
#             )

#         assign_count += 1

#     # =========================================================
#     # 5️⃣ Commit Transaction
#     # =========================================================
#     # db.commit()

#     return {
#         "assigned": assign_count,
#         "message": "Assignment processed successfully"
#     }





















# ============================================================
# SUPERVISOR VIEW
# ============================================================

@app.get("/supervisor/view")
def supervisor_view(staff_no: str, db: Session = Depends(init_db)):

    sup = normalize_staff(staff_no)
    supervisor = find_user_from_profiles(db, sup)
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    

    assignments = db.execute(
        select(PCBAssignment)
        .where(PCBAssignment.supervisor_staff_no == supervisor.userID)
    ).scalars().all()

    output = []

    for a in assignments:
        pcb = db.execute(
            select(PcbData).where(PcbData.PCBserialNoPartNumber == a.assigned_pcb_id)
        ).scalar_one_or_none()
        # ope_log = db.execute(
        #     select(OperatorLog)
        #     .where(OperatorLog.PCBserialNoPartNumber == a.assigned_pcb_id)
        #     .order_by(desc(OperatorLog.start_time))  # Order by timestamp (or your date/time column)   <===============================================change done by adithya
        #     .limit(1)
        # ).scalar_one_or_none()
        ope_log = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber == a.assigned_pcb_id, OperatorLog.current_step_id==a.current_step_id).first()
        step = db.get(ProcessFlowMaster, a.current_step_id)
        Tasks_Per_PCB_Completed = db.query(PCBAssignment).filter(PCBAssignment.assignment_id==a.assignment_id,).first()
        staffnos=[]
        usernames=[]
        if not ope_log:
            ope_list = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==a.current_step_id).all()
        
            for ope in ope_list:     
                staffnos.append(ope.operator_staff_no),
                usernames.append(ope.operator_name)
        output.append({
            "serialNo": pcb.serialNo,
            "partNumber": pcb.partNumber,
            "currentStepOrder": step.step_order if step else None,
            "currentProcessName": step.step_name if step else None,
            "currentProcessstatus": ope_log.Task_Status if ope_log else "Yet To Start",
            "currentProcessOpeStaffno":ope_log.operator_staff_no if ope_log else staffnos ,
            "currentProcessOpeName":ope_log.userName if ope_log else usernames,
            "Type":pcb.Type,
            "Tasks_Completed":Tasks_Per_PCB_Completed.current_step_id,
            "Overall_PCB_status": a.overall_status,
            # "pcbStatus": pcb.status
        })
    Pcb_New_count = db.query(PcbData).filter(PcbData.status=="New").count()
    Pcb_Inaction_count = db.query(PcbData).filter(PcbData.status=="Inaction").count()
    Pcb_assigned_count = db.query(PCBAssignment).filter(PCBAssignment.overall_status=="IN_PROGRESS").count()
    Pcb_completed = db.query(PCBAssignment).filter(PCBAssignment.overall_status=="COMPLETED").count()
    

    return {
        "supervisor": supervisor.username,
        "MasterList_PCB_Count":Pcb_New_count,
        "Inaction_PCB_Count":Pcb_Inaction_count,
        "Assigned_PCB_Count":Pcb_assigned_count,
        "Completed_PCB_Count":Pcb_completed,
        "pcbs": output
    }





# ============================================================
# OPERATOR VIEW – FINAL VERSION
# ============================================================

# @app.get("/operator/view")
# def operator_view(staff_no: str, db: Session = Depends(init_db)):

#     staff = normalize_staff(staff_no)
#     user = find_user_from_profiles(db, staff)
#     if not user:
#         raise HTTPException(status_code=404, detail="Operator not found")

#     qualified_steps = db.execute(
#         select(OperatorStepMapping.flow_step_id)
#         .where(OperatorStepMapping.operator_staff_no == user.userID)
#     ).scalars().all()

#     if not qualified_steps:
#         return {"operator": user.username, "pcbs": []}

#     # ALL active PCB assignments
#     assignments = db.execute(
#         select(PCBAssignment, PcbData)
#         .join(PcbData, PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id)
#         .where(PCBAssignment.overall_status != "COMPLETED")
#     ).all()

#     response = []

#     for assignment, pcb in assignments:

#         # logs ONLY for steps operator is qualified
#         logs = db.execute(
#             select(PCBProcessLog, ProcessFlowMaster)
#             .join(ProcessFlowMaster, PCBProcessLog.flow_step_id == ProcessFlowMaster.flow_step_id)
#             .where(PCBProcessLog.assignment_id == assignment.assignment_id)
#             .where(PCBProcessLog.flow_step_id.in_(qualified_steps))
#             .order_by(ProcessFlowMaster.step_order.asc())
#         ).all()

#         panel = {
#             "pcbSerial": pcb.serialNo,
#             "partNumber": pcb.partNumber,
#             "assignmentId": assignment.assignment_id,
#             "currentStepId": assignment.current_step_id,
#             "tasks": []
#         }

#         for log, step in logs:

#             next_name = None
#             if step.next_step_id:
#                 next_step = db.get(ProcessFlowMaster, step.next_step_id)
#                 next_name = next_step.step_name if next_step else None

#             panel["tasks"].append({
#                 "flowStepId": step.flow_step_id,
#                 "stepOrder": step.step_order,
#                 "processName": step.step_name,
#                 "status": log.process_status,
#                 "nextStepId": step.next_step_id,
#                 "nextProcessName": next_name
#             })

#         response.append(panel)

#     return {"operator": user.username, "pcbs": response}

# # ============================================================
# # OPERATOR UPDATE STATUS
# # ============================================================

# @app.put("/operator/update_status")
# def update_status(req: OperatorActionRequest, db: Session = Depends(init_db)):

#     staff = normalize_staff(req.operator_staff_no)
#     profile = find_user_from_profiles(db, staff)
#     if not profile:
#         raise HTTPException(status_code=404, detail="Operator not found")

#     log = db.get(PCBProcessLog, req.log_id)
#     if not log:
#         raise HTTPException(status_code=404, detail="Log not found")

#     action = req.action.upper()

#     if action == "START":
#         log.start_time = datetime.utcnow().isoformat()
#         log.process_status = "STARTED"
#         log.assigned_operator_staff_no = profile.userID

#     elif action == "PAUSE":
#         log.process_status = "PAUSED"

#     elif action == "COMPLETE":
#         log.end_time = datetime.utcnow().isoformat()
#         log.process_status = "COMPLETED"
#         db.commit()
#         advance_step(db, log)
#         return {"message": "Step completed and moved to next step"}

#     db.commit()
#     return {"message": f"Updated status to {log.process_status}"}

# ============================================================
# ADMIN RESET (APP TABLES ONLY)
# ============================================================

@app.get("/admin/reset_all")
def reset_all(db: Session = Depends(init_db)):

    for tbl in ["pcb_process_log", "pcb_assignment", "operator_step_mapping", "process_flow_master","PcbData","operator_log"]:
        if tbl in base.metadata.tables:
            base.metadata.tables[tbl].drop(bind=engine, checkfirst=True)

    base.metadata.create_all(bind=engine)

    return {"message": "Application tables reset (UserProfile NOT touched)"}


@app.get("/debug/userprofiles")
def debug_userprofiles(db: Session = Depends(init_db)):
    return db.execute(select(UserProfile.userID)).scalars().all()


# @app.get("/flowassignment/view")
# def flow_assignment_view(db: Session = Depends(init_db)):
#     flowassignment = db.execute(
#         select(ProcessFlowMaster, OperatorStepMapping)
#         .join(OperatorStepMapping, ProcessFlowMaster.flow_step_id==OperatorStepMapping.flow_step_id)
#     ).all()

#     OpeStepFlowmap = db.execute(
#         select(ProcessFlowMaster, OperatorStepMapping)
#         .join(OperatorStepMapping, ProcessFlowMaster.flow_step_id==OperatorStepMapping.flow_step_id)
#         .where()
#     ).all()
#     flows = []
#     for row in flowassignment:
#         openames = db.query(UserProfiles).filter(UserProfiles.userID==row.operator_staff_no).first()
#         data = {
#             OpeartorName: openames.userName,
#             operatorStaffno: row.operator_staff_no,
#             OperatorMRL: row.
#             taskNames: 
#         }

#     return flows
    
# @app.get("/operator/view")
# def operator_view(staff_no: str, db: Session = Depends(init_db)):

#     staff = normalize_staff(staff_no)
#     user = find_user_from_profiles(db, staff)
#     if not user:
#         raise HTTPException(status_code=404, detail="Operator not found")

#     # All steps this operator is qualified for
#     qualified_step_ids = db.execute(
#         select(OperatorStepMapping.flow_step_id)
#         .where(OperatorStepMapping.operator_staff_no == user.userID)
#     ).scalars().all()

#     if not qualified_step_ids:
#         return {"operator": user.username, "pcbs": []}

#     # Get all PCB assignments that are not completed
#     assignments = db.execute(
#         select(PCBAssignment, PcbData)
#         .join(PcbData, PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id)
#         .where(PCBAssignment.overall_status != "COMPLETED")
#     ).all()

#     # operator_Json_log = db.query(OperatorLog.log_Data).filter(OperatorLog.operator_staff_no==staff
#                                                                         # )
#     result = []

#     for assignment, pcb in assignments:

#         # Fetch current step details
#         current_step = db.get(ProcessFlowMaster, assignment.current_step_id)

#         # Get all tasks for this PCB that operator can do
#         logs = db.execute(
#             select(PCBProcessLog, ProcessFlowMaster)
#             .join(ProcessFlowMaster, PCBProcessLog.flow_step_id == ProcessFlowMaster.flow_step_id)
#             .where(PCBProcessLog.assignment_id == assignment.assignment_id)
#             .where(PCBProcessLog.flow_step_id.in_(qualified_step_ids))
#             .order_by(ProcessFlowMaster.step_order.asc())
#         ).all()

#         task_list = []
#         for log, step in logs:
#             next_name = None
#             if step.next_step_id:
#                 next_step = db.get(ProcessFlowMaster, step.next_step_id)
#                 next_name = next_step.step_name if next_step else None

#             task_list.append({
#                 "flowStepId": step.flow_step_id,
#                 "stepOrder": step.step_order,
#                 "processName": step.step_name,
#                 "status": log.process_status,
#                 "nextStepId": step.next_step_id,
#                 "nextProcessName": next_name,
#                 "logid": log.log_id,
#                 # "operator_Json_log":operator_Json_log
#             })

#         result.append({
#             "PCBserialNoPartNumber": pcb.PCBserialNoPartNumber,
#             "serialNo": pcb.serialNo,
#             "partNumber": pcb.partNumber,
#             "currentStepId": assignment.current_step_id,
#             "currentProcessName": current_step.step_name if current_step else None,
#             "assignmentid":assignment.assignment_id,
#             "tasks": task_list
#         })

#     return {"operator": user.username, "pcbs": result}


@app.get("/operator/view")
def operator_view(staff_no: str, db: Session = Depends(init_db)):

    staff = normalize_staff(staff_no)
    user = find_user_from_profiles(db, staff)
    if not user:
        raise HTTPException(status_code=404, detail="Operator not found")

    # All steps this operator is qualified for
    qualified_step_ids = db.execute(
        select(OperatorStepMapping.flow_step_id)
        .where(OperatorStepMapping.operator_staff_no == user.userID)
    ).scalars().all()

    if not qualified_step_ids:
        return {"operator": user.username, "pcbs": []}

    # Get all PCB assignments that are not completed
    assignments = db.execute(
        select(PCBAssignment, PcbData)
        .join(PcbData, PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id)
        .where(PCBAssignment.overall_status != "COMPLETED")
    ).all()

    """ 
    checking operator MRLs
    """
    mrl_check=db.query(OperatorStepMapping.operator_MRL_Expiry).filter(OperatorStepMapping.operator_staff_no == staff).first()
    # print("mrl_check: ",mrl_check[0].split('.')[0],type(mrl_check[0].split('.')[0]),staff)
    mrl_to_str=datetime.strptime(mrl_check[0].split('.')[0], "%m%y")
    # print("mrl_to_str: ",mrl_to_str)
    now = datetime.now()
    diff=mrl_to_str-now
    # print("diff: ",diff.days,type(diff.days))
    if diff.days <=0:
        flag=False

    else:
        flag=True






    operator_Json_log = db.query(OperatorLog.log_Data).filter(OperatorLog.operator_staff_no==staff)
    result = []
    Tasks_count = db.query(OperatorLog).filter(OperatorLog.Task_Status=="Completed",OperatorLog.operator_staff_no==staff).count()
    Names = [] 
    Tasks_Names = db.query(OperatorLog).filter(OperatorLog.Task_Status=="Completed",OperatorLog.operator_staff_no==staff).all()
    for name in Tasks_Names:
        Names.append(name.Task_Name)
    for assignment, pcb in assignments:

        # Fetch current step details
        current_step = db.get(ProcessFlowMaster, assignment.current_step_id)

        # Get all tasks for this PCB that operator can do
        logs = db.query(PCBProcessLog, ProcessFlowMaster, OperatorLog).join(
            ProcessFlowMaster, PCBProcessLog.flow_step_id == ProcessFlowMaster.flow_step_id).outerjoin(
                OperatorLog, and_(PCBProcessLog.flow_step_id == OperatorLog.current_step_id,PCBProcessLog.assignment_id == OperatorLog.assignment_id,OperatorLog.operator_staff_no == staff)).filter(
                    PCBProcessLog.assignment_id == assignment.assignment_id).filter(PCBProcessLog.flow_step_id.in_(qualified_step_ids)).order_by(
                        ProcessFlowMaster.step_order.asc()).all()
        
        task_list = []
        if len(logs)>0:
            print("logs: ",logs)
        for log, step, operatorlogs in logs:
            
            
            # time = present - operatorlogs.end_time
            # time = db.query(OperatorLog).filter((present-OperatorLog.end_time).days<1,OperatorLog.operator_staff_no==staff).count()
            
            next_name = None
            if step.next_step_id:
                next_step = db.get(ProcessFlowMaster, step.next_step_id)
                next_name = next_step.step_name if next_step else None

            task_list.append({
                "flowStepId": step.flow_step_id,
                "stepOrder": step.step_order,
                "processName": step.step_name,
                "status": log.process_status,
                "nextStepId": step.next_step_id,
                "nextProcessName": next_name,
                "logid": log.log_id,
                
               
                "operator_Json_log":operatorlogs.log_Data if operatorlogs else None

            })

        result.append({
            "PCBserialNoPartNumber": pcb.PCBserialNoPartNumber,
            "serialNo": pcb.serialNo,
            "partNumber": pcb.partNumber,
            "currentStepId": assignment.current_step_id,
            "currentProcessName": current_step.step_name if current_step else None,
            "assignmentid":assignment.assignment_id,
            
            "tasks": task_list
        })

    return {"operator": user.username,"Completed_Tasks_Count":Tasks_count if Tasks_count else None,
            "Completed_Tasks_Names":Names if Names else None, "pcbs": result,"flag":flag}










# @app.post("/operator/updatestatus")
# def update_status(req: OperatorActionRequest, db: Session = Depends(init_db)):

#     # -----------------------------
#     # 1️⃣ Validate operator
#     # -----------------------------
#     operator = normalize_staff(req.operator_staff_no)
#     profile = find_user_from_profiles(db, operator)
#     if not profile:
#         raise HTTPException(status_code=404, detail="Operator not found")

#     # -----------------------------
#     # 2️⃣ Fetch PCB process log (CURRENT STEP)
#     # -----------------------------
#     log = db.query(PCBProcessLog).filter(
#         PCBProcessLog.assignment_id == req.assignment_id,
#         PCBProcessLog.flow_step_id == req.current_step_id
#     ).first()

#     if not log:
#         raise HTTPException(status_code=404, detail="Task not found for this PCB")

#     # -----------------------------
#     # 3️⃣ Validate operator eligibility
#     # -----------------------------
#     allowed = db.query(OperatorStepMapping).filter(
#         OperatorStepMapping.flow_step_id == log.flow_step_id,
#         OperatorStepMapping.operator_staff_no == operator
#     ).first()

#     if not allowed:
#         raise HTTPException(status_code=403, detail="Operator not allowed for this task")

#     # -----------------------------
#     # 4️⃣ Fetch assignment
#     # -----------------------------
#     assignment = db.query(PCBAssignment).filter(
#         PCBAssignment.assignment_id == req.assignment_id
#     ).first()

#     if not assignment:
#         raise HTTPException(status_code=404, detail="Assignment not found")

#     # -----------------------------
#     # 5️⃣ Save operator activity log (AUDIT)
#     # -----------------------------
#     operator_details = db.query(OperatorStepMapping).filter(OperatorStepMapping.operator_staff_no==operator).first()
#     ope_log = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber==req.PCBserialNoPartNumber, OperatorLog.current_step_id==req.current_step_id).first()

#     if not ope_log:
#         operator_log = OperatorLog(
#             PCBserialNoPartNumber=req.PCBserialNoPartNumber,
#             current_step_id=req.current_step_id,
#             assignment_id=req.assignment_id,
#             Task_Status=req.Task_Status,
#             Task_Name=req.Task_Name,
#             operator_staff_no=operator,
#             log_Data=req.log_Data,
#             operator_name = operator_details.operator_name,
#             operator_initial = operator_details.operator_initial,
#             operator_MRL = operator_details.operator_MRL,
#             operator_MRL_Expiry= operator_details.operator_MRL_Expiry,
#             userID=req.userID,
#             userName=req.userName,
#             userRole=req.userRole,
#             userSBU=req.userSBU,
#             userSBUDiv=req.userSBUDiv,
#             start_time=req.start_time,
#             end_time=req.end_time
#         )
#         db.add(operator_log)
#     else:
#         ope_log.PCBserialNoPartNumber=req.PCBserialNoPartNumber
#         ope_log.current_step_id=req.current_step_id
#         ope_log.assignment_id=req.assignment_id
#         ope_log.Task_Status=req.Task_Status
#         ope_log.Task_Name=req.Task_Name
#         ope_log.operator_staff_no=operator
#         ope_log.log_Data=req.log_Data
#         ope_log.userID=req.userID
#         ope_log.userName=req.userName
#         ope_log.userRole=req.userRole
#         ope_log.userSBU=req.userSBU
#         ope_log.userSBUDiv=req.userSBUDiv
#         ope_log.end_time=req.end_time

#     # -----------------------------
#     # 6️⃣ Action handling
#     # -----------------------------
#     action = req.Task_Status.upper()

#     if action == "STARTED":
#         log.start_time = datetime.utcnow()
#         log.process_status = "STARTED"
#         log.assigned_operator_staff_no = operator

#         # ⭐ IMPORTANT: update current step immediately
#         assignment.current_step_id = log.flow_step_id

#     elif action == "PAUSE":
#         log.process_status = "PAUSED"

#     elif action == "COMPLETED":
#         log.end_time = datetime.utcnow()
#         log.process_status = "COMPLETED"

#         step = db.get(ProcessFlowMaster, log.flow_step_id)

#         if not step or not step.next_step_id:
#             # Last step → close PCB
#             assignment.overall_status = "COMPLETED"
#             assignment.current_step_id = None
#             db.commit()
#             return {"message": "Final step completed. PCB workflow closed."}

#         # Activate next step
#         next_log = db.query(PCBProcessLog).filter(
#             PCBProcessLog.assignment_id == log.assignment_id,
#             PCBProcessLog.flow_step_id == step.next_step_id
#         ).first()

#         if next_log:
#             next_log.process_status = "PENDING"


#         assignment.current_step_id = step.next_step_id

#     else:
#         raise HTTPException(status_code=400, detail="Invalid Task_Status")

#     db.commit()

#     return {
#         "message": "Status updated successfully",
#         "current_step_id": assignment.current_step_id,
#         "pcb": req.PCBserialNoPartNumber
#     }






# @app.post("/operator/updatestatus")
# def update_status(req: OperatorActionRequest, db: Session = Depends(init_db)):

#     # -----------------------------
#     # 1️⃣ Validate operator
#     # -----------------------------
#     print("whushfush",req)
#     operator = normalize_staff(req.operator_staff_no)
#     profile = find_user_from_profiles(db, operator)
#     if not profile:
#         raise HTTPException(status_code=404, detail="Operator not found")

#     # -----------------------------
#     # 2️⃣ Fetch PCB process log (CURRENT STEP)
#     # -----------------------------
#     log = db.query(PCBProcessLog).filter(
#         PCBProcessLog.assignment_id == req.assignment_id,
#         PCBProcessLog.flow_step_id == req.current_step_id
#     ).first()
#     print("log;l ",log)
#     if not log:
#         raise HTTPException(status_code=404, detail="Task not found for this PCB")

#     # -----------------------------
#     # 3️⃣ Validate operator eligibility
#     # -----------------------------
#     allowed = db.query(OperatorStepMapping).filter(
#         OperatorStepMapping.flow_step_id == log.flow_step_id,
#         OperatorStepMapping.operator_staff_no == operator
#     ).first()

#     if not allowed:
#         raise HTTPException(status_code=403, detail="Operator not allowed for this task")

#     # -----------------------------
#     # 4️⃣ Fetch assignment
#     # -----------------------------
#     assignment = db.query(PCBAssignment).filter(
#         PCBAssignment.assignment_id == req.assignment_id
#     ).first()

#     if not assignment:
#         raise HTTPException(status_code=404, detail="Assignment not found")

#     # -----------------------------
#     # 5️⃣ Save operator activity log (AUDIT)
#     # -----------------------------
#     operator_details = db.query(OperatorStepMapping).filter(OperatorStepMapping.operator_staff_no==operator).first()
#     ope_log = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber==req.PCBserialNoPartNumber, OperatorLog.current_step_id==req.current_step_id).first()

#     if not ope_log:
#         operator_log = OperatorLog(
#             PCBserialNoPartNumber=req.PCBserialNoPartNumber,
#             current_step_id=req.current_step_id,
#             assignment_id=req.assignment_id,
#             Task_Status=req.Task_Status,
#             Task_Name=req.Task_Name,
#             operator_staff_no=operator,
#             log_Data=req.log_Data,
#             operator_name = operator_details.operator_name,
#             operator_initial = operator_details.operator_initial,
#             operator_MRL = operator_details.operator_MRL,
#             operator_MRL_Expiry= operator_details.operator_MRL_Expiry,
#             userID=req.userID,
#             userName=req.userName,
#             userRole=req.userRole,
#             userSBU=req.userSBU,
#             userSBUDiv=req.userSBUDiv,
#             start_time=req.start_time,
#             end_time=req.end_time
#         )
#         db.add(operator_log)
#     else:
#         ope_log.PCBserialNoPartNumber=req.PCBserialNoPartNumber
#         ope_log.current_step_id=req.current_step_id
#         ope_log.assignment_id=req.assignment_id
#         ope_log.Task_Status=req.Task_Status
#         ope_log.Task_Name=req.Task_Name
#         ope_log.operator_staff_no=operator
#         ope_log.log_Data=req.log_Data
#         ope_log.userID=req.userID
#         ope_log.userName=req.userName
#         ope_log.userRole=req.userRole
#         ope_log.userSBU=req.userSBU
#         ope_log.userSBUDiv=req.userSBUDiv
#         ope_log.end_time=req.end_time

#     # -----------------------------
#     # 6️⃣ Action handling
#     # -----------------------------
#     action = req.Task_Status.upper()

#     if action == "STARTED":
#         log.start_time = datetime.utcnow()
#         log.process_status = "STARTED"
#         log.assigned_operator_staff_no = operator

#         # ⭐ IMPORTANT: update current step immediately
#         assignment.current_step_id = log.flow_step_id

#     elif action == "PAUSE":
#         log.process_status = "PAUSED"

#     elif action == "COMPLETED":
#         log.end_time = datetime.utcnow()
#         log.process_status = "COMPLETED"

#         main_check=len(req.PCBserialNoPartNumber.split("$")[1])
#         print("main_check: ",main_check)
#         is_main=False if main_check == 10 and req.current_step_id <=15 else True
#         if is_main:
#             print("in if")
#             flow_check=db.query(PCBProcessLog).filter(PCBProcessLog.assignment_id == req.assignment_id).order_by(desc(PCBProcessLog.flow_step_id)).first()
#             if flow_check.flow_step_id != 43:
#                 print("main part missing!")
#                 return {"message":"Main part missing!"}
#             else:
#                 step = db.get(ProcessFlowMaster, log.flow_step_id)
#                 print("main part present!")

#                 if not step or not step.next_step_id:
#                     # Last step → close PCB
#                     assignment.overall_status = "COMPLETED"
#                     assignment.current_step_id = None
#                     db.commit()
#                     return {"message": "Final step completed. PCB workflow closed."}

#             # Activate next step
#                 next_log = db.query(PCBProcessLog).filter(
#                     PCBProcessLog.assignment_id == log.assignment_id,
#                     PCBProcessLog.flow_step_id == step.next_step_id
#                 ).first()

#                 if next_log:
#                     next_log.process_status = "PENDING" 
#                     assignment.current_step_id= step.next_step_id
#         else:
#             print("in else")
#             print("log: ",log)
#             step = db.get(ProcessFlowMaster, log.flow_step_id)
#             print("log.flow_step_id: ",log.flow_step_id,"step.next_step_id: ",step.next_step_id)
#             # if not step or not step.next_step_id:
#             #     # Last step → close PCB
#             #     assignment.overall_status = "COMPLETED"
#             #     assignment.current_step_id = None
#             #     db.commit()
#             #     return {"message": "Final step completed. PCB workflow closed."}

#         # Activate next step
#             next_log = db.query(PCBProcessLog).filter(
#                 PCBProcessLog.assignment_id == log.assignment_id,
#                 PCBProcessLog.flow_step_id == step.next_step_id
#             ).first()
#             # if next_log.flow_step_id == 15:
#             #     assignment.current_step_id= 16
#             # else:


#             # print("next_log.flow_step_id: ",next_log.flow_step_id,"step.next_step_id: ",step.next_step_id,"next_log: ",next_log.assignment_id)
#             if next_log:
#                 next_log.process_status = "PENDING"
#                 assignment.current_step_id= step.next_step_id
#             else:
#                 print("am in else")
#                 # next_log.process_status = "COMPLETED"
#                 assignment.current_step_id=None
        

#     else:
#         raise HTTPException(status_code=400, detail="Invalid Task_Status")

#     db.commit()
#     print("sucess!")

#     return {
#         "message": "Status updated successfully",
#         "current_step_id": assignment.current_step_id,
#         "pcb": req.PCBserialNoPartNumber
#     }





















from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime


@app.post("/operator/updatestatus")
def update_status(req: OperatorActionRequest, db: Session = Depends(init_db)):

    # ---------------------------------------------------------
    # 1️⃣ Validate Operator
    # ---------------------------------------------------------
    operator = normalize_staff(req.operator_staff_no)
    profile = find_user_from_profiles(db, operator)

    if not profile:
        raise HTTPException(status_code=404, detail="Operator not found")

    # ---------------------------------------------------------
    # 2️⃣ Fetch Current PCB Process Log
    # ---------------------------------------------------------
    log = db.query(PCBProcessLog).filter(
        PCBProcessLog.assignment_id == req.assignment_id,
        PCBProcessLog.flow_step_id == req.current_step_id
    ).first()
    print("req: ",req)
    print("log: ",log)
    if not log:
        raise HTTPException(status_code=404, detail="Task not found for this PCB")

    # ---------------------------------------------------------
    # 3️⃣ Validate Operator Eligibility
    # ---------------------------------------------------------
    allowed = db.query(OperatorStepMapping).filter(
        OperatorStepMapping.flow_step_id == log.flow_step_id,
        OperatorStepMapping.operator_staff_no == operator
    ).first()
    
    if not allowed:
        raise HTTPException(status_code=403, detail="Operator not allowed for this task")

    # ---------------------------------------------------------
    # 4️⃣ Fetch Assignment
    # ---------------------------------------------------------
    assignment = db.query(PCBAssignment).filter(
        PCBAssignment.assignment_id == req.assignment_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Prevent updates if already closed
    if assignment.overall_status == "COMPLETED":
        raise HTTPException(status_code=400, detail="PCB workflow already completed")

    # ---------------------------------------------------------
    # 5️⃣ Save / Update Operator Audit Log
    # ---------------------------------------------------------
    operator_details = db.query(OperatorStepMapping).filter(
        OperatorStepMapping.operator_staff_no == operator
    ).first()
    
    ope_log = db.query(OperatorLog).filter(
        OperatorLog.PCBserialNoPartNumber == req.PCBserialNoPartNumber,
        OperatorLog.current_step_id == req.current_step_id
    ).first()
    child_completed=False
    if not ope_log:
        
        operator_log = OperatorLog(
            PCBserialNoPartNumber=req.PCBserialNoPartNumber,
            current_step_id=req.current_step_id,
            assignment_id=req.assignment_id,
            Task_Status=req.Task_Status,
            Task_Name=req.Task_Name,
            operator_staff_no=operator,
            log_Data=req.log_Data,
            operator_name=operator_details.operator_name,
            operator_initial=operator_details.operator_initial,
            operator_MRL=operator_details.operator_MRL,
            operator_MRL_Expiry=operator_details.operator_MRL_Expiry,
            userID=req.userID,
            userName=req.userName,
            userRole=req.userRole,
            userSBU=req.userSBU,
            userSBUDiv=req.userSBUDiv,
            start_time=req.start_time,
            end_time=req.end_time
        )
        db.add(operator_log)
    else:
        
        ope_log.PCBserialNoPartNumber=req.PCBserialNoPartNumber
        ope_log.current_step_id=req.current_step_id
        ope_log.assignment_id=req.assignment_id
        ope_log.Task_Status=req.Task_Status
        ope_log.Task_Name=req.Task_Name
        ope_log.operator_staff_no=operator
        ope_log.log_Data=req.log_Data
        ope_log.userID=req.userID
        ope_log.userName=req.userName
        ope_log.userRole=req.userRole
        ope_log.userSBU=req.userSBU
        ope_log.userSBUDiv=req.userSBUDiv
        ope_log.end_time=req.end_time

    # ---------------------------------------------------------
    # 6️⃣ Action Handling
    # ---------------------------------------------------------
    action = req.Task_Status.upper()
    
    # ============================
    # START
    # ============================
    if action == "STARTED":
        

        if log.process_status not in ("PENDING", "PAUSED"):
            raise HTTPException(
                status_code=400,
                detail="Step not ready to start"
            )

        if log.process_status == "STARTED":
            raise HTTPException(
                status_code=400,
                detail="Step already started"
            )

        log.start_time = datetime.utcnow()
        log.process_status = "STARTED"
        log.assigned_operator_staff_no = operator
        assignment.current_step_id = log.flow_step_id

    # ============================
    # PAUSE
    # ============================
    elif action == "PAUSE":

        if log.process_status != "STARTED":
            raise HTTPException(
                status_code=400,
                detail="Cannot pause a step that is not started"
            )

        log.process_status = "PAUSED"

    # ============================
    # COMPLETE
    # ============================
    elif action == "COMPLETED":
        # print("log: ",log.process_status)
        if log.process_status not in ("STARTED", "PAUSED","PENDING"):
            raise HTTPException(
                status_code=400,
                detail="Step must be started before completing"
            )
            

        log.end_time = datetime.utcnow()
        log.process_status = "COMPLETED"

        # Get master flow step
        step = db.get(ProcessFlowMaster, log.flow_step_id)

        if not step:
            raise HTTPException(
                status_code=500,
                detail="Process flow configuration error"
            )

        # 🔥 IMPORTANT FIX:
        # Check if NEXT PCBProcessLog exists in this assignment
        next_log = None

        if step.next_step_id:
            next_log = db.query(PCBProcessLog).filter(
                PCBProcessLog.assignment_id == log.assignment_id,
                PCBProcessLog.flow_step_id == step.next_step_id
            ).first()

        # ------------------------------------------
        # If NO next_log exists → CLOSE PCB
        # (CHILD scenario restriction)
        # ------------------------------------------
        if not next_log:
            assignment.overall_status = "COMPLETED"
            assignment.current_step_id = None
            db.commit()
            print("Final stage completed. PCB restricted.")
            child_completed=True
            # temp=db.query(PcbData).filter(PcbData.PCBserialNoPartNumber == req.PCBserialNoPartNumber).first()
            # print("temp: ",temp.PCBserialNoPartNumber)
            # temp.status = "COMPLETED"

            return {
               
                "message": "Final stage completed. PCB restricted.",
                "current_step_id": None,
                "child_completed":child_completed,
                "pcb": req.PCBserialNoPartNumber
            }

        # ------------------------------------------
        # Otherwise → Activate Next Step (MAIN case)
        # ------------------------------------------
        if next_log.process_status == "STAGED":
            next_log.process_status = "PENDING"
            print("in child only")
            # temp=db.query(PcbData).filter(PcbData.PCBserialNoPartNumber == req.PCBserialNoPartNumber).first()
            # print("temp: ",temp.PCBserialNoPartNumber)

        assignment.current_step_id = step.next_step_id

    else:
        raise HTTPException(status_code=400, detail="Invalid Task_Status")

    # ---------------------------------------------------------
    # 7️⃣ Commit Changes
    # ---------------------------------------------------------
    db.commit()

    return {
        "message": "Status updated successfully",
        "current_step_id": assignment.current_step_id,
        "pcb": req.PCBserialNoPartNumber,
        "child_completed":False if child_completed == False else True
       
    }













# ---------------------------------------------------------
# ⭐ NEW ENDPOINT: Get Last Log for Copy/Paste Functionality
# ---------------------------------------------------------
@app.get("/operator/last-log")
def get_last_operator_log(staff_no: str, stage_id: int, db: Session = Depends(init_db)):
    # Normalize staff number if your system requires it
    operator = normalize_staff(staff_no) 

    print("staff_no: ",staff_no," stage_id: ",stage_id)
    # Query the Audit Log for the most recent entry by this operator for this stage
    last_log = db.query(OperatorLog).filter(
        OperatorLog.operator_staff_no == operator,
        OperatorLog.current_step_id == stage_id,
        OperatorLog.log_Data.isnot(None) # Ensure we only get logs with data
    ).filter(OperatorLog.Task_Status == "Completed").order_by(desc(OperatorLog.end_time)).first()
    # print("serial: ",last_log.PCBserialNoPartNumber)
    if not last_log:
        return {"log_Data": None, "message": "No previous data found"}

    return {"log_Data": last_log.log_Data}


# ---------------------------------------------------------
# ⭐ NEW ENDPOINT: Get Log by Serial Number (Search)
# ---------------------------------------------------------
@app.get("/operator/log-by-serial")
async def get_log_by_serial(target_serial: str, stage_id: int, db: Session = Depends(init_db)):

    assignment = db.query(PcbData).filter(
        PcbData.serialNo == target_serial
    ).first()
    # print(type(assignment))
    # print(assignment.PCBserialNoPartNumber)
    pcbsnpt=assignment.PCBserialNoPartNumber
    # print(type(pcbsnpt),pcbsnpt)
    temp=db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber == assignment.PCBserialNoPartNumber,OperatorLog.current_step_id == stage_id).all()
    # print(type(temp))
    # print("sucess")
    
    return temp



    # """
    # Fetches the log data for a SPECIFIC PCB at a specific stage.
    # """
    # # We strip whitespace to avoid matching errors
    # target = target_serial.strip()

    # # Query the OperatorLog for this specific PCB and Stage
    # # pcbseral=db.query(PcbData).filter
    # target_log = db.query(OperatorLog).filter(
    #     OperatorLog.PCBserialNoPartNumber == target,
    #     OperatorLog.current_step_id == stage_id,
    #     OperatorLog.log_Data.isnot(None)
    # ).order_by(desc(OperatorLog.end_time)).first() # Get most recent if duplicates exist

    # if not target_log:
    #     return {"log_Data": None, "message": "No data found for this Serial Number"}

    # return {"log_Data": target_log.log_Data}





from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timezone, timedelta

@app.get("/supervisor/external/dashboard")
def supervisor_external_dashboard(
    staff_no: str,
    db: Session = Depends(init_db)
):

    print(staff_no)




    no_of_octa_child_completed=0
    no_of_hexa_child_completed=0
    no_of_octa_main_completed=0
    no_of_hexa_main_completed=0

    db1=db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PcbData.Type == "OCTA-CHILD",PCBAssignment.current_step_id ==None).count()
    # print("db1 ",db1)
    no_of_octa_child_completed=db1

    db2=db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PcbData.Type == "HEXA-CHILD",PCBAssignment.current_step_id ==None).count()
    # print("db2 ",db2)
    no_of_hexa_child_completed=db2


    db3=db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PcbData.Type == "HEXA-MAIN",PCBAssignment.current_step_id ==None).count()
    # print("db3 ",db3)
    no_of_hexa_main_completed=db3

    db4=db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PcbData.Type == "OCTA-MAIN",PCBAssignment.current_step_id ==None).count()
    # print("db4 ",db4)
    no_of_hexa_child_completed=db4
    # ======================================================
    # 1️⃣ TIME SETUP (SAFE)
    # ======================================================
    now = datetime.now(timezone.utc)
    today_str = now.date().strftime("%Y-%m-%d")
    last_1_hour = (now - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
    last_8_hours = (now - timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")

    # ======================================================
    # 2️⃣ VALIDATE SUPERVISOR
    # ======================================================
    supervisor = find_user_from_profiles(db, normalize_staff(staff_no))
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")

    # ======================================================
    # 3️⃣ PCB SUMMARY
    # ======================================================
    master_total = db.query(PcbData).count()
    new_count = db.query(PcbData).filter(PcbData.status == "New").count()
    inaction_count = db.query(PcbData).filter(PcbData.status == "Inaction").count()

    assigned_count = db.query(PCBAssignment).filter(
        PCBAssignment.overall_status == "IN_PROGRESS"
    ).count()

    # completed_count = db.query(PCBAssignment).filter(
    #     PCBAssignment.overall_status == "COMPLETED"
    # ).count()
    completed = db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id  == PcbData.PCBserialNoPartNumber).filter(or_(PcbData.Type == "HEXA-MAIN" , PcbData.Type=="OCTA-MAIN")).filter(PCBAssignment.overall_status == "COMPLETED").all()
    print("ceomp : ",len(completed))
    completed_count=len(completed)


    completed_today = db.query(PCBProcessLog).filter(
        PCBProcessLog.process_status == "COMPLETED",
        PCBProcessLog.end_time.like(f"{today_str}%")
    ).count()

    


    # ======================================================
    # 4️⃣ PERFORMANCE METRICS
    # ======================================================
    completed_last_1_hour = db.query(PCBProcessLog).filter(
        PCBProcessLog.process_status == "COMPLETED",
        PCBProcessLog.end_time >= last_1_hour
    ).count()

    completed_last_8_hours = db.query(PCBProcessLog).filter(
        PCBProcessLog.process_status == "COMPLETED",
        PCBProcessLog.end_time >= last_8_hours
    ).count()

    # Avg completion time (Python-side safe calc)
    durations = []
    logs = db.query(
        PCBProcessLog.start_time,
        PCBProcessLog.end_time
    ).filter(
        PCBProcessLog.process_status == "COMPLETED",
        PCBProcessLog.start_time.isnot(None),
        PCBProcessLog.end_time.isnot(None)
    ).all()

    for s, e in logs:
        try:
            s_dt = datetime.fromisoformat(s.replace("Z", ""))
            e_dt = datetime.fromisoformat(e.replace("Z", ""))
            durations.append((e_dt - s_dt).total_seconds() / 60)
        except:
            pass

    avg_completion_time = round(sum(durations) / len(durations), 2) if durations else 0

    # ======================================================
    # 5️⃣ OPERATIONAL HEALTH
    # ======================================================
    wip_pcbs = assigned_count

    wip_ages = []
    active_logs = db.query(
        PCBProcessLog.start_time
    ).filter(
        PCBProcessLog.process_status.in_(["PENDING", "STARTED"])
    ).all()

    for (s,) in active_logs:
        try:
            s_dt = datetime.fromisoformat(s.replace("Z", ""))
            wip_ages.append((now - s_dt).total_seconds() / 60)
        except:
            pass

    avg_wip_age = round(sum(wip_ages) / len(wip_ages), 2) if wip_ages else 0
    max_wip_age = round(max(wip_ages), 2) if wip_ages else 0
    stuck_pcbs = sum(1 for x in wip_ages if x > 120)

    health_status = "GREEN"
    if stuck_pcbs > 0:
        health_status = "AMBER"
    if stuck_pcbs > 5:
        health_status = "RED"

    # ======================================================
    # 6️⃣ WIP BY PROCESS
    # ======================================================
    wip_by_process = []
    step_rows = (
        db.query(
            ProcessFlowMaster.step_order,
            ProcessFlowMaster.step_name,
            func.count(PCBAssignment.assignment_id)
        )
        .join(PCBAssignment, PCBAssignment.current_step_id == ProcessFlowMaster.flow_step_id)
        .filter(PCBAssignment.overall_status == "IN_PROGRESS")
        .group_by(ProcessFlowMaster.step_order, ProcessFlowMaster.step_name)
        .order_by(ProcessFlowMaster.step_order)
        .all()
    )

    for step_order, step_name, count in step_rows:
        wip_by_process.append({
            "step_order": step_order,
            "process_name": step_name,
            "pcb_count": count,
            "avg_wait_minutes": avg_wip_age,
            "max_wait_minutes": max_wip_age
        })

    # ======================================================
    # 7️⃣ OPERATOR SUMMARY
    # ======================================================
    total_operators = db.query(OperatorStepMapping.operator_staff_no).distinct().count()
    active_operators = db.query(OperatorLog.operator_staff_no).filter(
        OperatorLog.Task_Status == "START"
    ).distinct().count()

    idle_operators = max(total_operators - active_operators, 0)

    avg_tasks_per_operator = round(
        db.query(func.count(OperatorLog.operator_staff_no)).scalar() / total_operators,
        2
    ) if total_operators else 0

    # ======================================================
    # 8️⃣ ALERTS
    # ======================================================
    delayed_pcbs = stuck_pcbs
    overall_severity = "GREEN"
    if delayed_pcbs > 0:
        overall_severity = "AMBER"
    if delayed_pcbs > 5:
        overall_severity = "RED"

    # ======================================================
    # 9️⃣ ASSIGNMENT EFFECTIVENESS
    # ======================================================
    assigned_by_supervisor = db.query(PCBAssignment).filter(
        PCBAssignment.supervisor_staff_no == supervisor.userID
    ).count()

    completed_from_assigned = db.query(PCBAssignment).filter(
        PCBAssignment.supervisor_staff_no == supervisor.userID,
        PCBAssignment.overall_status == "COMPLETED"
    ).count()

    completion_rate = round(
        (completed_from_assigned / assigned_by_supervisor) * 100, 2
    ) if assigned_by_supervisor else 0

    # ======================================================
    # 🔟 PCB LIST (DRILL-DOWN)
    # ======================================================
    pcbs = []
    pcb_rows = (
        db.query(
            PcbData.PCBserialNoPartNumber,
            PcbData.serialNo,
            PcbData.partNumber,
            ProcessFlowMaster.step_name,
            ProcessFlowMaster.step_order,
            PCBAssignment.overall_status,
            # OperatorLog.operator_staff_no,
            # OperatorLog.userName,
            PCBProcessLog.start_time
        )
        .join(PCBAssignment, PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber)
        .join(ProcessFlowMaster, ProcessFlowMaster.flow_step_id == PCBAssignment.current_step_id)
        # .outerjoin(OperatorLog, OperatorLog.assignment_id == PCBAssignment.assignment_id)
        .outerjoin(PCBProcessLog, PCBProcessLog.assignment_id == PCBAssignment.assignment_id)
        .filter(PCBAssignment.overall_status == "IN_PROGRESS",
                PCBProcessLog.process_status.in_(["PENDING", "STARTED"]),
               )
        .all()
    )

    for r in pcb_rows:
        # print(r.step_order)
        operator_info = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber==r.PCBserialNoPartNumber,
            OperatorLog.current_step_id==r.step_order).first()
        # time_in_step = None
        # try:
        #     s_dt = datetime.fromisoformat(r.start_time.replace("Z", ""))
        #     time_in_step = round((now - s_dt).total_seconds() / 60)
        # except:
        #     pass
        # print(r)
        pcbs.append({
            "pcb_serial": r.PCBserialNoPartNumber,
            "serial_no": r.serialNo,
            "part_number": r.partNumber,
            "current_step": r.step_name,
            "current_step_order": r.step_order,
            "status": r.overall_status,
            "operator": {
                "staff_no": operator_info.operator_staff_no if operator_info else "",
                "name": operator_info.userName if operator_info else "YET TO START"
            } ,
            
            # "time_in_current_step_minutes": time_in_step
        })
    
    
    # ======================================================
    # ✅ FINAL RESPONSE
    # ======================================================
    return {
        "meta": {
            "role": "SUPERVISOR_EXTERNAL",
            "supervisor_name": supervisor.username,
            "generated_at": now.isoformat(),
            "timezone": "UTC"
        },
        "pcb_summary": {
            "master_total": master_total,
            "new": new_count,
            "inaction": inaction_count,
            "assigned": assigned_count,
            "completed": completed_count,
            "completed_today": completed_today
           
        },
        "performance_metrics": {
            "avg_completion_time_minutes": avg_completion_time,
            "completed_last_1_hour": completed_last_1_hour,
            "completed_last_8_hours": completed_last_8_hours,
            "completed_today": completed_today,
            "trend_vs_yesterday": "STABLE"
        },
        "operational_health": {
            "wip_pcbs": wip_pcbs,
            "stuck_pcbs": stuck_pcbs,
            "avg_wip_age_minutes": avg_wip_age,
            "max_wip_age_minutes": max_wip_age,
            "health_status": health_status
        },
        # "wip_by_process": wip_by_process,
        # "operator_summary": {
        #     "total_operators": total_operators,
        #     "active_operators": active_operators,
        #     "idle_operators": idle_operators,
        #     "avg_tasks_per_operator": avg_tasks_per_operator,
        #     "top_operator": None
        # },
        "alerts": {
            "delayed_pcbs": delayed_pcbs,
            "sla_breaches": 0,
            "mrl_expiry_risks": 0,
            "critical_processes": [],
            "overall_severity": overall_severity
        },
        # "assignment_effectiveness": {
        #     "pcbs_assigned_by_supervisor": assigned_by_supervisor,
        #     "pcbs_completed_from_assigned": completed_from_assigned,
        #     "assignment_completion_rate": completion_rate
        # },
        # "time_insights": {
        #     "current_shift": "SHIFT A",
        #     "shift_start": "08:00",
        #     "shift_end": "16:00",
        #     "shift_completion_count": completed_today
        # },
        "pcbs": pcbs,
        "no_of_octa_child_comp":no_of_octa_child_completed,
        "no_of_hexa_child_comp":no_of_hexa_child_completed,
        "no_of_octa_main_comp":no_of_octa_main_completed,
        "no_of_hexa_main_comp":no_of_hexa_main_completed,
        "total_child_comp":no_of_octa_child_completed + no_of_hexa_child_completed,
        "total_main_comp":no_of_octa_main_completed + no_of_hexa_main_completed
    }



# @app.post("/operator/updatestatus")
# def update_status(payload: dict, db: Session = Depends(init_db)):
#     print(payload)
#     return {"message": "Updated"}

def check_step(prev_step_list,current_stepname):
    for key in prev_step_list:
            if current_stepname==key:
                return True
    return False

@app.get("/analytics/dashboard")
def get_analytic_dashboard( db: Session = Depends(init_db)):
    Assigned_Pcbs = db.query(PCBAssignment).all()
    prev_pcb_step=""
    counts={}
    results=[]
    count=0
    prev_step_list={}
    for pcb in Assigned_Pcbs:
        current_stepname = db.query(ProcessFlowMaster.step_name).filter(ProcessFlowMaster.step_order==pcb.current_step_id).first()
        stepname = current_stepname.step_name if current_stepname else ""
        found = check_step(prev_step_list,stepname)        
        if found:
            prev_step_list[stepname]=prev_step_list[stepname]+1
        else:
            prev_step_list[stepname]=1
            count=1
        prev_pcb_step=stepname
    for stepname in prev_step_list:
        step_order = db.query(ProcessFlowMaster.step_order).filter(ProcessFlowMaster.step_name==stepname).first()
        operators_count = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==step_order.step_order).count()
        
        result = {
            "step": stepname,
            "order": step_order.step_order,
            "active_pcbs": prev_step_list[stepname],
            "staff_capacity": operators_count

        }
        results.append(result)

    Overall_Task_Data = []
    Steps = db.query(ProcessFlowMaster).all()
    for step in Steps:
        operators_count = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==step.step_order).count()
        result = {
            "step": step.step_name,
            "order": step.step_order,
            "staff_capacity": operators_count
        }
        Overall_Task_Data.append(result)
    # print(prev_step_list)
    return Overall_Task_Data

# @app.get("/pcb_status")
# def get_pcbs_by_status(
#     status: Optional[str] = Query(None, description="Filter by PCB status (New, Inaction, IN_PROGRESS, COMPLETED)"),
#     db: Session = Depends(init_db)
# ):
#     """
#     Retrieves a list of PCBs based on their status.
#     If no status is provided, returns all PCBs.
#     """

#     if status:
#         pcbs = db.query(PcbData).filter(PcbData.status == status).all()
#     else:
#         pcbs = db.query(PcbData).all()

#     pcb_list = []
#     for pcb in pcbs:
#         assignments = db.execute(
#             select(PCBAssignment)
#             .where(PCBAssignment.assigned_pcb_id == pcb.PCBserialNoPartNumber)
#         ).scalars().all()

#         if assignments:
#             a = assignments[0]
#             step = db.get(ProcessFlowMaster, a.current_step_id)
#             ope_log = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber == pcb.PCBserialNoPartNumber, OperatorLog.current_step_id == a.current_step_id).first()

#             pcb_data = {
#                 "serialNo": pcb.serialNo,
#                 "partNumber": pcb.partNumber,
#                 "currentStepOrder": step.step_order if step else None,
#                 "currentProcessName": step.step_name if step else None,
#                 "currentProcessstatus": ope_log.Task_Status if ope_log else "Yet To Start",
#                 "currentProcessOpeStaffno": ope_log.operator_staff_no if ope_log else None,
#                 "currentProcessOpeName": ope_log.userName if ope_log else None,
#                 "Tasks_Completed": a.current_step_id,
#                 "Overall_PCB_status": a.overall_status,
#             }
#         else:
#             pcb_data = {
#                 "serialNo": pcb.serialNo,
#                 "partNumber": pcb.partNumber,
#                 "currentStepOrder": None,
#                 "currentProcessName": None,
#                 "currentProcessstatus": "Yet To Start",
#                 "currentProcessOpeStaffno": None,
#                 "currentProcessOpeName": None,
#                 "Tasks_Completed": 0,
#                 "Overall_PCB_status": "NEW",
#             }

#         pcb_list.append(pcb_data)

#     return {"pcbs": pcb_list}




@app.get("/supervisor/typepcbdetails")
def supervisor_typepcbdetails(staff_no: str, type: str, db: Session = Depends(init_db)):

    # get_staff = db.query(PCBAssignment.supervisor_staff_no).filter(PCBAssignment.supervisor_staff_no==staff_no).all()

    # if not get_staff:
    #      raise HTTPException(status_code=404, detail="Supervisor not found")
    print("type: ",type)
    if type=="":
         raise HTTPException(status_code=404, detail="Status not found")

    today = datetime.now()
    results = []
    completelybuilt=[]
    inactionres=[]
    ope_log=db.query(OperatorLog).filter(OperatorLog.Task_Status=="Completed").all()


     #return fully build pcb details:
    if type == "COMPLETED":
        # completlybuild=db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id == PcbData.PCBserialNoPartNumber).filter(PCBAssignment.overall_status=="COMPLETED").all()
        # for i,j in completlybuild:
        #     print("sfnsofnso",j.serialNo)
        #     results.append({
        #         "Serial_No":j.serialNo,
        #         "partNumber":j.partNumber,
        #         "productionOrder":j.productionOrder,
        #         "Type":j.Type,
        #         "description":j.description,
        #     })

        # completlybuild = db.query(PCBAssignment,PcbData).outerjoin(PCBAssignment,PCBAssignment.assigned_pcb_id  == PcbData.PCBserialNoPartNumber).filter(or_(PcbData.Type == "HEXA-MAIN" , PcbData.Type=="OCTA-MAIN")).filter(PCBAssignment.overall_status == "COMPLETED").all()
        completlybuild = db.query(PCBAssignment,PcbData).outerjoin(PcbData,PCBAssignment.assigned_pcb_id  == PcbData.PCBserialNoPartNumber).filter(or_(PcbData.Type == "HEXA-MAIN" , PcbData.Type=="OCTA-MAIN")).filter(PCBAssignment.overall_status == "COMPLETED").all()
        print("complet: ",completlybuild)
        for i , j in completlybuild:
            results.append({
                "Serial_No":j.serialNo,
                "partNumber":j.partNumber,
                "productionOrder":j.productionOrder,
                "Type":j.Type,
                "description":j.description,
            })

    #RETURN ALL INACTION LIST PCBS:
    if type == "Inaction":
            inactiondata=db.query(PcbData).filter(PcbData.status == type).all()
            print("inaction: ",inactiondata,len(inactiondata))
            for i in inactiondata:
                results.append({
                    "Serial_No":i.serialNo,
                    "partNumber":i.partNumber,
                    "productionOrder":i.productionOrder,
                    "Type":i.Type,
                    "description":i.description,
                })

    if type == "New":
        new=db.query(PcbData).filter(PcbData.status == type).all()
            # print("inaction: ",inactiondata,len(inactiondata))
        for i in new:
                results.append({
                    "Serial_No":i.serialNo,
                    "partNumber":i.partNumber,
                    "productionOrder":i.productionOrder,
                    "Type":i.Type,
                    "description":i.description,
                })

    if type == "Assigned":
        # new=db.query(PcbData).filter(PcbData.status == type).all()
        new = db.query(PCBAssignment,PcbData).outerjoin(PcbData,PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id).filter(PCBAssignment.current_step_id != None).all()
            # print("inaction: ",inactiondata,len(inactiondata))
        for j,i in new:
                results.append({
                    "Serial_No":i.serialNo,
                    "partNumber":i.partNumber,
                    "productionOrder":i.productionOrder,
                    "Type":i.Type,
                    "description":i.description,
                })


    
    if type =="Today":
        for log in ope_log:
            completed_date = parse_db_date(log.end_time)
            diff = today-completed_date
            if diff.days <1:
                # print()
                # print(diff.days)
                Pcb_Details = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber==log.PCBserialNoPartNumber).all()
                for pcb in Pcb_Details:
                    result = {

                        "Serial_No" : pcb.serialNo,
                        "Part_Number" : pcb.partNumber,
                        "Production_Order": pcb.productionOrder,
                        "Description": pcb.description,
                            "Type" : pcb.Type,
                            "Task":log.Task_Name,
                            "stage_id":log.current_step_id

                    }
                
                results.append(result)
    return results



@app.get("/timeline")
def timeline(SerialNo: str, db: Session = Depends(init_db)):

    # get_staff = db.query(PCBAssignment.supervisor_staff_no).filter(PCBAssignment.supervisor_staff_no==staff_no).all()

    # if not get_staff:
    #      raise HTTPException(status_code=404, detail="Supervisor not found")

    if SerialNo=="":
         raise HTTPException(status_code=404, detail="Status not found")
    pcbsnpt=SerialNo
    is_completed_fully=db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id == SerialNo).first()
    if is_completed_fully.current_step_id == None or is_completed_fully.current_step_id <0:
        pcbserialnumber=pcbsnpt.split("$")[0]
        Pcb_Details = db.query(PcbData).filter(PcbData.serialNo==pcbserialnumber).all()
      
        print("Pcb_Details: ",Pcb_Details)
        # print("no of pcbs in pcbdata: ",len(Pcb_Details))
        # for i in Pcb_Details:

        # ope_log=
        
        pass

        # Pcb_Assignment_details = db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id==Pcb_Details.PCBserialNoPartNumber)











    Pcb_Details = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber==pcbsnpt).first()
    # print("pcb details: ",Pcb_Details.serialNo)
    Pcb_Assignment_details = db.query(PCBAssignment).filter(PCBAssignment.assigned_pcb_id==Pcb_Details.PCBserialNoPartNumber).first()
    # print("Pcb_Assignment_details: ",Pcb_Assignment_details.assigned_pcb_id)
    ope_log_details = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber==Pcb_Details.PCBserialNoPartNumber).all()
    ope_log = db.execute(
            select(OperatorLog)
            .where(OperatorLog.PCBserialNoPartNumber == Pcb_Details.PCBserialNoPartNumber)
            .order_by(OperatorLog.current_step_id)  # Order by timestamp (or your date/time column)   <===============================================change done by adithya
        ).scalars().all()
    durations=[]
    for log in ope_log:
        s=log.start_time
        e = log.end_time
        durations.append((e - s).total_seconds())
    results = {

        "Serial_No" : Pcb_Details.serialNo,   
        "Part_Number" : Pcb_Details.partNumber, 
        "Production_Order": Pcb_Details.productionOrder, 
        "Description": Pcb_Details.description,
            "Type" : Pcb_Details.Type, 
        "New_Time":Pcb_Details.createdAt, 
        "Inaction_time":Pcb_Details.updatedAt, 
        "Assigned_time":Pcb_Assignment_details.assignment_date,
        "ope_log_details":ope_log,
        "Durations":durations
    }
        

    return results





# @app.get("timeline_of_completed")
# def timeline_of_completed(SerialNo: str, db: Session = Depends(init_db)):
#     if SerialNo=="":
#          raise HTTPException(status_code=404, detail="Status not found")

    




























# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from sqlalchemy import func, case, distinct, cast, Date
# from datetime import datetime
# import statistics
# @app.get("/dashboard/analytics")
# def get_dashboard_analytics(db: Session = Depends(init_db)):
#     """
#     MASTER DASHBOARD ANALYTICS
#     Returns:
#     1. PCB Breakdown (Type & Status)
#     2. Production Flow (WIP & Staff Capacity per Step)
#     3. Operator Load (Active PCBs per Operator)
#     4. Cycle Time (Average duration per Step)
#     5. Batch Aging (Stuck/Old Batches)
#     6. Daily Order Trend (Velocity) - NEW!
#     """

#     # Helper for date parsing
#     def parse_db_date(date_str):
#         if not date_str: return None
#         try: return datetime.fromisoformat(str(date_str))
#         except ValueError: return None

#     # ======================================================
#     # 1. PCB TYPE COUNTS
#     # ======================================================
#     type_counts = (
#         db.query(PcbData.Type, func.count(PcbData.ID).label("count"))
#         .group_by(PcbData.Type)
#         .all()
#     )
#     pcb_type_distribution = {(row.Type or "Unknown"): row.count for row in type_counts}

#     # ======================================================
#     # 2. PCB STATUS COUNTS
#     # ======================================================
#     status_counts = (
#         db.query(PcbData.status, func.count(PcbData.ID).label("count"))
#         .group_by(PcbData.status)
#         .all()
#     )
#     pcb_status_distribution = {(row.status or "Unknown"): row.count for row in status_counts}

#     # ======================================================
#     # 3. PRODUCTION FLOW METRICS
#     # ======================================================
#     flow_stats = (
#         db.query(
#             ProcessFlowMaster.flow_step_id,
#             ProcessFlowMaster.step_name,
#             ProcessFlowMaster.step_order,
#             func.count(PCBAssignment.assignment_id).label("active_wip_count"),
#             func.count(distinct(OperatorStepMapping.operator_staff_no)).label("qualified_staff_count")
#         )
#         .outerjoin(PCBAssignment, (PCBAssignment.current_step_id == ProcessFlowMaster.flow_step_id) & 
#                                   (PCBAssignment.overall_status == "IN_PROGRESS"))
#         .outerjoin(OperatorStepMapping, OperatorStepMapping.flow_step_id == ProcessFlowMaster.flow_step_id)
#         .group_by(ProcessFlowMaster.flow_step_id, ProcessFlowMaster.step_name, ProcessFlowMaster.step_order)
#         .order_by(ProcessFlowMaster.step_order)
#         .all()
#     )
#     Assigned_Pcbs = db.query(PCBAssignment).all()
#     prev_pcb_step=""
#     counts={}
#     production_flow=[]
#     count=0
#     prev_step_list={}
#     for pcb in Assigned_Pcbs:
#         current_stepname = db.query(ProcessFlowMaster.step_name).filter(ProcessFlowMaster.step_order==pcb.current_step_id).first()
#         stepname = current_stepname.step_name if current_stepname else ""
#         found = check_step(prev_step_list,stepname)        
#         if found:
#             prev_step_list[stepname]=prev_step_list[stepname]+1
#         else:
#             prev_step_list[stepname]=1
#             count=1
#         prev_pcb_step=stepname
#     for stepname in prev_step_list:
#         step_order = db.query(ProcessFlowMaster.step_order).filter(ProcessFlowMaster.step_name==stepname).first()
#         operators_count = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==step_order.step_order).count()
        
#         result = {
#             "step": stepname,
#             "order": step_order.step_order,
#             "active_pcbs": prev_step_list[stepname],
#             "staff_capacity": operators_count

#         }
#         production_flow.append(result)
#     # print(prev_step_list)
#     # return results
#     # return prev_step_list
#     # production_flow = []
#     # for row in flow_stats:
#     #     production_flow.append({
#     #         "step": row.step_name,
#     #         "order": row.step_order,
#     #         "active_pcbs": row.active_wip_count,
#     #         "staff_capacity": row.qualified_staff_count
#     #     })

#     Overall_Task_Data = []
#     Steps = db.query(ProcessFlowMaster).all()
#     for step in Steps:
#         operators_count = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==step.step_order).count()
#         result = {
#             "step": step.step_name,
#             "order": step.step_order,
#             "staff_capacity": operators_count
#         }
#         Overall_Task_Data.append(result)

#     # ======================================================
#     # 4. OPERATOR LOAD
#     # ======================================================
#     operator_counts = (
#         db.query(
#             PCBProcessLog.assigned_operator_staff_no,
#             func.count(PCBAssignment.assignment_id).label("pcb_count")
#         )
#         .join(PCBAssignment, PCBAssignment.assignment_id == PCBProcessLog.assignment_id)
#         .filter(
#             PCBAssignment.overall_status == "IN_PROGRESS",
#             PCBAssignment.current_step_id == PCBProcessLog.flow_step_id,
#             PCBProcessLog.assigned_operator_staff_no != None
#         )
#         .group_by(PCBProcessLog.assigned_operator_staff_no)
#         .all()
#     )

#     op_names = db.query(OperatorStepMapping.operator_staff_no, OperatorStepMapping.operator_name).distinct().all()
#     name_lookup = {row.operator_staff_no: row.operator_name for row in op_names}

#     operator_load_data = []
#     for row in operator_counts:
#         staff_no = row.assigned_operator_staff_no
#         operator_load_data.append({
#             "staff_no": staff_no,
#             "name": name_lookup.get(staff_no, f"Staff {staff_no}"),
#             "pcb_count": row.pcb_count
#         })

#     # ======================================================
#     # 5. CYCLE TIME ANALYTICS
#     # ======================================================
#     time_logs = (
#         db.query(ProcessFlowMaster.step_name, PCBProcessLog.start_time, PCBProcessLog.end_time)
#         .join(ProcessFlowMaster, ProcessFlowMaster.flow_step_id == PCBProcessLog.flow_step_id)
#         .filter(
#             PCBProcessLog.process_status == "COMPLETED",
#             PCBProcessLog.start_time.isnot(None),
#             PCBProcessLog.end_time.isnot(None)
#         )
#         .all()
#     )

#     step_durations = {}
#     for row in time_logs:
#         start = parse_db_date(row.start_time)
#         end = parse_db_date(row.end_time)
#         if start and end and end > start:
#             duration = (end - start).total_seconds() / 60.0
#             step_durations.setdefault(row.step_name, []).append(duration)

#     cycle_time_data = []
#     for step, durations in step_durations.items():
#         if durations:
#             cycle_time_data.append({
#                 "step_name": step,
#                 "avg_time_minutes": round(statistics.mean(durations), 2),
#                 "sample_size": len(durations)
#             })


#      # ======================================================
#     # 4. OPERATOR PRESENCE COUNT
#     # ======================================================
#     operator_presence_query = (
#         db.query(
#             OperatorStepMapping.operator_staff_no,
#             func.count(OperatorStepMapping.operator_staff_no).label("presence_count")
#         )
#         .group_by(OperatorStepMapping.operator_staff_no)
#         .all()
#     )
#     # print(operator_presence_query)
#     operator_presence_data = []
#     for row in operator_presence_query:
#         staff_no = row.operator_staff_no
#         operator_presence_data.append({
#             "staff_no": staff_no,
#             "presence_count": row.presence_count
#         })


#     # ======================================================
#     # 6. BATCH AGING (Stuck PCBs)
#     # ======================================================
#     active_assignments = (
#         db.query(PCBAssignment.assignment_id, PCBAssignment.assigned_pcb_id, 
#                  PCBAssignment.assignment_date, PCBAssignment.current_step_id)
#         .filter(PCBAssignment.overall_status == "IN_PROGRESS")
#         .all()
#     )

#     now = datetime.now()
#     stuck_batches = []
#     total_age = 0
    
#     for row in active_assignments:
#         assigned_date = parse_db_date(row.assignment_date)
#         Pcbdata_record = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber==row.assigned_pcb_id).first()
#         process_record = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_order==row.current_step_id).first()
#         if assigned_date:
#             age = (now - assigned_date).total_seconds() / 86400
#             total_age += age
#             if age > 5: # Threshold: 5 days
#                 stuck_batches.append({
#                     "assignment_id": row.assignment_id,
#                     "pcb_id": Pcbdata_record.serialNo,
#                     "age_days": round(age, 1),
#                     "current_step_id": row.current_step_id,
#                     "current_step_name":process_record.step_name
#                 })
    
#     avg_age = (total_age / len(active_assignments)) if active_assignments else 0

#     # ======================================================
#     # 7. DAILY ORDER TREND (Velocity) - NEW IMPLEMENTATION
#     # Source: PcbData (createdAt)
#     # ======================================================
#     # Groups orders by Date(createdAt) to see daily input volume
    
#     daily_trend_query = (
#         db.query(
#             cast(PcbData.createdAt, Date).label("date"),
#             func.count(PcbData.ID).label("count")
#         )
#         .filter(PcbData.createdAt.isnot(None))
#         .group_by(cast(PcbData.createdAt, Date))
#         .order_by(cast(PcbData.createdAt, Date))
#         .all()
#     )

#     order_trend_data = [
#         {"date": str(row.date), "count": row.count} 
#         for row in daily_trend_query
#     ]

#     # ======================================================
#     # FINAL RETURN
#     # ======================================================
#     return {
#         "pcb_types": pcb_type_distribution,
#         "pcb_statuses": pcb_status_distribution,
#         "production_flow": production_flow,
#         "Overall_Task_Data":Overall_Task_Data,
#         "operator_load": operator_load_data,
#         "cycle_time": cycle_time_data,
#         "operator_presence": operator_presence_data,
#         "batch_aging": {
#             "average_wip_age_days": round(avg_age, 1),
#             "stuck_count": len(stuck_batches),
#             "stuck_list": stuck_batches
#         },
#         "order_trend": order_trend_data  # <--- NEW DATA
#     }








# # @app.get("/operator/prevhist")
# # async def get_operator_log(pcb_serial: str = Query(..., description="PCB Serial Number (up to '$')"),
# #                            stage_id: int = Query(..., description="Current Stage ID - 1")):
# #     """
# #     Retrieves log data for a given PCB serial number and stage ID.

# #     - pcb_serial: The PCB serial number (up to the '$' character).
# #     - stage_id: The current stage ID - 1.
# #     """
# #     pcb_serial_no = OperatorLog.PCBserialNoPartNumber
# #     return pcb_serial_no

# @app.get("operator/prevhist")
# async def get_ope_log_data(pcb_serial: str,
#     stgid: str,
#     db: Session = Depends(init_db),):
#     # print("sfnsojfnsjnf")
#     """
#     Retrieves log data for a specific PCB serial and step ID.
#     """
#     try:
#         curr_stg_id = int(stgid) - 1  # Convert stgid to int and subtract 1
#     except ValueError:
#         raise HTTPException(status_code=400, detail="Invalid stgid format. Must be an integer.")

#     # Get the PCB serial from the database and split it
#     db_pcb_serial = db.query(OperatorLog.PCBserialNoPartNumber).first()
#     if db_pcb_serial is None:
#         raise HTTPException(status_code=404, detail="Log data not found for the given criteria.")

#     try:
#         extracted_pcb_serial = db_pcb_serial[0].split('$')[0]  # Extract before first '$'
#     except AttributeError:
#         raise HTTPException(status_code=500, detail="Error extracting PCB serial from database value.")

#     result = db.query(OperatorLog.log_Data).filter(
#         extracted_pcb_serial == pcb_serial,
#         OperatorLog.current_step_id == curr_stg_id
#     ).first()

#     if result is None:
#         raise HTTPException(status_code=404, detail="Log data not found for the given criteria.")

#     return {"log_data": result}  # Wrap the result in a dictionary










    # try:
    #     # Extract the serial number part before the '$'
    #     pcb_serial_no = pcb_serial.split('$')[0]

    #     # Filter the DataFrame based on PCB serial number and stage ID
    #     filtered_df = df[(df['PCBserialNoPartNumber'].str.startswith(pcb_serial_no)) & (df['current_step_id'] == stage_id)]

    #     # Extract log data
    #     log_data_list = filtered_df['log_Data'].tolist()
        
    #     if not log_data_list:
    #         return {"message": "No data found for the specified PCB serial and stage."}

    #     # Convert to list of LogEntry objects
    #     results = []
    #     for i in range(len(log_data_list)):
    #       results.append(LogEntry(pcb_serial=pcb_serial_no, current_step_id=stage_id, log_data=log_data_list[i]))      



    #     return results

    # except Exception as e:
    #     return {"error": str(e)}
    # pcb_serial_no = OperatorLog.PCBserialNoPartNumber.split('$')[0]
    # operator_Json_log = db.query(OperatorLog.log_Data).filter(OperatorLog.pcb_serial==pcb_serial_no)
    # return operator_Json_log



# import pandas as pd
# @app.get("/getdefflow")
# def getdefflow(db: Session = Depends(init_db)):
#     details=db.query(ProcessFlowMaster).all()
#     operator=db.query(OperatorStepMapping).all()
#     df1=pd.DataFrame(details)
#     df2=pd.DataFrame(operator)
#     print("df1: ",df1)
#     temp = pd.merge(df1,df2,on="flow_step_id")
   
#     return operator
    
@app.get("/get_flow_data")
def get_flow_data(db: Session = Depends(init_db)):
    """
    Fetches the combined Flow Steps and their Assigned Operators.
    This replaces the Node.js '/getdefflow' endpoint.
    """
    
    # Perform a LEFT JOIN to ensure we see steps even if no operator is assigned yet
    # (Though typically your upload logic ensures they come in pairs)
    results = db.query(
        ProcessFlowMaster, 
        OperatorStepMapping
    ).outerjoin(
        OperatorStepMapping, 
        ProcessFlowMaster.flow_step_id == OperatorStepMapping.flow_step_id
    ).order_by(
        ProcessFlowMaster.step_order.asc()
    ).all()

    response_data = []
    
    for step, mapping in results:
        # If mapping exists, use its data; otherwise, use defaults or step data
        row = {
            "id": mapping.step_map_id if mapping else step.flow_step_id, # Unique Key
            "pcbProcessName": step.step_name,
            
            # Operator Details (Handle cases where step exists but no operator assigned)
            "assignedTo": mapping.operator_staff_no if mapping else "",
            "assignedToName": mapping.operator_name if mapping else "",
            "assignedToNameInitial": mapping.operator_initial if mapping else "",
            
            # MRL Details
            "assignedToNameMRL": mapping.operator_MRL if mapping else step.assignedToNameMRL,
            "assignedToNameMRLExpiry": mapping.operator_MRL_Expiry if mapping else step.assignedToNameMRLExpiry
        }
        response_data.append(row)

    return {"PcbData": response_data}







# done ny me @jan27

# ============================================================
# FLOW ASSIGNMENT CRUD ENDPOINTS
# ============================================================

# 1. Pydantic Model for Request Validation (Not a new table)
class FlowUpdateReq(BaseModel):
    id: Optional[int] = None  # Mapping ID (None for Create, present for Update)
    pcbProcessName: str
    assignedTo: str
    assignedToName: str
    assignedToNameInitial: str
    assignedToNameMRL: str
    assignedToNameMRLExpiry: str

# --- CREATE (Add New Record) ---
@app.post("/create_flow_mapping")
def create_flow_mapping(req: FlowUpdateReq, db: Session = Depends(init_db)):
    # Find or Create the Process Step first
    step = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_name == req.pcbProcessName.strip()).first()
    
    if not step:
        step = ProcessFlowMaster(
            step_name=req.pcbProcessName.strip(),
            assignedToNameMRL=req.assignedToNameMRL,
            assignedToNameMRLExpiry=req.assignedToNameMRLExpiry
        )
        db.add(step)
        db.flush() # Generates flow_step_id

    # Create the Operator Mapping
    new_mapping = OperatorStepMapping(
        flow_step_id=step.flow_step_id,
        operator_staff_no=normalize_staff(req.assignedTo),
        operator_name=req.assignedToName,
        operator_initial=req.assignedToNameInitial,
        operator_MRL=req.assignedToNameMRL,
        operator_MRL_Expiry=req.assignedToNameMRLExpiry
    )
    db.add(new_mapping)
    db.commit()
    return {"message": "New entry created successfully"}

# --- UPDATE (Edit Existing Record) ---
@app.put("/update_flow_mapping")
def update_flow_mapping(req: FlowUpdateReq, db: Session = Depends(init_db)):
    # 1. Find the existing mapping
    mapping = db.get(OperatorStepMapping, req.id)
    if not mapping:
        # Fallback for vacant steps (HASS): Find the step and create a mapping
        step = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_name == req.pcbProcessName.strip()).first()
        if not step:
            raise HTTPException(status_code=404, detail="Process step not found")
        
        mapping = OperatorStepMapping(flow_step_id=step.flow_step_id)
        db.add(mapping)

    # 2. Update Operator details
    mapping.operator_staff_no = normalize_staff(req.assignedTo)
    mapping.operator_name = req.assignedToName
    mapping.operator_initial = req.assignedToNameInitial
    mapping.operator_MRL = req.assignedToNameMRL
    mapping.operator_MRL_Expiry = req.assignedToNameMRLExpiry

    # 3. FIX THE BUG: Sync Process Name ONLY if it has changed
    step = db.get(ProcessFlowMaster, mapping.flow_step_id)
    new_name = req.pcbProcessName.strip()
    
    if step and step.step_name != new_name:
        # Check if the NEW name already exists elsewhere to avoid IntegrityError
        exists = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_name == new_name).first()
        if exists:
            # If it exists, just link the mapping to that existing step ID
            mapping.flow_step_id = exists.flow_step_id
        else:
            # If it's a brand new unique name, update the current step
            step.step_name = new_name

    db.commit()
    return {"message": "Mapping updated successfully"}


# --- DELETE (Remove Record) ---
@app.delete("/delete_flow_mapping/{mapping_id}")
def delete_flow_mapping(mapping_id: int, db: Session = Depends(init_db)):
    mapping = db.get(OperatorStepMapping, mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping not found")
    
    db.delete(mapping)
    db.commit()
    return {"message": "Mapping deleted successfully"}




@app.get("/get_all_operators")
def get_operator_suggestions(db: Session = Depends(init_db)):
    """Returns unique operators from UserProfiles and OperatorStepMapping tables."""

    users = db.query(UserProfile, OperatorStepMapping).filter(
        func.upper(UserProfile.userRole).in_(["OPERATOR", "TECHNICIAN"]),
        UserProfile.userID == OperatorStepMapping.operator_staff_no
    ).distinct(UserProfile.userID).all() 

    operator_list = []
    for user, mapping in users:
        operator_list.append({
            "staff_no": user.userID,
            "name": user.username,
            "role": user.userRole,
            "operator_initial": mapping.operator_initial,
            "operator_mrl":mapping.operator_MRL,
            "operator_mrl_expiry":mapping.operator_MRL_Expiry
        })

    return operator_list

@app.get("/get_all_processes")
def get_process_suggestions(db: Session = Depends(init_db)):
    """Returns unique process names from existing masters."""
    # Using distinct to avoid duplicates from different stages
    results = db.query(ProcessFlowMaster.step_name).distinct().all()
    return [r.step_name for r in results if r.step_name]






























import statistics
from datetime import datetime
from sqlalchemy import cast, Date, distinct, func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import Counter
def parse_db_date(date_str):
        if not date_str: return None
        try: return datetime.fromisoformat(str(date_str).replace("Z", ""))
        except ValueError: return None

# Assuming standard FastAPI setup with init_db dependency
@app.get("/dashboard/analytics")
def get_dashboard_analytics(db: Session = Depends(init_db)):
    """
    MASTER DASHBOARD ANALYTICS
    - PCB Breakdown (Type & Status)
    - Production Flow (Live WIP & Staff Capacity per Step)
    - Overall Operation Wise (Current PCB distribution across ALL stages)
    - Operator Load (Live Active PCBs per Operator)
    - Overall Operator Wise (Current distribution across staff with handover logic)
    - Cycle Time (Average duration per Step)
    - Batch Aging (Stuck/Old Batches)
    - Daily Order Trend (Velocity)
    """

    # Helper for date parsing
    
    # Helper for date parsing
    def parse_db_date(date_str):
        if not date_str: return None
        try: 
            # Handles ISO strings from your pcb_assignment/pcb_process_log tables
            return datetime.fromisoformat(str(date_str).replace("Z", ""))
        except ValueError: 
            return None

    now = datetime.now()
    three_days_ago = now - timedelta(days=3)


    # ======================================================
    # 1. PCB TYPE & STATUS DISTRIBUTION
    # ======================================================
    type_counts = (
        db.query(PcbData.Type, func.count(PcbData.ID).label("count"))
        .group_by(PcbData.Type)
        .all()
    )
    pcb_type_distribution = {(row.Type or "Unknown"): row.count for row in type_counts}

    status_counts = (
        db.query(PcbData.status, func.count(PcbData.ID).label("count"))
        .group_by(PcbData.status)
        .all()
    )
    pcb_status_distribution = {(row.status or "Unknown"): row.count for row in status_counts}

    # ======================================================
    # 2. PRODUCTION FLOW (LIVE - OPERATION WISE)
    # ======================================================
    active_assignments = db.query(PCBAssignment).filter(PCBAssignment.overall_status == "IN_PROGRESS").all()
    print("active_assignments: ",type(active_assignments),active_assignments)
    
    live_step_counts = {}
    for pcb in active_assignments:
        # current_step = db.query(ProcessFlowMaster.step_name).filter(ProcessFlowMaster.step_order == pcb.current_step_id).first()
        # stepname = current_step.step_name if current_step else "Unknown"
        # live_step_counts[stepname] = live_step_counts.get(stepname, 0) + 1
        current_step = db.query(ProcessFlowMaster.step_name,OperatorLog).filter(ProcessFlowMaster.step_order == pcb.current_step_id).filter(OperatorLog.Task_Status == "Started").first()
        stepname = current_step.step_name if current_step else "Unknown"
        live_step_counts[stepname] = live_step_counts.get(stepname, 0) + 1
        print("stepname: ",stepname," live_step_counts[stepname]: ",live_step_counts)

    production_flow = []
    for stepname, pcb_count in live_step_counts.items():
        step_master = db.query(ProcessFlowMaster.step_order).filter(ProcessFlowMaster.step_name == stepname).first()
        # step_master  =db.query(PCBAssignment,OperatorLog).outerjoin(OperatorLog,OperatorLog.Task_Status == "Started").first()

        operators_count = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id == step_master.step_order).count() if step_master else 0
        
        production_flow.append({
            "step": stepname,
            "order": step_master.step_order if step_master else 0,
            "active_pcbs": pcb_count,
            "staff_capacity": operators_count
        })

    # ======================================================
    # 3. OVERALL OPERATION WISE
    # x-axis: ALL operations | y-axis: Total PCBs currently present
    # ======================================================
    overall_op_stats = (
        db.query(
            ProcessFlowMaster.step_name,
            func.count(PCBAssignment.assignment_id).label("pcb_count")
        )
        .outerjoin(PCBAssignment, (PCBAssignment.current_step_id == ProcessFlowMaster.flow_step_id) & 
                                  (PCBAssignment.overall_status == "IN_PROGRESS"))
        .group_by(ProcessFlowMaster.step_name)
        .all()
    )
    overall_operation_wise = [
        {"step": row.step_name, "pcb_count": row.pcb_count} 
        for row in overall_op_stats
    ]


     # ======================================================
#     # 4. OPERATOR PRESENCE COUNT
#     # ======================================================
    operator_presence_query = (
        db.query(
            OperatorStepMapping.operator_staff_no,
            func.count(OperatorStepMapping.operator_staff_no).label("presence_count")
        )
        .group_by(OperatorStepMapping.operator_staff_no)
        .all()
    )
    # print(operator_presence_query)
    operator_presence_data = []
    for row in operator_presence_query:
        staff_no = row.operator_staff_no
        operator_presence_data.append({
            "staff_no": staff_no,
            "presence_count": row.presence_count
        })




    # ======================================================
    # 4. OPERATOR LOAD (LIVE - OPERATOR WISE)
    # ======================================================
    live_operator_counts = (
        db.query(
            PCBProcessLog.assigned_operator_staff_no,
            func.count(PCBAssignment.assignment_id).label("pcb_count")
        )
        .join(PCBAssignment, PCBAssignment.assignment_id == PCBProcessLog.assignment_id)
        .filter(
            PCBAssignment.overall_status == "IN_PROGRESS",
            PCBAssignment.current_step_id == PCBProcessLog.flow_step_id,
            PCBProcessLog.start_time.isnot(None)
        )
        .group_by(PCBProcessLog.assigned_operator_staff_no)
        .all()
    )

    op_names_query = db.query(OperatorStepMapping.operator_staff_no, OperatorStepMapping.operator_name).distinct().all()
    name_lookup = {row.operator_staff_no: row.operator_name for row in op_names_query}

    operator_load_data = []
    for row in live_operator_counts:
        staff_no = row.assigned_operator_staff_no
        operator_load_data.append({
            "staff_no": staff_no,
            "name": name_lookup.get(staff_no, staff_no),
            "pcb_count": row.pcb_count
        })

    # ======================================================
    # 5. OVERALL OPERATOR WISE (HANDOVER LOGIC)
    # x-axis: all operator staff numbers
    # y-axis: count of PCBs currently "held" or "available"
    # ======================================================
    # operator_pcb_counts = {op.operator_staff_no: 0 for op in op_names_query}
    
    # for assign in active_assignments:
    #     # Check if an operator has started the PCB at the current step
    #     active_log = db.query(PCBProcessLog).filter(
    #         PCBProcessLog.assignment_id == assign.assignment_id,
    #         PCBProcessLog.flow_step_id == assign.current_step_id,
    #         PCBProcessLog.start_time.isnot(None)
    #     ).first()

    #     if active_log and active_log.assigned_operator_staff_no:
    #         # Case: Started - Only the active operator holds it
    #         op_id = active_log.assigned_operator_staff_no
    #         if op_id in operator_pcb_counts:
    #             operator_pcb_counts[op_id] += 1
    #     else:
    #         # Case: Pending - Available to all qualified operators for this step
    #         qualified_ops = db.query(OperatorStepMapping.operator_staff_no).filter(
    #             OperatorStepMapping.flow_step_id == assign.current_step_id
    #         ).all()
    #         for op in qualified_ops:
    #             op_id = op.operator_staff_no
    #             if op_id in operator_pcb_counts:
    #                 operator_pcb_counts[op_id] += 1

    # overall_operator_wise = [
    #     {
    #         "staff_no": staff_no,
    #         "name": name_lookup.get(staff_no, staff_no),
    #         "pcb_count": count
    #     }
    #     for staff_no, count in operator_pcb_counts.items()
    # ]
    temp = list(db.query(OperatorStepMapping.operator_staff_no).all())
    staff_numbers = [item[0] for item in temp]

    # Count occurrences
    ope_counts = Counter(staff_numbers)

    response_data = []
    for staff_no, count in ope_counts.items():
        response_data.append({
            "staff_no": staff_no,
            "count": count
        })
    overall_operator_wise=response_data



    # ======================================================
    # 6. CYCLE TIME ANALYTICS
    # ======================================================
    time_logs = (
        db.query(ProcessFlowMaster.step_name, PCBProcessLog.start_time, PCBProcessLog.end_time)
        .join(ProcessFlowMaster, ProcessFlowMaster.flow_step_id == PCBProcessLog.flow_step_id)
        .filter(
            PCBProcessLog.process_status == "COMPLETED",
            PCBProcessLog.start_time.isnot(None),
            PCBProcessLog.end_time.isnot(None)
        )
        .all()
    )

    step_durations = {}
    for row in time_logs:
        start = parse_db_date(row.start_time)
        end = parse_db_date(row.end_time)
        if start and end and end > start:
            duration = (end - start).total_seconds() / 60.0
            step_durations.setdefault(row.step_name, []).append(duration)

    cycle_time_data = []
    for step, durations in step_durations.items():
        cycle_time_data.append({
            "step_name": step,
            "avg_time_minutes": round(statistics.mean(durations), 2),
            "sample_size": len(durations)
        })
    
    # ======================================================
    # 7. BATCH AGING & TRENDS
    # ======================================================
    stuck_list = []
    total_active_wip_age = 0
    
    stuck_query = (
        db.query(PCBProcessLog, PcbData, ProcessFlowMaster)
        .join(PCBAssignment, PCBAssignment.assignment_id == PCBProcessLog.assignment_id)
        .join(PcbData, PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id)
        .join(ProcessFlowMaster, ProcessFlowMaster.flow_step_id == PCBProcessLog.flow_step_id)
        .filter(
            PCBAssignment.overall_status == "IN_PROGRESS",
            PCBProcessLog.process_status.in_(["PENDING", "STARTED", "PAUSED"])
        )
        .all()
    )

    for log, pcb, step in stuck_query:
        # Use start_time if started, otherwise fallback to assignment date
        ref_time_str = log.start_time
        
        if not ref_time_str:
            assignment = db.query(PCBAssignment).filter(PCBAssignment.assignment_id == log.assignment_id).first()
            ref_time_str = assignment.assignment_date if assignment else None

        ref_time = parse_db_date(ref_time_str)
        
        if ref_time:
            age_days = (now - ref_time).total_seconds() / 86400
            total_active_wip_age += age_days
            
            if age_days > 3:
                stuck_list.append({
                    "assignment_id": log.assignment_id,
                    "pcb_id": pcb.serialNo,
                    "age_days": round(age_days, 1),
                    "current_step_name": step.step_name,
                    "status": log.process_status,
                    "operator": log.assigned_operator_staff_no
                })

    # FIX: Using the same variable name consistently here
    avg_age_days = (total_active_wip_age / len(stuck_query)) if stuck_query else 0

    daily_trend = (
        db.query(cast(PcbData.createdAt, Date).label("date"), func.count(PcbData.ID).label("count"))
        .filter(PcbData.createdAt.isnot(None))
        .group_by(cast(PcbData.createdAt, Date))
        .order_by(cast(PcbData.createdAt, Date))
        .all()
    )

    overall_task_data = []
    all_steps = db.query(ProcessFlowMaster).all()
    print("all steps: ",len(all_steps))
    for s in all_steps:
        cap = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id == s.step_order).count()
        overall_task_data.append({"step": s.step_name, "order": s.step_order, "staff_capacity": cap})

    return {
        "pcb_types": pcb_type_distribution,
        "pcb_statuses": pcb_status_distribution,
        "production_flow": production_flow,
        "overall_operation_wise": overall_operation_wise,
        "operator_load": operator_load_data,
        "overall_operator_wise": overall_operator_wise,
        "cycle_time": cycle_time_data,
        "Overall_Task_Data": overall_task_data,
        "operator_presence": operator_presence_data,
        "batch_aging": {
            "average_wip_age_days": round(avg_age_days, 1),
            "stuck_count": len(stuck_list),
            "stuck_list": stuck_list
        },
        "order_trend": [{"date": str(r.date), "count": r.count} for r in daily_trend]
    }







# done by me at @feb 2 2026




@app.get("/operatordashboard")
def operator_view(staff_no: str, db: Session = Depends(init_db)):
    staff = normalize_staff(staff_no)
    user = find_user_from_profiles(db, staff)
    if not user:
        raise HTTPException(status_code=404, detail="Operator not found")

    # 1. Fetch History for the Productivity Chart (Specific to this Operator)
    history_records = db.query(OperatorLog).filter(
        OperatorLog.operator_staff_no == staff,
        OperatorLog.Task_Status == "Completed"
    ).order_by(desc(OperatorLog.end_time)).limit(50).all()

    operator_history = []
    for log in history_records:
        operator_history.append({
            "pcbserial":log.PCBserialNoPartNumber.split('$')[0],
            "stageName": log.Task_Name,
            "completedAt": log.end_time.isoformat() if log.end_time else None
        })

    # 2. Traceability: Fetch status of EVERY PCB currently in the assembly line
    # (Requirement: "entire assembly line", not just for this operator)
    all_active_pcbs = db.execute(
        select(PCBAssignment, PcbData, ProcessFlowMaster)
        .join(PcbData, PcbData.PCBserialNoPartNumber == PCBAssignment.assigned_pcb_id)
        .join(ProcessFlowMaster, ProcessFlowMaster.flow_step_id == PCBAssignment.current_step_id)
        .where(PCBAssignment.overall_status == "IN_PROGRESS")
    ).all()

    traceability_data = []
    for assignment, pcb, step in all_active_pcbs:
        traceability_data.append({
            "serialNo": pcb.serialNo,
            "partNumber": pcb.partNumber,
            "currentStage": step.step_name,
            "stageId": step.flow_step_id,
            "assignedDate": assignment.assignment_date
        })

    # 3. Existing Operator-Specific Logic for "My Tasks"
    qualified_step_ids = db.execute(
        select(OperatorStepMapping.flow_step_id)
        .where(OperatorStepMapping.operator_staff_no == user.userID)
    ).scalars().all()

    masterlist=db.query(PcbData).filter(PcbData.status=="Inaction").count()
    # print(masterlist,type(masterlist))

    # Get active assignments where the current step matches operator's qualifications
    result = []
    ope_names=[]
    list_of_ope_names=db.query(ProcessFlowMaster,OperatorStepMapping).outerjoin(ProcessFlowMaster,ProcessFlowMaster.flow_step_id == OperatorStepMapping.flow_step_id).filter(staff == OperatorStepMapping.operator_staff_no).all()
    count_ope_names=db.query(ProcessFlowMaster,OperatorStepMapping,PCBAssignment).outerjoin(ProcessFlowMaster,ProcessFlowMaster.flow_step_id == OperatorStepMapping.flow_step_id).outerjoin(PCBAssignment,ProcessFlowMaster.flow_step_id == PCBAssignment.current_step_id).filter(staff == OperatorStepMapping.operator_staff_no).count()
    # print(count_ope_names)
    # for i in count_ope_names:
    # print(count_ope_names)
    
    # print("list_of_ope_names: ",len(list_of_ope_names))
    for i,j in list_of_ope_names:
        temp=db.query(PCBAssignment).filter(PCBAssignment.current_step_id == i.step_order).count()
        ope_names.append({
            "openames":i.step_name,
            "count":temp
        })
    for assignment, pcb, step in all_active_pcbs:
        if assignment.current_step_id in qualified_step_ids:
            # Fetch detailed task logs for the Execute view
            logs = db.execute(
                select(PCBProcessLog, ProcessFlowMaster, OperatorLog)
                .join(ProcessFlowMaster, PCBProcessLog.flow_step_id == ProcessFlowMaster.flow_step_id)
                .outerjoin(OperatorLog, and_(
                     PCBProcessLog.flow_step_id == OperatorLog.current_step_id, 
                     PCBProcessLog.assignment_id == OperatorLog.assignment_id,
                     OperatorLog.operator_staff_no == staff
                ))
                .where(PCBProcessLog.assignment_id == assignment.assignment_id)
                .where(PCBProcessLog.flow_step_id.in_(qualified_step_ids))
            ).all()



            task_list = []
            # print("logs: ",logs)
            for log, s, o_log in logs:
                task_list.append({
                    "flowStepId": s.flow_step_id,
                    "processName": s.step_name,
                    "status": log.process_status,
                    "operator_Json_log": o_log.log_Data if o_log else None
                })

        
    
            result.append({
                "serialNo": pcb.serialNo,
                "currentStepId": assignment.current_step_id,
                "processName": step.step_name,
                "assignmentid": assignment.assignment_id,
                "tasks": task_list
            })

    

    overall_pcbs_completed=[]
    temp=db.query(OperatorLog).filter(OperatorLog.userID == staff_no , OperatorLog.Task_Status == "Completed").all()  
    print("overall_pcbs_completed: ",len(temp))
    for i in temp:
        overall_pcbs_completed.append({
            "serialNo":i.PCBserialNoPartNumber.split("$")[0],
            "stage_number":i.current_step_id,
            "stage_name":i.Task_Name,
            "opname":i.operator_name
        })
    return {
        "operator": user.username,
        "inaction":masterlist,
        "operator_id": user.userID,
        "Productivity_History": operator_history,
        "Assembly_Line_Traceability": traceability_data, 
        "pcbs": result,
        "openames":ope_names,
        "overallpcbslist":overall_pcbs_completed
        
    }
















































# @app.get("/chart")
# def get_data(db: Session = Depends(init_db)):

#     pcb_asg = db.query(PCBAssignment).all()

#     # operator = db.query(OperatorStepMapping).filter(ProcessFlowMaster.step_order==OperatorStepMapping.flow_step_id).all()
#     # print("flow_step_id ",OperatorStepMapping.flow_step_id)
#     # print("step_order ",ProcessFlowMaster.step_order)

#     result = []
#     for r in pcb_asg:
#         serial_no = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber==r.assigned_pcb_id).all()
#         step_name = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_order==r.current_step_id).all()
        
#         for s in serial_no:
#             result.append({
            
#                 "asg_id":r.assigned_pcb_id,
#                 "serial":s.serialNo,
#                 "current_step_id":r.current_step_id,
#             })

#             status=db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber==r.assigned_pcb_id).all()
#             for t in status:
#                 result.append({
#                     "status":t.Task_Status,
#                     "staff_no":t.operator_staff_no,
#                     "Task_name":t.Task_Name,
#                     "operator_name":t.operator_name
#                 })

#         for s in step_name:
#             operator = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id==s.step_order).all()
#             print("step_order", s.step_order)
#             print("OperatorStepMapping",OperatorStepMapping.flow_step_id)
#             for r in operator:
#                 result.append({
#                     "name":s.step_name,
#                     "flow_step_id":r.flow_step_id,
#                     "op_staff_no":r.operator_staff_no,
#                     "operator":r.operator_name

#                 })

    
#     return result




@app.get("/chart")
def get_data(db: Session = Depends(init_db)):

    pcb_assignments = db.query(PCBAssignment).all()
    result = []

    for assignment in pcb_assignments:
        pcb_serial_data = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber == assignment.assigned_pcb_id).all()
        step_name = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_order == assignment.current_step_id).first() 
        
        if step_name is None:
            step_name_str = "Step Not Found"
        else:
            step_name_str = step_name.step_name

        operator_mapping_records = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id == assignment.current_step_id).all()
        operator_names = []

        for operator_mapping in operator_mapping_records:
            operator_names.append({
                "name": step_name_str, 
                "flow_step_id": operator_mapping.flow_step_id,
                "op_staff_no": operator_mapping.operator_staff_no,
                "operator": operator_mapping.operator_name
            })

        status_records = db.query(OperatorLog).filter(OperatorLog.PCBserialNoPartNumber == assignment.assigned_pcb_id).all()
        statuses = []

        for status in status_records:
            statuses.append({
                "status": status.Task_Status,
                "staff_no": status.operator_staff_no,
                "Task_name": status.Task_Name,
                "operator_name": status.operator_name
            })
            
        pcb_data = {
            "asg_id": assignment.assigned_pcb_id,
            "current_step_id": assignment.current_step_id,
            "serial_numbers": [],
            "statuses": statuses,
            "operators": operator_names,
        }
            
        for serial in pcb_serial_data:
            pcb_data["serial_numbers"].append(serial.serialNo)
        
        result.append(pcb_data)

    return result



"""
for dropdown in operator activity analysis list
"""
@app.get("/operatorlistanalysis")
def operartor_list_dropdown(db: Session = Depends(init_db)):

    ope_list=db.query(UserProfile).filter(UserProfile.userRole == "Operator", ).all()
    print("ope_list",ope_list)
    result=[]
    for i in ope_list:
        result.extend({
            i.userID
        })
    return result













@app.get("/ganttchart")
def get_data(db: Session = Depends(init_db)):

    pcb_assignments = db.query(PCBAssignment).all()
    result = []
    previous_task_details = []
    
    
    Data={}
    for assignment in pcb_assignments:
        Completed_Tasks_Details = []
        Pending_Tasks_Details = []
        present_Task_Details=[]
        pcb_serial_data = db.query(PcbData).filter(PcbData.PCBserialNoPartNumber == assignment.assigned_pcb_id).first()
        completed_tasks={}
        pending_tasks={}
        step_name = db.query(OperatorLog).filter(OperatorLog.current_step_id == assignment.current_step_id,OperatorLog.assignment_id == assignment.assignment_id).first() 
        print(step_name)
        present_step_id = int(assignment.current_step_id)
        next_step_id = int(assignment.current_step_id)
        # present_task ={}
        if step_name is not None:
            next_step_id=next_step_id+1
            present_task ={
            "step_id":present_step_id,
            "step_name_str" :step_name.Task_Name,
            "step_name_status" : step_name.Task_Status,
            "Task_start_time":step_name.start_time,
            "step_name_ope_staff_No": step_name.operator_staff_no
            }
        
            present_Task_Details.append(present_task)
        x=3
        print(present_step_id,assignment.assignment_id)
        while(x):
            
            present_step_id=present_step_id-1
            # print(present_step_id)
            if(present_step_id>=1):
                task_detail = db.query(OperatorLog).filter(OperatorLog.current_step_id==present_step_id,OperatorLog.assignment_id == assignment.assignment_id ).first()
                completed_tasks={
                    # "Serial_No":pcb_serial_data.serialNo,
                    "step_id":present_step_id,
                    "step_name":task_detail.Task_Name,
                    "Task_start_time":task_detail.start_time,
                    "Task_completed_time":task_detail.end_time,
                    "step_Ope_staff_No":task_detail.operator_staff_no,
                    "step_status":task_detail.Task_Status
                
                }
                Completed_Tasks_Details.append(completed_tasks)
            next_pending_taks = db.query(OperatorStepMapping).filter(OperatorStepMapping.flow_step_id == next_step_id).all()
            staff_nos = []
            task_name=""
            if next_pending_taks:
                task_name  = db.query(ProcessFlowMaster).filter(ProcessFlowMaster.step_order==next_pending_taks[0].flow_step_id).first()
            for task in next_pending_taks:
                
                staff_nos.append(task.operator_staff_no)
            pending_tasks={
                "step_id":next_pending_taks[0].flow_step_id,
                "TaskName":task_name.step_name,
                "staff_No":staff_nos
            }
            Pending_Tasks_Details.append(pending_tasks)
            next_step_id=next_step_id+1
            
            x=x-1

        Data = {
            "Serial_No": pcb_serial_data.serialNo,
            "present_tasks" : present_Task_Details,
            "Completed_tasks": Completed_Tasks_Details,
            "Pending_tasks": Pending_Tasks_Details

        }
        result.append(Data)

    return result






# @app.get("/getmrllist")
# def getmrllist(staff_no: str, db: Session = Depends(init_db)):
#     print("i: ")
#     staff = normalize_staff(staff_no)
#     user = find_user_from_profiles(db, staff)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     mrl_list=db.query(UserProfile).filter((UserProfile.userRole == "Operator") | (UserProfile.userRole == "OPERATOR")).all()
#     result=[]
#     print("i: ")
#     for i in mrl_list: 
#         temp=db.query(OperatorStepMapping).filter(OperatorStepMapping.operator_staff_no == i.userID).first()
#         # print("temp initial: ",temp.length)
#         if (temp == None ):
#             continue
#         result.append({
#             "staff_no":i.userID,
#             "name":i.username,
#             "role":i.userRole,
#             "initial": temp.operator_initial if temp else None ,
#             "ope_mrl":temp.operator_MRL if temp else None,
#             "ope_exp":temp.operator_MRL_Expiry if temp else None
            
#         })
#     return result







from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
import pytz
import math

# Define Timezones
utc_zone = pytz.utc
ist_zone = pytz.timezone('Asia/Kolkata')

@app.get("/getmrllist")
def getmrllist(staff_no: str, db: Session = Depends(init_db)):
    # Validate requester
    staff = normalize_staff(staff_no)
    user = find_user_from_profiles(db, staff)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch operators
    # Using 'or_' for cleaner syntax on the role check
    mrl_list = db.query(UserProfile).filter(
        or_(UserProfile.userRole == "Operator", UserProfile.userRole == "OPERATOR")
    ).all()

    result = []

    for i in mrl_list:
        # Fetch the mapping for this specific user
        temp = db.query(OperatorStepMapping).filter(
            OperatorStepMapping.operator_staff_no == i.userID
        ).first()

        # --- FILTER 1: Skip if no mapping exists (Null record) ---
        if temp is None:
            continue

        # --- FILTER 2: Check for "NaN" or specific Null fields ---
        # We check the specific field you are concerned about (ope_exp)
        raw_exp = temp.operator_MRL_Expiry
        raw_mrl = temp.operator_MRL

        # Helper to check for "bad" data (None, string "nan", or float NaN)
        def is_bad_data(val):
            if val is None: return True
            if isinstance(val, str) and val.lower() == 'nan': return True
            if isinstance(val, float) and math.isnan(val): return True
            return False

        # If MRL or Expiry is bad/NaN, skip this record
        if is_bad_data(raw_exp) or is_bad_data(raw_mrl):
            continue
        mrl_date=temp.operator_MRL_Expiry.split('.')[0]
        result.append({
            "staff_no": i.userID,
            "name": i.username,
            "role": i.userRole,
            "initial": temp.operator_initial,
            "ope_mrl": raw_mrl,
            "ope_exp": datetime.strptime(mrl_date, "%m%y")
        })

    return result





@app.get("/completed_timeline")
def unified_timeline(SerialNo: str, db: Session = Depends(init_db)):
    if not SerialNo:
        raise HTTPException(status_code=400, detail="SerialNo is required")

    # 1. Fetch all PCB records (Child and Main) sharing this base serial number
    pcb_records = db.query(PcbData).filter(PcbData.serialNo == SerialNo).all()
    if not pcb_records:
        raise HTTPException(status_code=404, detail="Serial Number not found")

    # Extract the full primary keys (PCBserialNoPartNumber) for both records
    all_full_ids = [p.PCBserialNoPartNumber for p in pcb_records]

    # 2. Get Assignment details
    # We take the most recent assignment date to represent the current state
    assignment_details = db.query(PCBAssignment).filter(
        PCBAssignment.assigned_pcb_id.in_(all_full_ids)
    ).order_by(desc(PCBAssignment.assignment_date)).first()

    # 3. Fetch all Operator Logs for both Child and Main
    # Ordered by current_step_id to ensure Child steps (1-15) appear before Main steps (16+)
    ope_logs = db.query(OperatorLog).filter(
        OperatorLog.PCBserialNoPartNumber.in_(all_full_ids)
    ).order_by(OperatorLog.current_step_id.asc()).all()

    # 4. Calculate Durations as per original logic
    durations = []
    for log in ope_logs:
        if log.start_time and log.end_time:
            durations.append((log.end_time - log.start_time).total_seconds())
        else:
            durations.append(0)

    # 5. Assemble the response in the exact structure of the original /timeline
    # Using the first pcb_record for general header info
    primary_pcb = pcb_records[0]

    return {
        "Serial_No": primary_pcb.serialNo,
        "Part_Number": primary_pcb.partNumber,
        "Production_Order": primary_pcb.productionOrder,
        "Description": primary_pcb.description,
        "Type": "Unified (Child + Main)", 
        "New_Time": primary_pcb.createdAt,
        "Inaction_time": primary_pcb.updatedAt,
        "Assigned_time": assignment_details.assignment_date if assignment_details else None,
        "ope_log_details": ope_logs,
        "Durations": durations
    }



from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
import os
import shutil
from datetime import datetime

# Assuming your app router and db initialization are set up above this
UPLOAD_DIR = "Upload/NPTRM"

@app.post("/mrlrevalidationdocsupload")
async def upload_file(
    # Make it Optional to safely catch missing data without throwing a default 422 error
    operatorid: Optional[str] = Form(None), 
    file: UploadFile = File(...),
    db: Session = Depends(init_db)
):
    # 1. Catch JavaScript "null" or "undefined" strings and missing data
    if not operatorid or operatorid.lower() in ["null", "undefined"]:
        raise HTTPException(status_code=400, detail="A valid Operator ID is required.")

    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 2. Check if a file already exists for this slot
    existing_doc = db.query(MRLRevalidationDocs).filter(
        MRLRevalidationDocs.operatorid == operatorid
    ).first()

    action = "UPLOAD"

    # 3. If exists, delete it (Edit/Replace logic)
    if existing_doc:
        action = "REPLACE"
        # Make sure file_path exists before trying to check it
        if existing_doc.file_path and os.path.exists(existing_doc.file_path):
            try:
                os.remove(existing_doc.file_path)
            except OSError:
                pass
        db.delete(existing_doc)
        db.commit()

    # 4. Save New File
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    clean_filename = file.filename.replace(" ", "_")
    safe_filename = f"{timestamp}_{clean_filename}"
    
    # Ensure directory exists to prevent crash
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 5. Save Doc Metadata
    new_doc = MRLRevalidationDocs(
        operatorid=operatorid, # <-- FIX: You were missing this line!
        filename=safe_filename,
        original_filename=file.filename,
        file_path=file_path
    )
    db.add(new_doc)

    # 6. Add History Log
    log_entry = MRLRevalidationDocsLog(
        action_type=action,
        file_name=file.filename,
        # Make sure to link operatorid here too if your Log table requires it
        operatorid=operatorid 
    )
    db.add(log_entry)
    
    db.commit()
    db.refresh(new_doc)
    
    return new_doc




from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

# --- 1. DEFINE THE INCOMING DATA FORMAT ---
# Pydantic models validate the JSON data sent from your React frontend.
# This ensures that when React sends an update, it strictly contains a staff_no and ope_exp.
class UpdateMRLDateRequest(BaseModel):
    staff_no: str
    ope_exp: str  # This will be the "0228.0" string we generated in React

# --- 2. CREATE THE API ENDPOINT ---
@app.put("/updatemrldate")
def update_mrl_date(payload: UpdateMRLDateRequest, db: Session = Depends(init_db)):
    
    # STEP A: Find the specific operator's record in the database
    # We query the OperatorStepMapping table where the staff_no matches the one sent from React
    operator_mapping = db.query(OperatorStepMapping).filter(
        OperatorStepMapping.operator_staff_no == payload.staff_no
    ).all()
    # print("sucess")
    # STEP B: Error Handling
    # If the database comes back empty (None), tell the frontend the user doesn't exist
    if not operator_mapping:
        raise HTTPException(status_code=404, detail="Operator mapping not found for this staff number.")

    # STEP C: Update the record
    # Replace the old database expiry date with the new "+ 2 years" date (e.g., "0228.0")
    for i in operator_mapping:
        print("ope: ",i.operator_staff_no)
        i.operator_MRL_Expiry = payload.ope_exp
    # operator_mapping.operator_MRL_Expiry = payload.ope_exp

    # STEP D: Save the changes
    # try:
    #      db.commit()             # This officially saves the transaction to your SQL database
    #     #  db.refresh(operator_mapping)  # This reloads the object with the fresh DB data

    # except Exception as e:
    #     db.rollback()           # If something crashes during save, undo the changes to prevent corruption
    #     print(f"Database error: {e}")
    #     raise HTTPException(status_code=500, detail="Failed to save the new date to the database.")
    db.commit()

    return {
                "status": "success", 
                "message": f"MRL Expiry updated to {payload.ope_exp} for staff {payload.staff_no}"
    }






@app.get("/getequipment_consumables")
def getequipment_consumables(stageid: int, db: Session = Depends(init_db)):
    if not stageid:
        raise HTTPException(status_code=404, detail="stage id is empty")
    check_limit = db.query(ProcessFlowMaster).all()
    max_limit= len(check_limit)
    if stageid > max_limit:
        raise HTTPException(status_code=404, detail="stage Number is out of Range")
    if max_limit == 0:
        raise HTTPException(status_code=404, detail="Process Flow is missing")
    stage_check = db.query(ProcessFlowMaster, Equipments, Consumables).outerjoin(
        Equipments, Equipments.stage_id == ProcessFlowMaster.flow_step_id
    ).outerjoin(
        Consumables, Consumables.stage_id == ProcessFlowMaster.flow_step_id
    ).filter(
        or_(
            (ProcessFlowMaster.flow_step_id == stageid),
            (Equipments.stage_id == stageid),
            (Consumables.stage_id == stageid),
        )
    ).all()

    result = []
    equip_seen = set()  # To track equipment IDs
    consumable_seen = set()  # To track consumable material numbers
    is_euip_present = False
    is_consumable_present = False

    for i, j, k in stage_check:
        # Process Equipment
        if j:
            equipment_data = {
                "eqpt_no": j.eqpt_no,
                "eqpt_name": j.eqpt_name,
                "eqpt_make": j.eqpt_make,
                "eqpt_model": j.eqpt_model,
                "eqpt_due_date": j.eqpt_due_date,
            }
            if j.eqpt_no not in equip_seen:
                result.append(equipment_data)
                equip_seen.add(j.eqpt_no)
                is_euip_present = True  # Set to True when the first equipment is added

        # Process Consumables
        if k:
            consumable_data = {
                "consumable_material_number": k.consumable_material_number,
                "consumable_material_name": k.consumable_material_name,
                "consumable_gr_number": k.consumable_gr_number,
                "consumable_year": k.consumable_year,
                "consumable_shelf_life": k.consumable_shelf_life,
            }
            if k.consumable_material_number not in consumable_seen:
                result.append(consumable_data)
                consumable_seen.add(k.consumable_material_number)
                is_consumable_present = True  # Set to True when the first consumable is added

    # Add presence indicators *after* processing and deduplication
    result.append({"is_euip_present": is_euip_present})
    result.append({"is_consumable_present": is_consumable_present})

    return result










utc_zone = pytz.utc
ist_zone = pytz.timezone('Asia/Kolkata')

@app.get("/getactionrequiredmrl")
def getmrllist(staff_no: str, db: Session = Depends(init_db)):
    # Validate requester
    staff = normalize_staff(staff_no)
    user = find_user_from_profiles(db, staff)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch operators
    # Using 'or_' for cleaner syntax on the role check
    mrl_list = db.query(UserProfile).filter(
        or_(UserProfile.userRole == "Operator", UserProfile.userRole == "OPERATOR")
    ).all()

    result = []

    for i in mrl_list:
        # Fetch the mapping for this specific user
        temp = db.query(OperatorStepMapping).filter(
            OperatorStepMapping.operator_staff_no == i.userID
        ).first()

       

        # --- FILTER 1: Skip if no mapping exists (Null record) ---
        if temp is None:
            continue

        # --- FILTER 2: Check for "NaN" or specific Null fields ---
        # We check the specific field you are concerned about (ope_exp)
       
        raw_exp = temp.operator_MRL_Expiry
        # print("raw_exp: ",type(raw_exp),raw_exp)
        
        raw_mrl = temp.operator_MRL
        def is_bad_data(val):
            if val is None: return True
            if isinstance(val, str) and val.lower() == 'nan': return True
            if isinstance(val, float) and math.isnan(val): return True
            return False

        if is_bad_data(raw_exp) or is_bad_data(raw_mrl):
            continue
        temp1=datetime.strptime(raw_exp.split('.')[0], "%m%y") 
        print("raw_exp: ",type(temp1),temp1)
        today = datetime.now()
        if (temp1-today).days > 30:
            continue
        # difference = (datetime.strptime(raw_exp.split('.')[0], "%m%y") - datetime.now()).days()
        # print("difference: ",difference)

        # Helper to check for "bad" data (None, string "nan", or float NaN)
        

        # If MRL or Expiry is bad/NaN, skip this record

        process_name = temp.process_step.step_name if temp.process_step else "Unknown Process"
        
        mrl_date=temp.operator_MRL_Expiry.split('.')[0]
        result.append({
            "staff_no": i.userID,
            "name": i.username,
            "role": i.userRole,
            "initial": temp.operator_initial,
            "ope_mrl": raw_mrl,
            "process_name" : process_name,
            "ope_exp": datetime.strptime(mrl_date, "%m%y")
        })

    return result





# resource pplanner endpoints***********************


from pydantic import Field

class StageCapacityBase(BaseModel):
    name: str
    hours_per_shift: int = Field(0.0, ge=0)
    shifts_per_day: int = Field(0, ge=0)
    manufacturing_time_mins: float = Field(0.0, ge=0)

class StageCapacityCreate(StageCapacityBase):
    pass

class StageCapacityUpdate(BaseModel):
    hours_per_shift: Optional[float] = Field(None, ge=0)
    shifts_per_day: Optional[int] = Field(None, ge=0)
    manufacturing_time_mins: Optional[float] = Field(None, ge=0)

class StageCapacityRead(StageCapacityBase):
    id: int

    class Config:
        from_attributes = True  # Used in Pydantic v2 (replaces orm_mode=True)

# --- Monthly Demand Schemas ---
class MonthlyDemandBase(BaseModel):
    year: int
    month: str
    hexa_target: int = Field(0, ge=0)
    octa_target: int = Field(0, ge=0)

class MonthlyDemandCreate(MonthlyDemandBase):
    pass

class MonthlyDemandUpdate(BaseModel):
    hexa_target: Optional[int] = Field(None, ge=0)
    octa_target: Optional[int] = Field(None, ge=0)

class MonthlyDemandRead(MonthlyDemandBase):
    id: int

    class Config:
        from_attributes = True


        

@app.get("/stages/", response_model=List[StageCapacityRead])
def get_all_stages(db: Session = Depends(init_db)):
    """Fetch all machine stages and their capacities."""
    return db.query(StageCapacityDB).all()

@app.post("/stages/", response_model=StageCapacityRead)
def create_stage(stage: StageCapacityCreate, db: Session = Depends(init_db)):
    """Add a new manufacturing stage."""
    # Check if stage already exists
    existing_stage = db.query(StageCapacityDB).filter(StageCapacityDB.name == stage.name).first()
    if existing_stage:
        raise HTTPException(status_code=400, detail="Stage already exists")
    
    new_stage = StageCapacityDB(**stage.dict())
    db.add(new_stage)
    db.commit()
    db.refresh(new_stage)
    return new_stage

@app.put("/stages/{stage_id}", response_model=StageCapacityRead)
def update_stage(stage_id: int, stage_update: StageCapacityUpdate, db: Session = Depends(init_db)):
    """Update existing capacities for a specific stage."""
    db_stage = db.query(StageCapacityDB).filter(StageCapacityDB.id == stage_id).first()
    if not db_stage:
        raise HTTPException(status_code=404, detail="Stage not found")
    
    update_data = stage_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_stage, key, value)
        
    db.commit()
    db.refresh(db_stage)
    return db_stage

# --- Monthly Demand Endpoiasdfasdnts ---

@app.get("/demands/")
def get_demands(year: Optional[int] = None, db: Session = Depends(init_db)):
    
    """Fetch monthly demands. Optionally filter by year (e.g., /demands/?year=2026)."""
    query = db.query(MonthlyDemandDB)
    if year:
        query = query.filter(MonthlyDemandDB.year == year)
    return query.all()

@app.post("/demands/")
def create_demand(demand:dict, db: Session = Depends(init_db)):
    """Add target units for a specific month and year."""
    # Prevent duplicate month/year entries
    print("at frust: ",demand," tyep: ",type(demand))
    existing_demand = db.query(MonthlyDemandDB).filter(
        MonthlyDemandDB.year == demand.get("year"), 
        MonthlyDemandDB.month == demand.get("month")
    ).first()
    
    if existing_demand:
        raise HTTPException(status_code=400, detail=f"Demand for {demand.month} {demand.year} already exists")

    new_demand = MonthlyDemandDB(updated_time= datetime.now(),**demand)
    print("new deman: ",type(new_demand))
    db.add(new_demand)
    db.commit()
    db.refresh(new_demand)
    return new_demand

@app.put("/demands/{demand_id}")
def update_demand(demand_id: int, demand_update: MonthlyDemandUpdate, db: Session = Depends(init_db)):
    """Update the target units for an existing month/year."""
    db_demand = db.query(MonthlyDemandDB).filter(MonthlyDemandDB.id == demand_id).first()
    if not db_demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    
    update_data = demand_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_demand, key, value)
        
    db.commit()
    db.refresh(db_demand)
    return db_demand



    # ****************************************************



@app.get("/")
def test(db: Session = Depends(init_db)):
    return "success"

UPLOAD_DIR = "uploads"
# File: Data_Server.py
from typing import Optional

@app.post("/operator/upload_manual_file")
async def upload_manual_file(
    pcb_serial: str = Form(...),
    stage_id: str = Form(...),
    status: str = Form(...), # Add status to update the DB
    log_data: str = Form(...),
    file: Optional[UploadFile] = File(None) # Change this to None to make it optional
):
    # Only process the file if it actually exists
    if file:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        folder = os.path.join(UPLOAD_DIR, f"stage_{stage_id}")
        os.makedirs(folder, exist_ok=True)
        file_path = os.path.join(folder, f"{pcb_serial}_{file.filename}")
        
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
            
    # Always update the Database status here, even if there is no file
    # update_db_logic(pcb_serial, stage_id, status, log_data)
    
    return {"message": "Task processed successfully", "file_included": bool(file)}



"""
quality manager endpoints regarding dashbaords and all!
"""
@app.get("/getmrldetails_dashboard")
def getmrldetaisl_dashboard(db: Session = Depends(init_db)):
    # Fetch all operators
    userprofiles = db.query(UserProfile).filter(func.upper(func.trim(UserProfile.userRole)) == "OPERATOR").all()
    
    if not userprofiles:
        raise HTTPException(status_code=404, detail="Userprofile table is empty")

    result = []
    for i in userprofiles:
        # Fetch all mappings for this specific user
        mrl_records = db.query(OperatorStepMapping).filter(
            func.upper(func.trim(OperatorStepMapping.operator_staff_no)) == i.userID.upper().strip()
        ).all()
        if len(mrl_records) == 0:
            continue
        # Build the list: [{"id": 1, "name": "Printer", "mrl": "MRL-6", "exp": "0127"}]
        mrl_list = []
        for record in mrl_records:
            if record.operator_MRL and record.operator_MRL_Expiry:
                # Clean expiry string
                expiry_clean = record.operator_MRL_Expiry.split('.')[0]
                
                # Get stage name from the relationship
                stage_name = record.process_step.step_name if record.process_step else "Unknown"
                stage_id = record.process_step.step_order if record.process_step else record.flow_step_id

                mrl_list.append({
                    "stage_id": stage_id,
                    "stage_name": stage_name,
                    "mrl": record.operator_MRL,
                    "exp": expiry_clean
                })

        result.append({
            "staff_no": i.userID,
            "staff_name": i.username,
            "mrls": mrl_list
        })

    return result




@app.post("/machine/telemetry")
def receive_machine_telemetry(data: dict):

    print("\nMachine Telemetry Received from Simulator")
    print(data)

    return {"status": "received"}
