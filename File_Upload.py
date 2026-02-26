# import os
# import shutil
# from datetime import datetime
# from typing import List

# from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from sqlalchemy import Column, Integer, String, DateTime
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import Session

# # --- IMPORTS FROM YOUR DATABASE.PY ---
# # We rename 'session' to 'SessionLocal' to follow standard FastAPI naming conventions
# from Database import engine, session as SessionLocal

# # --- Configuration ---
# UPLOAD_DIR = "uploads"

# # Create Upload Directory if it doesn't exist
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # --- Database Model Setup ---
# Base = declarative_base()

# class FabricationDoc(Base):
#     __tablename__ = "fabrication_docs"

#     id = Column(Integer, primary_key=True, index=True)
#     section_key = Column(String)       # "A" or "B"
#     row_id = Column(Integer)           # 1, 2, 3...
#     document_requirement = Column(String) 
#     filename = Column(String)          # Physical filename on disk (unique)
#     original_filename = Column(String) # Display filename (user friendly)
#     file_path = Column(String)
#     upload_date = Column(DateTime, default=datetime.now)

# # Create Tables in PostgreSQL (if they don't exist)
# Base.metadata.create_all(bind=engine)

# # --- FastAPI App ---
# app = FastAPI(title="Fabrication Components API")

# # Enable CORS (Allows your React app to talk to this API)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Change this to ["http://localhost:3000"] in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- Dependency ---
# def get_db():
#     """
#     Creates a new database session for each request 
#     using the configuration from Database.py
#     """
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # --- Endpoints ---

# @app.get("/api/files")
# def get_all_files(db: Session = Depends(get_db)):
#     """Fetch all files to populate the dashboard."""
#     return db.query(FabricationDoc).all()

# @app.post("/api/upload")
# async def upload_file(
#     section_key: str = Form(...),
#     row_id: int = Form(...),
#     document_name: str = Form(...),
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     """
#     Handles PDF upload.
#     1. Checks if a file exists for this slot in Postgres.
#     2. Deletes old file from disk/DB if found.
#     3. Saves new file and updates Postgres.
#     """
#     if not file.filename.lower().endswith('.pdf'):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

#     # 1. Check if a file already exists for this Section + Row
#     existing_doc = db.query(FabricationDoc).filter(
#         FabricationDoc.section_key == section_key,
#         FabricationDoc.row_id == row_id
#     ).first()

#     # 2. If exists, delete old file from disk and DB
#     if existing_doc:
#         # Delete from disk
#         if os.path.exists(existing_doc.file_path):
#             try:
#                 os.remove(existing_doc.file_path)
#             except OSError:
#                 print(f"Warning: Could not delete old file at {existing_doc.file_path}")
#         # Delete from DB
#         db.delete(existing_doc)
#         db.commit()

#     # 3. Generate Unique Filename: {Section}_{RowID}_{Timestamp}_{OriginalName}
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     # Sanitize filename to prevent spaces/issues
#     clean_filename = file.filename.replace(" ", "_")
#     safe_filename = f"{section_key}${row_id}${clean_filename}"
#     file_path = os.path.join(UPLOAD_DIR, safe_filename)

#     # 4. Save new file to disk
#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # 5. Save metadata to PostgreSQL
#     new_doc = FabricationDoc(
#         section_key=section_key,
#         row_id=row_id,
#         document_requirement=document_name,
#         filename=safe_filename,
#         original_filename=file.filename,
#         file_path=file_path
#     )
#     db.add(new_doc)
#     db.commit()
#     db.refresh(new_doc)

#     return new_doc

# @app.get("/api/view/{file_id}")
# def view_file(file_id: int, db: Session = Depends(get_db)):
#     """Stream file for browser viewing."""
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc or not os.path.exists(doc.file_path):
#         raise HTTPException(status_code=404, detail="File not found")
    
#     return FileResponse(
#         doc.file_path, 
#         media_type="application/pdf", 
#         filename=doc.original_filename
#     )

# @app.get("/api/download/{file_id}")
# def download_file(file_id: int, db: Session = Depends(get_db)):
#     """Force file download."""
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc or not os.path.exists(doc.file_path):
#         raise HTTPException(status_code=404, detail="File not found")

#     return FileResponse(
#         doc.file_path, 
#         media_type="application/pdf", 
#         filename=doc.original_filename,
#         headers={"Content-Disposition": f"attachment; filename={doc.original_filename}"}
#     )

# @app.delete("/api/delete/{file_id}")
# def delete_file(file_id: int, db: Session = Depends(get_db)):
#     """Delete file from DB and Disk."""
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="File not found")

