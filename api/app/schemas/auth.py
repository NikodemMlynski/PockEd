from pydantic import BaseModel, EmailStr 

class LoginIn(BaseModel):
    email: EmailStr 
    password: str 

class Token(BaseModel):
    access_token: str 
    token_type: str = "Bearer"

class TokenData(BaseModel):
    user_id: int 