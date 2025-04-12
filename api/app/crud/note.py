from sqlalchemy.orm import Session
from app.models import Note
from app.schemas.note import NoteCreate, NoteOut, NoteBase
from fastapi import HTTPException, status

class NoteCRUD:

    @staticmethod
    def create_note(db: Session, note_data: NoteBase, user_id : int) -> Note:
        new_note = Note(
            title=note_data.title,
            content=note_data.content,
            user_id=user_id
        )
        db.add(new_note)
        db.commit()
        db.refresh(new_note)
        return new_note

    @staticmethod
    def get_note_by_id(db: Session, note_id: int) -> Note:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with ID {note_id} not found"
            )
        return note

    @staticmethod
    def get_all_notes_for_user(db: Session, user_id: int) -> list[Note]:
        return db.query(Note).filter(Note.user_id == user_id).all()

    @staticmethod
    def update_note(db: Session, note_id: int, note_data: NoteCreate) -> Note:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with ID {note_id} not found"
            )
        note.title = note_data.title
        note.content = note_data.content
        db.commit()
        db.refresh(note)
        return note

    @staticmethod
    def delete_note(db: Session, note_id: int) -> None:
        note = db.query(Note).filter(Note.id == note_id).first()
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Note with ID {note_id} not found"
            )
        db.delete(note)
        db.commit()