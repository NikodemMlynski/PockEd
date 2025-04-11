from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session 
from app.schemas.user import UserIn, UserOut
from app.database import get_db
from app.crud.users import UsersCRUD
from app.oauth2 import get_current_user
from app.models import User 
from typing import List 

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserOut)
def create_user(user_data: UserIn, db: Session = Depends(get_db)):
    user = UsersCRUD.create_user(db, user_data)
    return user 

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user

@router.get("/", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return UsersCRUD.get_all_users(db)

@router.get("/{id}", response_model=UserOut)
def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return UsersCRUD.get_user(db, id)