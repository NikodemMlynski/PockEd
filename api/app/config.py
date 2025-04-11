from pydantic_settings import BaseSettings 
from pydantic import ConfigDict 

class Settings(BaseSettings):
    access_token_expire_minutes: int 

    algorithm: str 
    secret_key: str 
    database_url: str

    model_config = ConfigDict(env_file=".env")

settings = Settings()