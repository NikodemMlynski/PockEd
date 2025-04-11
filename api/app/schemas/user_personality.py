from pydantic import BaseModel 
from typing import Optional 
from datetime import datetime

class UserPersonalityIn(BaseModel):
    user_id: int
    learning_style: str 
    personality: str 
    motivation_rules: str 
    top_intelligences: str 
    social_focus: str 
    communication_style: str 
    goals: str 

class UserPersonalityOut(BaseModel):
    id: int
    user_id: int
    learning_style: str 
    personality: str 
    motivation_rules: str 
    top_intelligences: str 
    social_focus: str 
    communication_style: str 
    goals: str 



