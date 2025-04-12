from pydantic import BaseModel
from typing import Optional
from datetime import date

class NoteBase(BaseModel):
    title: str
    content: str 

class NoteCreate(NoteBase):
    user_id: int 

class NoteOut(NoteBase):
    id: int