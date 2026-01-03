from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .app import models, database
from .app.routers import grievance, admin, auth

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="CivicPulse API", description="AI-driven grievance redressal platform")

app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

# CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(grievance.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CivicPulse API"}
