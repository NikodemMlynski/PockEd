from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from azure.storage.blob import BlobServiceClient
from app.schemas.note import NoteCreate, NoteOut, NoteBase
from app.crud.note import NoteCRUD
from app.database import get_db
from app.oauth2 import get_current_user
import uuid
from app.config import settings

router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)

@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    note_data: NoteBase,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    return NoteCRUD.create_note(db, note_data, current_user.id)


@router.get("/{note_id}", response_model=NoteOut)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Retrieve a note by its ID."""
    note = NoteCRUD.get_note_by_id(db, note_id)
    if note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this note"
        )
    return note


@router.get("/", response_model=list[NoteOut])
def get_all_notes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Retrieve all notes for the current user."""
    return NoteCRUD.get_all_notes_for_user(db, current_user.id)


@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    note_data: NoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update an existing note."""
    note = NoteCRUD.get_note_by_id(db, note_id)
    if note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this note"
        )
    return NoteCRUD.update_note(db, note_id, note_data)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a note by its ID."""
    note = NoteCRUD.get_note_by_id(db, note_id)
    if note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this note"
        )
    NoteCRUD.delete_note(db, note_id)


@router.post("/{note_id}/upload-photo", status_code=status.HTTP_201_CREATED)
async def upload_photo(
    note_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Upload a photo to Azure Blob Storage and associate it with a note."""
    # Verify the note exists and belongs to the current user
    note = NoteCRUD.get_note_by_id(db, note_id)
    if not note or note.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to upload a photo for this note"
        )

    # Azure Blob Storage configuration
    AZURE_STORAGE_CONNECTION_STRING = settings.AZURE_STORAGE_CONNECTION_STRING
    CONTAINER_NAME = settings.CONTAINER_NAME

    try:
        # Generate a unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"

        # Connect to Azure Blob Storage
        blob_service_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
        blob_client = blob_service_client.get_blob_client(container=CONTAINER_NAME, blob=unique_filename)

        # Upload the file
        file_content = await file.read()
        blob_client.upload_blob(file_content, overwrite=True)

        # Generate the file URL
        file_url = f"https://{blob_service_client.account_name}.blob.core.windows.net/{CONTAINER_NAME}/{unique_filename}"

        return {"message": "Photo uploaded successfully", "file_url": file_url}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading photo: {str(e)}"
        )