from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.crud.flashcards import FlashcardCRUD
from app.schemas.flashcards import FlashcardCreate, FlashcardOut, FlashcardSetCreate
from app.database import get_db
from app.oauth2 import get_current_user
import openai
import json

from app.config import settings
from app.models import UserPersonality, Note

router = APIRouter(
    prefix="/flashcards",
    tags=["Flashcards"]
)

@router.post("/generate/{note_id}", status_code=status.HTTP_201_CREATED)
def create_flashcard(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):  
    note = db.query(Note).filter(Note.id == note_id).first()

    new_flashcard_set = FlashcardSetCreate(
        title=note.title,
        note_id=note.id,
    )
    create_flashcard_set = FlashcardCRUD.create_flashcard_set(db, new_flashcard_set, current_user.id)
    user_profile = db.query(UserPersonality).filter(UserPersonality.user_id == current_user.id).first()


    try:
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        # Prepare the messages for OpenAI API
        messages = [
            {
                "role": "developer",
                "content": "Profil ucznia: " + str(user_profile) + ". Jesteś asystentem AI, który pomaga w tworzeniu fiszek do nauki dla ucznia o podanym powyższym profilu. Twoim zadaniem jest przekształcenie podanego tekstu w fiszki. Użyj poniższego formatu: \"[ { \"question\": \"...\", \"answer\": \"...\" }, ... ]\"  W odpowiedzi podaj tylko i wyłącznie json bez żadego przedrostka. Tekst do stworzenia notatek: \n" + note.content
            }
        ]


        # Call OpenAI API

        
        completion = client.chat.completions.create(
            model="ft:gpt-4o-mini-2024-07-18:my-own-projects:edek-notatki-fiszki-personality:BLHI8CVV",
            messages=messages,
            max_tokens=1500,
            temperature=0.7
        )
        response_text = completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with OpenAI: {str(e)}")
    
    print(response_text)
    json_response = json.loads(response_text)
    
    for flashcard in json_response:
        print(flashcard)
        new_flashcard = FlashcardCRUD.create_flashcard(db, FlashcardCreate(
            flashCardSetId=create_flashcard_set.id,
            question=flashcard["question"],
            answer=flashcard["answer"],
            isLearned=False
        ))
    return {"message" : "Flashcards created successfully", "flashcards": flashcard}


@router.get("/{flashcard_id}", response_model=FlashcardOut)
def get_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve a flashcard by its ID.
    """
    return FlashcardCRUD.get_flashcard_by_id(db, flashcard_id)

@router.get("/set/{flashcard_set_id}", response_model=List[FlashcardOut])
def get_flashcards_by_set(
    flashcard_set_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Retrieve all flashcards for a specific flashcard set.
    """
    return FlashcardCRUD.get_flashcards_by_set(db, flashcard_set_id)

@router.put("/{flashcard_id}", response_model=FlashcardOut)
def update_flashcard(
    flashcard_id: int,
    flashcard_data: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Update a flashcard with new data.
    """
    return FlashcardCRUD.update_flashcard(db, flashcard_id, flashcard_data)

@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a flashcard by its ID.
    """
    FlashcardCRUD.delete_flashcard(db, flashcard_id)

@router.delete("/set/{flashcard_set_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard_set(
    flashcard_set_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a flashcard set and all flashcards bound to it.
    """
    FlashcardCRUD.delete_flashcard_set(db, flashcard_set_id)