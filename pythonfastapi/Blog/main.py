from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel

db_url="postgresql://postgres:bel123@localhost:5432/FASTDB"
engine = create_engine(db_url)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()
class Profiles(Base):
    __tablename__="profiles"
    id=Column(Integer,primary_key=True)
    name=Column(String)
    pswd=Column(String)

Base.metadata.create_all(bind=engine)

def get_db():
    db=SessionLocal()
    try:
        return db
    finally:
        db.close()

app = FastAPI()
class UserCred(BaseModel):
    id:int
    name:str
    pswd:str

@app.post("/create")
def create_user(res:UserCred):
    db=get_db()
    new_user=Profiles(
        id=res.id,
        name=res.name,
        pswd=res.pswd
    )
    db.add(new_user)
    db.commit()

    return {f"{res.id} craeted successfully"}



@app.get('/')
def abc():
    return "success"


@app.get("/getall")
def abc():
    db=get_db()
    temp=db.query(Profiles).all()
    return temp
