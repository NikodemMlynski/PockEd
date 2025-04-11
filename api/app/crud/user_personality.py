from sqlalchemy.orm import Session 
from app.models import UserPersonality, User 
from fastapi import HTTPException, status 
from app.schemas import user_personality

class UserPersonalityCRUD:
    @staticmethod 
    def create_user_personality(user_id: int, db: Session):
        user_exist = db.query(User).filter(User.id == user_id).first()

        if not user_exist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id: {user_id} does not exist"
            )
        db_user_personality = UserPersonality(
            user_id=user_id,
            learning_style="",
            personality="",
            motivation_rules="",
            top_intelligences="",
            social_focus="",
            communication_style="",
            goals="",
            isFilled=False
        ) 

        db.add(db_user_personality)
        db.commit()
        db.refresh(db_user_personality)
        return db_user_personality
    
    @staticmethod
    def update_user_personality(db: Session, user_id: int, preferences: user_personality.UserPersonalityIn)
        user = db.query(User).filter(User.id == user_id).first()

        # if not user:
