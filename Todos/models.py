from database import Base
from sqlalchemy import Column,Integer,String,Boolean,ForeignKey
from sqlalchemy.orm import relationship


class Todos(Base):
    __tablename__="master_todos"
    id=Column(Integer,primary_key=True,index=True)
    title=Column(String)
    description=Column(String)
    priority=Column(Integer)
    complete=Column(Boolean,default=False)

class User(Base):
    __tablename__="users"
    user_id = Column(Integer,primary_key = True,index = True)
    user_name = Column(String,unique=True)
    pswd = Column(String)

    post = relationship("Post",back_populates="user")

class Post(Base):
    __tablename__="posts"
    post_id = Column(Integer,primary_key=True,index=True)
    post_caption = Column(String)

    user_id = Column(Integer,ForeignKey("users.user_id"))
    user = relationship("User",back_populates="post")
    