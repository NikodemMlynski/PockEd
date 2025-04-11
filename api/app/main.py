from fastapi import FastAPI 
# from app.routes import school, users, auth, super_admin
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models
from app.routes import users, auth

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="EduAccess API",
    version="1.0",
    openapi_prefix="/pocked/v1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(users.router)
app.include_router(auth.router)
@app.get("/")
def root():
    return {"message": "Welcome to edu API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)