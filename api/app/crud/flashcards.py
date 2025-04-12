from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Flashcard, FlashcardSet
from app.schemas.flashcards import FlashcardCreate, FlashcardSetCreate

from typing import List

class FlashcardCRUD:
    @staticmethod
    def create_flashcard(db: Session, flashcard_data: FlashcardCreate) -> Flashcard:
        """Create a new flashcard associated with a flashcard set."""
        new_flashcard = Flashcard(
            flashCardSetId=flashcard_data.flashCardSetId,
            question=flashcard_data.question,
            answer=flashcard_data.answer,
            isLearned=flashcard_data.isLearned
        )
        db.add(new_flashcard)
        db.commit()
        db.refresh(new_flashcard)
        return new_flashcard

    @staticmethod
    def get_flashcard_by_id(db: Session, flashcard_id: int) -> Flashcard:
        """Retrieve a flashcard by its ID."""
        flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
        if not flashcard:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Flashcard with ID {flashcard_id} not found"
            )
        return flashcard

    @staticmethod
    def get_flashcards_by_set(db: Session, flashcard_set_id: int) -> List[Flashcard]:
        """Retrieve all flashcards for a specific flashcard set."""
        flashcards = db.query(Flashcard).filter(Flashcard.flashCardSetId == flashcard_set_id).all()
        return flashcards

    @staticmethod
    def update_flashcard(db: Session, flashcard_id: int, flashcard_data: FlashcardCreate) -> Flashcard:
        """Update a flashcard with new data."""
        flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
        if not flashcard:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Flashcard with ID {flashcard_id} not found"
            )
        flashcard.flashCardSetId = flashcard_data.flashCardSetId
        flashcard.question = flashcard_data.question
        flashcard.answer = flashcard_data.answer
        flashcard.isLearned = flashcard_data.isLearned
        db.commit()
        db.refresh(flashcard)
        return flashcard

    @staticmethod
    def delete_flashcard(db: Session, flashcard_id: int) -> None:
        """Delete a flashcard by its ID."""
        flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
        if not flashcard:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Flashcard with ID {flashcard_id} not found"
            )
        db.delete(flashcard)
        db.commit()

    
    @staticmethod
    def delete_flashcard_set(db: Session, flashcard_set_id: int) -> None:
        """Delete a flashcard set and all flashcards bound to it by its ID."""
        flashcard_set = db.query(FlashcardSet).filter(FlashcardSet.id == flashcard_set_id).first()
        if not flashcard_set:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Flashcard set with ID {flashcard_set_id} not found"
            )
        # Delete all flashcards that belong to the flashcard set
        flashcards = db.query(Flashcard).filter(Flashcard.flashCardSetId == flashcard_set_id).all()
        for flashcard in flashcards:
            db.delete(flashcard)
        # Delete the flashcard set itself
        db.delete(flashcard_set)
        db.commit()

    @staticmethod
    def create_flashcard_set(db: Session, set_data: FlashcardSetCreate, user_id: int) -> FlashcardSet:
        """Create a new flashcard set associated with a note and a user."""
        new_set = FlashcardSet(
            title=set_data.title,
            note_id=set_data.note_id,
            user_id=user_id,
        )
        db.add(new_set)
        db.commit()
        db.refresh(new_set)
        return new_set