#     # Remove from disk
#     if os.path.exists(doc.file_path):
#         try:
#             os.remove(doc.file_path)
#         except OSError:
#             print(f"Warning: Could not delete file at {doc.file_path}")

#     # Remove from DB
#     db.delete(doc)
#     db.commit()
    
#     return {"message": "Deleted successfully"}

# if __name__ == "__main__":
#     import uvicorn
#     # Make sure to run on the host and port that matches your React API calls
#     uvicorn.run(app, host="0.0.0.0", port=8000)




# import os
# import shutil
# from datetime import datetime
# from typing import List

# from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
# from sqlalchemy import Column, Integer, String, DateTime, desc
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import Session

# # --- IMPORTS FROM YOUR DATABASE.PY ---
# from Database import engine, session as SessionLocal

# # --- Configuration ---
# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # --- Database Models ---
# Base = declarative_base()

# class FabricationDoc(Base):
#     __tablename__ = "fabrication_docs"

#     id = Column(Integer, primary_key=True, index=True)
#     section_key = Column(String)       
#     row_id = Column(Integer)           
#     document_requirement = Column(String) 
#     filename = Column(String)          
#     original_filename = Column(String) 
#     file_path = Column(String)
#     upload_date = Column(DateTime, default=datetime.now)

# # NEW: History Model
# class HistoryLog(Base):
#     __tablename__ = "history_logs"

#     id = Column(Integer, primary_key=True, index=True)
#     action_type = Column(String)       # "UPLOAD", "DELETE", "REPLACE"
#     document_name = Column(String)     # The requirement name
#     file_name = Column(String)         # The actual file name
#     section = Column(String)           # "Part A" or "Part B"
#     timestamp = Column(DateTime, default=datetime.now)

# # Create Tables
# Base.metadata.create_all(bind=engine)

# app = FastAPI(title="Fabrication Components API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # --- Endpoints ---

# @app.get("/api/files")
# def get_all_files(db: Session = Depends(get_db)):
#     return db.query(FabricationDoc).all()

# # NEW: Get History Endpoint
# @app.get("/api/history")
# def get_history(db: Session = Depends(get_db)):
#     """Fetch logs ordered by newest first."""
#     return db.query(HistoryLog).order_by(desc(HistoryLog.timestamp)).all()

# @app.post("/api/upload")
# async def upload_file(
#     section_key: str = Form(...),
#     row_id: int = Form(...),
#     document_name: str = Form(...),
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     if not file.filename.lower().endswith('.pdf'):
#         raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

#     # Check for existing file
#     existing_doc = db.query(FabricationDoc).filter(
#         FabricationDoc.section_key == section_key,
#         FabricationDoc.row_id == row_id
#     ).first()

#     action = "UPLOAD"
#     if existing_doc:
#         action = "REPLACE" # Log as replace if overwriting
#         if os.path.exists(existing_doc.file_path):
#             try:
#                 os.remove(existing_doc.file_path)
#             except OSError:
#                 pass
#         db.delete(existing_doc)
#         db.commit()

#     # Save File
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     clean_filename = file.filename.replace(" ", "_")
#     safe_filename = f"{section_key}_{row_id}_{timestamp}_{clean_filename}"
#     file_path = os.path.join(UPLOAD_DIR, safe_filename)

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     # Save Doc Metadata
#     new_doc = FabricationDoc(
#         section_key=section_key,
#         row_id=row_id,
#         document_requirement=document_name,
#         filename=safe_filename,
#         original_filename=file.filename,
#         file_path=file_path
#     )
#     db.add(new_doc)

#     # NEW: Save History Log
#     log_entry = HistoryLog(
#         action_type=action,
#         document_name=document_name,
#         file_name=file.filename,
#         section=f"Part {section_key}"
#     )
#     db.add(log_entry)
    
#     db.commit()
#     db.refresh(new_doc)
#     return new_doc

# @app.get("/api/view/{file_id}")
# def view_file(file_id: int, db: Session = Depends(get_db)):
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc or not os.path.exists(doc.file_path):
#         raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(doc.file_path, media_type="application/pdf", filename=doc.original_filename)

# @app.get("/api/download/{file_id}")
# def download_file(file_id: int, db: Session = Depends(get_db)):
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc or not os.path.exists(doc.file_path):
#         raise HTTPException(status_code=404, detail="File not found")
#     return FileResponse(doc.file_path, media_type="application/pdf", filename=doc.original_filename, headers={"Content-Disposition": f"attachment; filename={doc.original_filename}"})

