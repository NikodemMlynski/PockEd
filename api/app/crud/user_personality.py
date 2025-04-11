from sqlalchemy.orm import Session 
from app.models import UserPersonality, User 
from fastapi import HTTPException, status 
from app.schemas.user_personality import UserPersonalityIn

class UserPersonalityCRUD:

    @staticmethod
    def evaluate_user_personality( preferences: UserPersonalityIn, user_id: int):
        
        learning_style = ", ".join(preferences.learning_style)

        # Unpack the dictionary into a string
        personality = ", ".join([f"{key}: {value}" for key, value in preferences.personality.items()])
        motivation_rules = ", ".join(preferences.motivation_rules)
        top_intelligences = ", ".join(preferences.top_intelligences)
        social_focus = ", ".join(preferences.social_focus)
        communication_style = ", ".join(preferences.communication_style)
        goals = ", ".join(preferences.goals)
        isFilled = True
        
        user_personality = UserPersonality(
            user_id=user_id,
            learning_style=learning_style,
            personality=personality,
            motivation_rules=motivation_rules,
            top_intelligences=top_intelligences,
            social_focus=social_focus,
            communication_style=communication_style,
            goals=goals,
            isFilled=isFilled
        )
        return user_personality

        

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
    def update_user_personality(db: Session, user_id: int, preferences: UserPersonalityIn):
        old_user_personality = db.query(UserPersonality).filter(UserPersonality.user_id == user_id).first()
        evaluated_user_personality = UserPersonalityCRUD.evaluate_user_personality(preferences, user_id)

        
        # update the old user personality with the new one
        old_user_personality.learning_style = evaluated_user_personality.learning_style
        old_user_personality.personality = evaluated_user_personality.personality
        old_user_personality.motivation_rules = evaluated_user_personality.motivation_rules
        old_user_personality.top_intelligences = evaluated_user_personality.top_intelligences
        old_user_personality.social_focus = evaluated_user_personality.social_focus
        old_user_personality.communication_style = evaluated_user_personality.communication_style
        old_user_personality.goals = evaluated_user_personality.goals
        old_user_personality.isFilled = evaluated_user_personality.isFilled
        db.commit()
        db.refresh(old_user_personality)
        return old_user_personality





        


