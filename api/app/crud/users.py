from sqlalchemy.orm import Session 
from app.models import User 
from app.schemas.user import UserIn, UserOut 
from passlib.context import CryptContext 
from fastapi import HTTPException, status 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UsersCRUD:
    @staticmethod 
    def get_all_users(db: Session):
        return db.query(User).all()
    
    @staticmethod 
    def get_user(db: Session, user_id: int):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id: {user_id} does not exist"
            )
        
        return user 
    
    @staticmethod 
    def get_user_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod 
    def create_user(db: Session, user: UserIn):
        existing_email_user = db.query(User).filter(User.email == user.email).first()
        if existing_email_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with that email already exists"
            )

        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            password=hashed_password,
            name=user.name,
            surname=user.surname,
            school=user.school,
            vovoideship=user.vovoideship
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod 
    def delete_user(db: Session, user_id: int):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User dos not exist"
            )
        db.delete(db_user)
        db.commit()
    
    @staticmethod
    def verify_password(plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)
        