import os
from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "")

if not DATABASE_URL:
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_DB_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD", "")
    
    if SUPABASE_URL and SUPABASE_DB_PASSWORD:
        encoded_password = quote_plus(SUPABASE_DB_PASSWORD)
        
        try:
            project_ref = SUPABASE_URL.split("//")[1].split(".")[0]
            SQLALCHEMY_DATABASE_URL = f"postgresql://postgres.{project_ref}:{encoded_password}@db.{project_ref}.supabase.co:5432/postgres"
        except IndexError:
             print("⚠️  Warning: Invalid SUPABASE_URL format. Using SQLite fallback.")
             SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
    else:
        print("⚠️  Warning: SUPABASE_URL or SUPABASE_DB_PASSWORD not set. Using SQLite fallback.")
        print("   To use Supabase, set SUPABASE_DB_PASSWORD in .env file")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"
else:
    SQLALCHEMY_DATABASE_URL = DATABASE_URL

if SQLALCHEMY_DATABASE_URL.startswith("postgresql"):
    print("✅ Connecting to Supabase PostgreSQL database...")
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,
        pool_size=1,
        max_overflow=0,
        echo=False,
        connect_args={
            "connect_timeout": 5
        },
        pool_recycle=3600
    )
else:
    print("📦 Using SQLite database (local development)")
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
