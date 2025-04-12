
from fastapi import APIRouter, Depends
from app.schemas.chat import ChatIn, ChatOut
from app.oauth2 import get_current_user
import openai 
from fastapi import HTTPException
from app.models import UserPersonality
from sqlalchemy.orm import Session
from app.config import settings

from app.database import get_db

router = APIRouter(
    prefix="/chat",
    tags=["chatbot ednpoint"]
)

@router.post("/", response_model=ChatOut)
async def chat(
    chat_data: ChatIn,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    user_personality = db.query(UserPersonality).filter(UserPersonality.user_id == current_user.id).first()
        # Retrieve user personality from the database
    user_personality = db.query(UserPersonality).filter(UserPersonality.user_id == current_user.id).first()
    if not user_personality:
        raise HTTPException(status_code=404, detail="User personality not found")

    # Construct the user profile content
    user_profile = {
        "learning_style": user_personality.learning_style,
        "personality": user_personality.personality,
        "motivation_rules": user_personality.motivation_rules,
        "top_intelligences": user_personality.top_intelligences,
        "social_focus": user_personality.social_focus,
        "communication_style": user_personality.communication_style,
        "goals": user_personality.goals,
    }


    try:
        client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        # Prepare the messages for OpenAI API
        messages = chat_data.messages[:-1] + [
            {
                "role": "developer",
                "content": f"Profil ucznia: {user_profile}"
            }
        ] + chat_data.messages[-1:]

        # Call OpenAI API

        
        completion = client.chat.completions.create(
            model="ft:gpt-4o-mini-2024-07-18:my-own-projects:edek-notatki-fiszki-personality:BLHI8CVV",
            messages=messages,
            max_tokens=150,
            temperature=0.7
        )
        response_text = completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error communicating with OpenAI: {str(e)}")

    # Return the response in the expected format
    return {"messages": [{"role": "assistant", "content": response_text}]}
    
