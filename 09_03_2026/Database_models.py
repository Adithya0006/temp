
from sqlalchemy import Column,Integer,String,Float,DateTime,ForeignKey,Date,LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import date, datetime

from sqlalchemy import (
    create_engine, Column, Integer, String, ForeignKey,JSON, and_,
    select, DateTime, func, or_,Identity
)
base  = declarative_base()

class UserProfile(base):
    __tablename__ = "userProfiles"
    userID = Column(String, primary_key=True)
    username = Column(String)
    userRole = Column(String)
    admin = Column(String)
    sbu = Column(String)
    subdivision = Column(String)
    description = Column(String)
    company = Column(String)
    password = Column(String)
    createdAt = Column(DateTime(timezone=True))
    updatedAt = Column(DateTime(timezone=True))

class QRRecord_db(base):
    __tablename__ = "qr_records"
    Timestamp = Column(DateTime)
    SL_No = Column(Integer, autoincrement=True) 
    BEL_Part_Number = Column(String)
    MPN= Column(String)
    Batch_Lot_No= Column(String)
    DateCode= Column(String)
    Quantity= Column(String)
    BEL_PO_No= Column(String)
    Vendor_Name= Column(String)
    OEM_Make= Column(String)
    Manufacturing_Place= Column(String)
    GR_No= Column(String)
    GR_Date= Column(DateTime)
    Reference_No= Column(String, primary_key = True, index=True)
    Description = Column(String)
    Vendor_Code = Column(String)
    Invoice_No  = Column(String)
    Invoice_Dt = Column(DateTime)

    

class LogBook_db(base):
    __tablename__ = "log_book"
    
    SL_No = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Timestamp = Column(DateTime )
    BEL_Part_Number = Column(String )
    MPN = Column(String )
    Batch_Lot_No = Column(String )
    DateCode = Column(String )
    Quantity = Column(String )
    BEL_PO_No = Column(String )
    Vendor_Name = Column(String )
    OEM_Make = Column(String )
    Manufacturing_Place = Column(String )

class QRRecord_Generated(base):
    __tablename__ = "generated_qr_records"

    inspection_type = Column(String, nullable=True)

    Timestamp = Column(DateTime)
    SL_No = Column(Integer) 
    BEL_Part_Number = Column(String)
    MPN= Column(String)
    Batch_Lot_No= Column(String)
    DateCode= Column(String)
    Quantity= Column(String)
    BEL_PO_No= Column(String)
    Vendor_Name= Column(String)
    OEM_Make= Column(String)
    Manufacturing_Place= Column(String)
    GR_No= Column(String)
    GR_Date= Column(DateTime)
    Reference_No= Column(String, primary_key = True, index=True)
    Description = Column(String)
    Vendor_Code = Column(String)
    Invoice_No  = Column(String)
    Invoice_Dt = Column(DateTime)
    Status = Column(String)
    overall_status = Column(String,default="Generated")

    userID = Column(String)
    userName = Column(String)
    userRole = Column(String)
    userSBU = Column(String)
    userSBUDIV = Column(String)

    subcontracts = relationship("SubContract_Inspection", back_populates="qr_record", cascade="all, delete-orphan")
    dimensions = relationship("DimensionReport", back_populates="qr_record",cascade="all, delete-orphan")
    dimension_common_reports = relationship("DimensionCommonReport", back_populates="reference", cascade="all, delete-orphan")
    intender_report = relationship("Intender_Report", back_populates="qr_record",cascade="all, delete-orphan")
    Submission_Details = relationship("Authorized_Person", back_populates="qr_record",cascade="all, delete-orphan")
    instrument = relationship("Measuring_Instruments_Used", back_populates="qr_record",cascade="all, delete-orphan")

    
class DimensionInstrumentMap(base):
    __tablename__ = "dimension_instrument_map"

    Id = Column(Integer, primary_key=True, index=True)

    Report_Id = Column(Integer, ForeignKey("dimension_reports.Id"))
    Instrument_Id = Column(Integer, ForeignKey("measuring_instruments.Equipment_ID"))

    # Relationships
    report = relationship("DimensionReport", back_populates="instrument_links")
    instrument = relationship("Measuring_Instruments", back_populates="report_links")

