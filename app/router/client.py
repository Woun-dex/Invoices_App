# app/router/client.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.models.client import ClientRead, ClientCreate
from app.models.user import User
from app.services import client_service
from app.services.auth_service import get_current_active_user
from app.core.database import get_session

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("/", response_model=List[ClientRead])
def get_clients_for_current_user(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return client_service.get_clients(owner_id=current_user.id, db=db)

@router.get("/{client_id}", response_model=ClientRead)
def get_single_client(
    client_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return client_service.get_client_by_id(client_id=client_id, owner_id=current_user.id, db=db)

@router.post("/", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def create_new_client(
    client_data: ClientCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return client_service.create_client(client=client_data, owner_id=current_user.id, db=db)

@router.put("/{client_id}", response_model=ClientRead)
def update_existing_client(
    client_id: int,
    client_data: ClientCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return client_service.update_client(
        client_id=client_id, owner_id=current_user.id, client_update=client_data, db=db
    )

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_a_client(
    client_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    client_service.delete_client(client_id=client_id, owner_id=current_user.id, db=db)
    return None

