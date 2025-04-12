from pydantic import BaseModel
from typing import List, Optional


# -----------------------
# Flashcard Schemas
# -----------------------
class FlashcardBase(BaseModel):
    question: str
    answer: str
    isLearned: Optional[bool] = False

class FlashcardCreate(FlashcardBase):
    flashCardSetId: int

class FlashcardOut(FlashcardBase):
    id: int
    flashCardSetId: int

    class Config:
        orm_mode = True

    
# -----------------------
# FlashcardSet Schemas
# -----------------------
class FlashcardSetBase(BaseModel):
    title: str
    note_id: int

class FlashcardSetCreate(FlashcardSetBase):
    pass

class FlashcardSetOut(FlashcardSetBase):
    id: int
    user_id: int
    flashcards: List[FlashcardOut] = []

    class Config:
        orm_mode = True