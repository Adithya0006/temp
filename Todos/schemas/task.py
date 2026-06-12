from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class POSTANEWTASK(BaseModel):
    id: Optional[int] = None
    title:str
    description:str
    priority:int
    complete:bool


class CREATEUSER(BaseModel):
    user_id:int
    user_name:str
    pswd:str