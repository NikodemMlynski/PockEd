from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from app.crud.users import UsersCRUD
from app.crud.user_personality import UserPersonalityCRUD
from app.database import get_db
from app.schemas.user_personality import UserPersonalityIn, UserPersonalityOut
from app.oauth2 import get_current_user
from app.models import User



router = APIRouter(
    prefix="/personality",
    tags=["User Personality Profile"]
)

@router.put("/update_user/me", response_model=UserPersonalityOut)
def update_user_personality(
    preferences: UserPersonalityIn, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = UsersCRUD.get_user(db, current_user.id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {current_user.id} does not exist"
        )
    


    user_personality = UserPersonalityCRUD.update_user_personality(db, current_user.id, preferences)

    

    return user_personality