class Measuring_Instruments(base):
    __tablename__ = "measuring_instruments"

    Description = Column(String)
    Equipment_ID = Column(Integer, primary_key=True, index=True)
    Measuring_Accuracy = Column(Float)
    Make_Model = Column(String)
    Cal_Date = Column(DateTime)
    Due_Date = Column(DateTime)

    report_links = relationship(
        "DimensionInstrumentMap",
        back_populates="instrument",
        cascade="all, delete-orphan"
    )
    instruments = relationship(
        "Measuring_Instruments_Used",
        back_populates="instrument_used",
        cascade="all, delete-orphan"
    )

class SubContract_Inspection(base):
    __tablename__ = "subcontract_inspection"

    SAN_NO = Column(Integer, primary_key=True, index=True)
    Control_No = Column(Integer)

    # Basic details (common in both tables)
    Part_No = Column(String)
    Description = Column(String)
    PO_NO = Column(String)
    Vendor_Name = Column(String)
    Quantity = Column(String)
    Sample = Column(String)
    Sale_Order = Column(String)
    Drg_Issue_Level = Column(Integer)

    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    Date = Column(Date, default=date.today)

    userID = Column(String)
    userName = Column(String)
    userRole = Column(String)
    userSBU = Column(String)
    userSBUDIV = Column(String)

    # Report section (only in second table)
    Vendor_Dimension_Report = Column(String, nullable=True)
    Visual_Inspection = Column(String, nullable=True)
    Raw_Material_Supplied = Column(String, nullable=True)
    Raw_Material_Test_Report = Column(String, nullable=True)
    # Relationship
    qr_record = relationship("QRRecord_Generated", back_populates="subcontracts")

# class Dimension_Report(base):
#     __tablename__ = "dimension_report"
#     id = Column(Integer,primary_key=True,index=True)
#     Basic_Dimension = Column(Float)
#     Measuring_Instr_Id = Column(Integer, ForeignKey("measuring_instruments.Id"))
#     Tolerance = Column(Float)
#     Min = Column(Float)
#     Max = Column(Float)
#     Sample_1 = Column(Float,nullable=True)
#     Sample_2 = Column(Float,nullable=True)
#     Sample_3 = Column(Float,nullable=True)
#     Sample_4 = Column(Float,nullable=True)
#     Sample_5 = Column(Float,nullable=True)
#     Sample_6= Column(Float,nullable=True)
#     Sample_7 = Column(Float,nullable=True)
#     Sample_8 = Column(Float,nullable=True)
#     Sample_9 = Column(Float,nullable=True)
#     Sample_10 = Column(Float,nullable=True)
#     Sample_11 = Column(Float,nullable=True)
#     Sample_12 = Column(Float,nullable=True)
#     Sample_13 = Column(Float,nullable=True)
#     Sample_14 = Column(Float,nullable=True)
#     Sample_15 = Column(Float,nullable=True)

#     Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
#     qr_record = relationship("QRRecord_Generated", back_populates="dimensions")
#     measurement = relationship("Measuring_Instruments", back_populates="dimension")



class DimensionType(base):
    __tablename__ = "dimension_types"

    Id = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)

    reports = relationship("DimensionReport", back_populates="dimension_type")
    

