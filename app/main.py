from fastapi import Depends, FastAPI
from sqlmodel import Session

from app.core.database import get_session
from app.router import auth , client , invoice
from app.models.user import User
from app.models.Dashboard import DashboardStats
from app.services import invoice_service
from app.services.auth_service import get_current_active_user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router)
app.include_router(client.router)

app.include_router(invoice.router)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dashboard", response_model=DashboardStats)
def get_dashboard_data(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_session)
):
    return invoice_service.get_dashboard_stats(owner=current_user, db=db)