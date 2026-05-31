import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bondhumart AI Command Center"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Evolution API 
    EVOLUTION_API_URL: str = os.getenv("EVOLUTION_API_URL", "https://ai-api.bondhumart.cloud")
    EVOLUTION_API_KEY: str = os.getenv("EVOLUTION_API_KEY", "your_evolution_api_key_here")
    EVOLUTION_INSTANCE_NAME: str = os.getenv("EVOLUTION_INSTANCE_NAME", "Bondhumart")
    
    # Database URL (For now we will use an in-memory mock, later connect to PostgreSQL or MongoDB)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bondhumart_ai.db")
    
    class Config:
        env_file = ".env"

settings = Settings()
