from pydantic import BaseModel 
from typing import Optional, List, Dict
from datetime import datetime


class UserPersonalityIn(BaseModel):
    learning_style: List[str]
    personality:  Dict[str, int]
    motivation_rules: List[str]
    top_intelligences: List[str]
    social_focus: List[str]
    communication_style: List[str] 
    goals: list[str]

class UserPersonalityOut(BaseModel):
    id: int
    user_id: int
    learning_style: str
    personality:  str
    motivation_rules: str
    top_intelligences: str
    social_focus: str
    communication_style: str
    goals: str



