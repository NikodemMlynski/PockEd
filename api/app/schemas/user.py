from pydantic import BaseModel 
from typing import Optional 
from datetime import datetime

class UserIn(BaseModel):
    email: str 
    password: str 
    name: str 
    surname: str 
    school: str 
    username: str 
    vovoideship: str

class UserOut(BaseModel):
    id: int 
    email: str 
    created_at: datetime 
    name: str 
    surname: str 
    school: str 
    username: str 
    vovoideship: str