# @app.delete("/api/delete/{file_id}")
# def delete_file(file_id: int, db: Session = Depends(get_db)):
#     doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
#     if not doc:
#         raise HTTPException(status_code=404, detail="File not found")

#     if os.path.exists(doc.file_path):
#         try:
#             os.remove(doc.file_path)
#         except OSError:
#             pass

#     # NEW: Log Deletion before removing record
#     log_entry = HistoryLog(
#         action_type="DELETE",
#         document_name=doc.document_requirement,
#         file_name=doc.original_filename,
#         section=f"Part {doc.section_key}"
#     )
#     db.add(log_entry)

#     db.delete(doc)
#     db.commit()
    
#     return {"message": "Deleted successfully"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)









import os
import shutil
from datetime import datetime
from typing import List

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import Column, Integer, String, DateTime, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

# --- IMPORTS FROM YOUR DATABASE.PY ---
from Database import engine, session as SessionLocal

# --- Configuration ---
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# --- Database Models ---
Base = declarative_base()

class FabricationDoc(Base):
    __tablename__ = "fabrication_docs"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String)       # "A" or "B"
    row_id = Column(Integer)           # 1, 2, 3...
    document_requirement = Column(String) 
    filename = Column(String)          # Physical filename on disk
    original_filename = Column(String) # Display filename
    file_path = Column(String)
    upload_date = Column(DateTime, default=datetime.now)

class HistoryLog(Base):
    __tablename__ = "documents_history_logs"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String)       # "UPLOAD", "DELETE", "REPLACE"
    document_name = Column(String)
    file_name = Column(String)
    section = Column(String)
    timestamp = Column(DateTime, default=datetime.now)

# Create Tables in DB
Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI(title="Fabrication Components API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Endpoints ---

@app.get("/api/files")
def get_all_files(db: Session = Depends(get_db)):
    """Fetch all files to populate the dashboard."""
    return db.query(FabricationDoc).all()

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    """Fetch history logs, newest first."""
    return db.query(HistoryLog).order_by(desc(HistoryLog.timestamp)).all()

@app.post("/api/upload")
async def upload_file(
    section_key: str = Form(...),
    row_id: int = Form(...),
    document_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # 1. Check if a file already exists for this slot
    existing_doc = db.query(FabricationDoc).filter(
        FabricationDoc.section_key == section_key,
        FabricationDoc.row_id == row_id
    ).first()

    action = "UPLOAD"

    # 2. If exists, delete it (This is the "Edit/Replace" logic)
    if existing_doc:
        action = "REPLACE"
        if os.path.exists(existing_doc.file_path):
            try:
                os.remove(existing_doc.file_path)
            except OSError:
                pass
        db.delete(existing_doc)
        db.commit()

    # 3. Save New File
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    clean_filename = file.filename.replace(" ", "_")
    safe_filename = f"{section_key}_{row_id}_{timestamp}_{clean_filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Save Doc Metadata
    new_doc = FabricationDoc(
        section_key=section_key,
        row_id=row_id,
        document_requirement=document_name,
        filename=safe_filename,
        original_filename=file.filename,
        file_path=file_path
    )
    db.add(new_doc)

    # 5. Add History Log
    log_entry = HistoryLog(
        action_type=action,
        document_name=document_name,
        file_name=file.filename,
        section=f"Part {section_key}"
    )
    db.add(log_entry)
    
    db.commit()
    db.refresh(new_doc)
    return new_doc

@app.get("/api/view/{file_id}")
def view_file(file_id: int, db: Session = Depends(get_db)):
    doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        doc.file_path, 
        media_type="application/pdf", 
        filename=doc.original_filename
    )

@app.get("/api/download/{file_id}")
def download_file(file_id: int, db: Session = Depends(get_db)):
    doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
    if not doc or not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        doc.file_path, 
        media_type="application/pdf", 
        filename=doc.original_filename,
        headers={"Content-Disposition": f"attachment; filename={doc.original_filename}"}
    )

@app.delete("/api/delete/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    doc = db.query(FabricationDoc).filter(FabricationDoc.id == file_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="File not found")

    # Log deletion before actual delete
    log_entry = HistoryLog(
        action_type="DELETE",
        document_name=doc.document_requirement,
        file_name=doc.original_filename,
        section=f"Part {doc.section_key}"
    )
    db.add(log_entry)

    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except OSError:
            pass

    db.delete(doc)
    db.commit()
    
    return {"message": "Deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)