from fastapi import FastAPI,Depends,HTTPException
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from models import *

from router import test
from services import auth
app=FastAPI()

app.include_router(test.router)
app.include_router(auth.auth_routers)
models.Base.metadata.create_all(bind=engine)
# def init_db():
#     db = SessionLocal()
#     try: 
#         yield db
#     finally:
#         db.close()


# class POSTANEWTASK(BaseModel):
#     id: Optional[int] = None
#     title:str
#     description:str
#     priority:int
#     complete:bool

# @app.post("/post_a_task")
# def postANewTask(req:POSTANEWTASK,db: Session = Depends(init_db)):
#     # data=db.query(master_todos).all()
#     data=Todos(
#         title=req.title,
#         description=req.description,
#         priority=req.priority,
#         complete=req.complete
#     )
#     db.add(data)
#     db.commit()
#     print("added succesfully")
#     return {"msg":"added succesfully"}



# @app.get("/getalltask")
# def getalltask(db:Session=Depends(init_db)):
#     temp_data=db.query(Todos).all()
#     return temp_data


# @app.get("/getbyprio")
# def getbyprority(imp=int,db:Session=Depends(init_db)):
#     temp_data=db.query(Todos).filter(Todos.priority == imp).all()
#     return temp_data


# # @app.put("/updatetask")
# # def updatetask(req:POSTANEWTASK,db:Session=Depends(init_db)):
# #     temp_data=db.query(Todos).filter(Todos.id == req.id).first()
# #     if temp_data is None:
# #         raise HTTPException(status_code=404, detail="Task not found")

# #     temp_data.title=req.title,
# #     temp_data.description=req.description,
# #     temp_data.priority=req.priority,
# #     temp_data.complete=req.complete

# #     db.commit()
# #     db.refresh(temp_data)

# #     return {"msg":"updated succesfully!"}





# @app.delete("/deletetask")
# def delete_task(task_id: int, db: Session = Depends(init_db)):

#     task = db.query(Todos).filter(Todos.id == task_id).first()

#     if task is None:
#         raise HTTPException(status_code=404, detail="Task not found")

#     db.delete(task)
#     db.commit()

#     return {"message": "Task deleted successfully"}


    

    

