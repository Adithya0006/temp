from fastapi import APIRouter
from schemas import task 
from fastapi import FastAPI,Depends,HTTPException
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Annotated, List, Optional, Dict, Any
from models import *
from services import testservice as ts
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()



def init_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()
@router.get("/testing")
def testing():
    return ts.checking_service()

@router.post("/post_a_task")
def postANewTask(req:task.POSTANEWTASK,db: Session = Depends(init_db)):
    return ts.postANewTask(req,db)


@router.get("/get_task")
def getalltasks(db: Session = Depends(init_db)):
    return ts.getall(db)


@router.post("/create_user")
def crete_user(req:task.CREATEUSER,db:Session = Depends(init_db)):
    return ts.create_user(req,db)


@router.get("/get_all_users")
def allusers(db:Session = Depends(init_db)):
    return ts.getallusers(db)


@router.post("/get_access_token")
def get_access_token(formdata:Annotated[OAuth2PasswordRequestForm,Depends()],
                     db:Session = Depends(init_db)):
    access = ts.get_access_token(formdata,db)
    if access:
        return access
    else:
        return "Authentication Failed"

@router.get("/check_jwt_valid")
def check_jwt_valid(token):
    return ts.check_jwt_valid(token)