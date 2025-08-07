from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Invoice Management System"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"


    class Config:
        env_file = ".env"

settings = Settings()