# -------------------------------
# 2. Dimension Report (Per Dimension Per Reference_No)
# -------------------------------
class DimensionReport(base):
    __tablename__ = "dimension_reports"

    Id = Column(Integer, primary_key=True, index=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    Dimension_Type_Id = Column(Integer, ForeignKey("dimension_types.Id"))

    Basic_Dimension = Column(Float)
    Tolerance = Column(Float)
    Min = Column(Float)
    Max = Column(Float)
    dimension_type = relationship("DimensionType", back_populates="reports")
    qr_record = relationship("QRRecord_Generated", back_populates="dimensions")

    samples = relationship("DimensionSample", back_populates="report",
                           cascade="all, delete-orphan")
    instrument_links = relationship(
        "DimensionInstrumentMap",
        back_populates="report",
        cascade="all, delete-orphan"
    )

    
# -------------------------------
# 3. Dimension Samples (Values Entered by User)
# -------------------------------
class DimensionSample(base):
    __tablename__ = "dimension_samples"

    Id = Column(Integer, primary_key=True, index=True)
    Report_Id = Column(Integer, ForeignKey("dimension_reports.Id"))
    Sample_No = Column(Integer)  # 1 to 15
    Value = Column(Float)
    Status = Column(String)  # OK / NOT OK
    Remarks = Column(String,nullable=True)
    Dimension_View_Parameter = Column(String,nullable=True)
    Dimension_Parameter_Unit = Column(String)
    
    report = relationship("DimensionReport", back_populates="samples")


class DimensionCommonReport(base):
    __tablename__ = "dimension_common_report"

    Id = Column(Integer, primary_key=True, index=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))


    
    Remarks = Column(String, nullable=True)
    Marking_On_Material = Column(String, nullable=True)
    Dimension_Remark = Column(String, nullable=True)
    Visual_Inspection_Report = Column(String, nullable=True)
    Electrical_Inspection_Remark = Column(String, nullable=True)
    Electrical_Parameter = Column(String, nullable=True)
    Functional = Column(String, nullable=True)
    Dimensions = Column(String, nullable=True)
    Visual_Inspection = Column(String, nullable=True)
    COC = Column(String, nullable=True)
    Test_Reports = Column(String, nullable=True)
    Imported_Doc_Received = Column(String, nullable=True)
    Malware_Free_Cert = Column(String, nullable=True)
    FOD_Check = Column(String, nullable=True)
    Counterfeit_Checked = Column(String, nullable=True)
    MFG_Date = Column(Date, nullable=True)
    Exp_Date = Column(Date, nullable=True)
    Qty_Received = Column(String, nullable=True)
    Qty_Inspected = Column(String, nullable=True)
    Qty_Accepted = Column(String, nullable=True)
    Qty_Rejected = Column(String, nullable=True)
    Inspection_Remarks = Column(String, nullable=True)

    userID = Column(String)
    userName = Column(String)
    userRole = Column(String)
    userSBU = Column(String)
    userSBUDIV = Column(String)

    # Links all DimensionReports for this reference
    reference = relationship("QRRecord_Generated", back_populates="dimension_common_reports")


