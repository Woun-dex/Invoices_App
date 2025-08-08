from sqlmodel import SQLModel , create_engine , Session
from app.core.config import settings

from app.models import *

engine = create_engine(settings.DATABASE_URL , echo = True)


def init_db():
    print("Creating database and tables...")
    SQLModel.metadata.create_all(engine)
    print("Done.")

def get_session():
    with Session(engine) as session:
        yield session

if __name__ == "__main__":
    init_db()