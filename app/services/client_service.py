# app/services/client_service.py

from typing import List
from sqlmodel import select, Session, or_
from fastapi import HTTPException, status

from app.models.client import Client, ClientCreate

def get_clients(owner_id: int, db: Session) -> List[Client]:
    statement = select(Client).where(Client.owner_id == owner_id)
    clients = db.exec(statement).all()
    return clients


def get_client_by_id(client_id: int, owner_id: int, db: Session) -> Client:
    statement = select(Client).where(Client.id == client_id, Client.owner_id == owner_id)
    client = db.exec(statement).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client


def create_client(client: ClientCreate, owner_id: int, db: Session) -> Client:
    statement = select(Client).where(
        Client.owner_id == owner_id,
        or_(Client.name == client.name, Client.email == client.email)
    )
    existing_client = db.exec(statement).first()
    if existing_client:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail="A client with this name or email already exists for this owner")

    new_client = Client.model_validate(client, update={"owner_id": owner_id})
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


def update_client(client_id: int, owner_id: int, client_update: ClientCreate, db: Session) -> Client:
    db_client = get_client_by_id(client_id=client_id, owner_id=owner_id, db=db)

    update_data = client_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_client, key, value)

    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


def delete_client(client_id: int, owner_id: int, db: Session) -> dict:
    client_to_delete = get_client_by_id(client_id=client_id, owner_id=owner_id, db=db)

    db.delete(client_to_delete)
    db.commit()

    return {"message": "Client deleted successfully"}