class Intender_Report(base):
    __tablename__ = "intender_report"

    Id = Column(Integer, primary_key=True, index=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    Project_SaleOrder = Column(String)  # 1 to 15
    Result = Column(String)
    Serial_Numbers = Column(String)  # OK / NOT OK
    Remarks = Column(String)
    Date = Column(Date)
    Status = Column(String)

    userID = Column(String)
    userName = Column(String)
    userRole = Column(String)
    userSBU = Column(String)
    userSBUDIV = Column(String)
    
    qr_record = relationship("QRRecord_Generated", back_populates="intender_report")



class Authorized_Person(base):
    __tablename__ = 'user_data'
    
    id = Column(Integer, primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"),nullable=False)

    insUserID = Column(String,nullable=False)
    insUserName = Column(String) 
    insUserRole = Column(String)
    insUserSBU = Column(String)
    insUserSBUDIV = Column(String)
    insDate = Column(Date,default=date.today)

    insfilename = Column(String)
    insmimetype = Column(String)
    insdata = Column(LargeBinary)

    insRemarks = Column(String)

    appUserID = Column(String,nullable=True)
    appUserName = Column(String,nullable=True)
    appUserRole = Column(String,nullable=True)
    appUserSBU = Column(String,nullable=True)
    appUserSBUDIV = Column(String,nullable=True)

    appfilename = Column(String,nullable=True)
    appmimetype = Column(String,nullable=True)
    appdata = Column(LargeBinary,nullable=True)

    appDate = Column(Date,nullable=True)
    appRemarks = Column(String,nullable=True)


    # Staff_No = Column(Integer) #userID
    # Name = Column(String)
    # Role = Column(String)
    # Date = Column(Date,default=date.today)


    qr_record = relationship("QRRecord_Generated", back_populates="Submission_Details")


# class Authorized_Person(base):
#     __tablename__ = 'user_data'
    
#     id = Column(Integer, primary_key=True)
#     Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"), nullable=False)

#     insUserID = Column(String, nullable=False)
#     insUserName = Column(String) 
#     insUserRole = Column(String)
#     insUserSBU = Column(String)
#     insUserSBUDIV = Column(String)
#     insDate = Column(Date, default=date.today)
#     insfilename = Column(String)
#     insmimetype = Column(String)
#     insdata = Column(LargeBinary)
#     insRemarks = Column(String)

#     appUserID = Column(String, nullable=True)
#     appUserName = Column(String, nullable=True)
#     appUserRole = Column(String, nullable=True)
#     appUserSBU = Column(String, nullable=True)
#     appUserSBUDIV = Column(String, nullable=True)

#     appfilename = Column(String, nullable=True)
#     appmimetype = Column(String, nullable=True)
#     appdata = Column(LargeBinary, nullable=True)

#     appDate = Column(Date, nullable=True) 
#     appRemarks = Column(String, nullable=True)
    




class Measuring_Instruments_Used(base):
    __tablename__ = "measuring_instrument_used"

    id = Column(Integer,primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    Equipment_ID = Column(Integer, ForeignKey("measuring_instruments.Equipment_ID"))

    qr_record = relationship("QRRecord_Generated", back_populates="instrument")
    instrument_used = relationship(
        "Measuring_Instruments",
        back_populates="instruments"
    )

class Indenter(base):
    __tablename__ = "indenter_table"

    indId = Column(Integer, primary_key=True)
    userID = Column(String, ForeignKey("userProfiles.userID"))
    # indUserID = Column(String)
    # indUserName = Column(String)
    # indUserRole = Column(String)
    # indUserSBU = Column(String)
    # indUserSBUDIV = Column(String)
    # indPhoneNo = Column(String)
    # date = Column(Date)
    user = relationship("UserProfile")

class IndenterApproval(base):
    __tablename__ = "indenter_approval_details"

    id = Column(Integer, primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    serialNo = Column(String)

    indUserID = Column(String)
    indUserName = Column(String)
    indUserRole = Column(String, default="Indentor")
    indUserSBU = Column(String)
    indUserSBUDIV = Column(String)
    indPhoneNo = Column(String)
    date = Column(Date)
    
    insUserID = Column(String)
    insUserName = Column(String)
    insUserRole = Column(String)
    insUserSBU = Column(String)
    insUserSBUDIV = Column(String)

    Status = Column(String)



class MaterialInspection(base):
    __tablename__ = "material_inspection"

    id = Column(Integer, primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))

    Batch_Lot_No = Column(String)
    Description = Column(String)
    Revision_Level = Column(String)
    Valuation_Type = Column(String)
    Storage_Location = Column(String)
    SO_Number = Column(String)
    Project = Column(String)
    Plant = Column(String)
    PO_Number = Column(String)
    GR_Number = Column(String)
    GR_Date = Column(String)
    Vendor_Name = Column(String)
    Ins_start_date = Column(Date,nullable=True)
    Ins_end_date = Column(Date,nullable=True)
    Test_eq_text = Column(String)
    Ins_Lot_Status = Column(String)

            # Control_No=next_control,
            # SAN_NO=next_san,
            # Part_No=qr.BEL_Part_Number,
            # Description=qr.Description,
            # PO_NO=qr.BEL_PO_No, - present
            # Vendor_Name=qr.Vendor_Name,- present
            # Quantity=qr.Quantity,
            # Sample="5 Nos",
            # Sale_Order="SO-1234", - present
            # Drg_Issue_Level=1, 
            # Reference_No=qr.Reference_No, - present
            # Date=date.today() - present
    
    insUserID = Column(String)
    insUserName = Column(String)
    insUserRole = Column(String)
    insUserSBU = Column(String)
    insUserSBUDIV = Column(String)

class MaterialTables(base):
    __tablename__ = "material_table"

    id = Column(Integer,primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))
    
    Type = Column(String)
    MIC_No = Column(Integer, nullable=True)	
    MIC	= Column(String, nullable=True)
    MIC_Desc = Column(String, nullable=True)
    Sampling_Procedure = Column(String, nullable=True)
    Sampling_Qty = Column(String, nullable=True)	
    Inspected_Qty = Column(String, nullable=True)
    UoM	= Column(String, nullable=True)
    TargetValue	= Column(String, nullable=True)
    LowerLimit = Column(String, nullable=True)
    UpperLimit	= Column(String, nullable=True)
    SampleNo = Column(Integer, nullable=True)	
    Result = Column(String, nullable=True)
    Valuation = Column(String, nullable=True)
    InspDate = Column(Date, nullable=True)
    Remarks = Column(String, nullable=True)


class MaterialSummary(base):
    __tablename__ = "materialsummary"

    id = Column(Integer,primary_key=True)
    Reference_No = Column(String, ForeignKey("generated_qr_records.Reference_No"))

    qty_blocked = Column(Integer, nullable=True)
    qty_returned = Column(Integer, nullable=True)
    UD_Code =Column(String, nullable=True)
    storage = Column(String, nullable=True)
    







# {
#   "Reference_No": "REF001",
#   "Samples": [
#     {
#       "Report_Id": 10,
#       "Dimension": "Height",
#       "Samples": [
#          {"Sample_No":1, "Value": 10.02},
#          {"Sample_No":2, "Value": 10.00},
#          ...
#          {"Sample_No":15, "Value": 9.99}
#       ]
#     },
#     {
#       "Report_Id": 11,
#       "Dimension": "Width",
#       "Samples": [
#          {"Sample_No":1, "Value": 20.01},
#          ...
#       ]
#     }
#   ]
# }



# {
#   "Reference_No": "REF001",

#   "Common": {
#      "Dimension_Parameter": "Mechanical Size",
#      "Unit": "mm",
#      "Remarks": "Overall good",
#      "Marking_On_Material": "Laser-etched",
#      "Visual_Inspection": "OK",
#      "COC": "Provided",
#      "Test_Reports": "Available",
#      "Qty_Received": "100",
#      "Qty_Inspected": "15",
#      "Qty_Accepted": "15",
#      "Inspection_Remarks": "All good"
#   },

#   "Dimensions": [
#     {
#       "Report_Id": 10,
#       "Dimension_Name": "Height",
#       "Basic_Dimension": 50.0,
#       "Tolerance": 0.5,
#       "Min": 49.5,
#       "Max": 50.5,
#       "Samples": [
#         {"Sample_No": 1, "Value": 50.02, "Status": "OK"},
#         {"Sample_No": 2, "Value": 49.98, "Status": "OK"},
#         {"Sample_No": 3, "Value": 49.30, "Status": "NOT OK"}
#       ]
#     },

#     {
#       "Report_Id": 11,
#       "Dimension_Name": "Width",
#       "Basic_Dimension": 30.0,
#       "Tolerance": 0.2,
#       "Min": 29.8,
#       "Max": 30.2,
#       "Samples": [
#         {"Sample_No": 1, "Value": 30.00, "Status": "OK"},
#         {"Sample_No": 2, "Value": 30.10, "Status": "OK"}
#       ]
#     }
#   ]
# }







#######################################   NPTRM  ###############################################


class PcbData(base):
    __tablename__ = "PcbData"
    ID = Column(Integer, Identity(start=1, increment=1), index=True)
    PCBserialNoPartNumber = Column(String, primary_key=True, index=True)

    serialNo = Column(String, index=True)
    partNumber = Column(String, index=True)

    productionOrder = Column(String)
    status = Column(String, default="New")
    quantity = Column(Integer, default=1)
    description = Column(String)

    userID = Column(String)
    userName = Column(String)
    userRole = Column(String)
    userSBU = Column(String)
    userSBUDIV = Column(String)
    Type = Column(String)

    createdAt = Column(DateTime(timezone=False), nullable=True)
    updatedAt = Column(DateTime(timezone=False), nullable=True)


class ProcessFlowMaster(base):
    __tablename__ = "process_flow_master"

    flow_step_id = Column(Integer, primary_key=True, autoincrement=True)
    step_order = Column(Integer, index=True)
    step_name = Column(String, unique=True)
    assignedToNameMRL = Column(String)
    assignedToNameMRLExpiry = Column(String)
    next_step_id = Column(Integer)

    qualified_operators = relationship("OperatorStepMapping", back_populates="process_step")
    equipment_to_stages = relationship("Equipments",back_populates="equipment_to_stage")
    consumable_to_stages = relationship("Consumables",back_populates="consumable_to_stage")

class OperatorStepMapping(base):
    __tablename__ = "operator_step_mapping"
    step_map_id = Column(Integer, primary_key=True, autoincrement=True)
    flow_step_id = Column(Integer, ForeignKey("process_flow_master.flow_step_id"))
    operator_staff_no = Column(String)
    operator_name = Column(String)
    operator_initial = Column(String)
    operator_MRL = Column(String)
    operator_MRL_Expiry= Column(String)
    process_step = relationship("ProcessFlowMaster", back_populates="qualified_operators")


class PCBAssignment(base):
    __tablename__ = "pcb_assignment"
    assignment_id = Column(Integer, primary_key=True, autoincrement=True)
    supervisor_staff_no = Column(String)
    assigned_pcb_id = Column(String)
    assignment_date = Column(String, default=lambda: datetime.utcnow().isoformat())
    overall_status = Column(String, default="IN_PROGRESS")

    # ⭐ NEW COLUMN (already exists in DB)
    current_step_id = Column(Integer)


class PCBProcessLog(base):
    __tablename__ = "pcb_process_log"
    log_id = Column(Integer, primary_key=True, autoincrement=True)
    assignment_id = Column(Integer)
    flow_step_id = Column(Integer)
    assigned_operator_staff_no = Column(String)
    process_status = Column(String, default="PENDING")
    start_time = Column(String)
    end_time = Column(String)


class OperatorLog(base):
    __tablename__="operator_log"
    PCBserialNoPartNumber = Column(String,primary_key=True,index=True)
    current_step_id = Column(Integer,primary_key=True,index=True)
    assignment_id = Column(Integer)
    Task_Status = Column(String)
    Task_Name = Column(String)
    operator_staff_no = Column(String)
    log_Data = Column(JSON)
    userID = Column(String)
    operator_name = Column(String)
    operator_initial = Column(String)
    operator_MRL = Column(String)
    operator_MRL_Expiry= Column(String)
    userRole = Column(String)
    userName = Column(String)
    userSBU = Column(String)
    userSBUDiv = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    manual_file_data = Column(LargeBinary, nullable=True) # Stores the actual file
    manual_filename = Column(String, nullable=True)     # Stores the name
    file_mimetype = Column(String, nullable=True)        # For previewing



class Equipments(base):
    __tablename__="equipment_details"
    id = Column(Integer,primary_key=True)
    stage_id = Column(Integer, ForeignKey("process_flow_master.flow_step_id"))
    eqpt_no = Column(String)
    eqpt_name = Column(String)
    eqpt_make = Column(String)
    eqpt_model = Column(String)
    eqpt_due_date = Column(Date)
    equipment_to_stage = relationship("ProcessFlowMaster", back_populates="equipment_to_stages")

class Consumables(base):
    __tablename__="consumables"
    id = Column(Integer,primary_key=True)
    stage_id = Column(Integer, ForeignKey("process_flow_master.flow_step_id"))
    consumable_material_number = Column(String)
    consumable_material_name = Column(String)
    consumable_gr_number = Column(String)
    consumable_year = Column(Date)
    consumable_shelf_life = Column(Date)

    consumable_to_stage = relationship("ProcessFlowMaster", back_populates="consumable_to_stages")





class MRLRevalidationDocs(base):
    __tablename__ = "mrl_revalidation_docs"

    operatorid = Column(String, primary_key=True, index=True)
    # Reference_No = Column(String, primary_key=True)

    # document_requirement = Column(String) 
    filename = Column(String)          # Physical filename on disk
    original_filename = Column(String) # Display filename
    file_path = Column(String)
    upload_date = Column(DateTime, default=datetime.now)

    # operators = relationship("MRLRevalidationDocsLog", back_populates="process_step")



class MRLRevalidationDocsLog(base):
    __tablename__ = "mrl_revalidation_docs_logs"

    id = Column(Integer, primary_key=True, index=True)
    operatorid = Column(String, ForeignKey("mrl_revalidation_docs.operatorid"))
    action_type = Column(String)       # "UPLOAD", "DELETE", "REPLACE"
    # document_name = Column(String)
    file_name = Column(String)
    timestamp = Column(DateTime, default=datetime.now)    

    # process_step = relationship("MRLRevalidationDocs", back_populates="operators")
