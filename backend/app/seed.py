from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine

def seed_db():
    db = Session(bind=engine)
    
    # Check if data exists
    if db.query(models.Department).first():
        print("Data already seeded.")
        return

    # Seed Departments
    departments = [
        models.Department(name="Water Supply", code="WATER"),
        models.Department(name="Electricity", code="ELEC"),
        models.Department(name="Roads & Transport", code="ROAD"),
        models.Department(name="Sanitation", code="SANI"),
        models.Department(name="Health", code="HLTH"),
        models.Department(name="General", code="GEN"),
    ]
    db.add_all(departments)
    db.commit()

    # Seed Users
    users = [
        models.User(email="citizen@example.com", full_name="John Doe", role=models.UserRole.CITIZEN, hashed_password="hashed_password"),
        models.User(email="admin@example.com", full_name="Admin User", role=models.UserRole.ADMIN, hashed_password="hashed_password"),
        models.User(email="field@example.com", full_name="Field Officer 1", role=models.UserRole.FIELD_OFFICER, hashed_password="hashed_password"),
    ]
    db.add_all(users)
    db.commit()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_db()
