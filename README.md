## Submission Details

1. **Problem Statement**: AI-Powered Citizen Grievance Redressal System (Streamlining public grievance resolution)
2. **Project Name**: Grievance Redressal System
3. **Team Name**: Team Dev Hawks
4. **2-minute Demonstration Video link**: `https://drive.google.com/drive/folders/14DBqXr42M8OL2E2nHNov43BmeMm4Dkz4?usp=drive_link`
5. **PPT Link**: `https://drive.google.com/drive/folders/14DBqXr42M8OL2E2nHNov43BmeMm4Dkz4?usp=drive_link`

# Team Dev Hawks — AI-Powered Citizen Grievance Redressal System

An intelligent, transparent, and automated grievance redressal system designed to streamline complaint submission, assignment, tracking, and resolution for public governance. The system features a role-based workflow (Citizen, Admin, Field Officer) powered by **FastAPI** (backend) and **Next.js** (frontend), with **Gemini AI** integration for automated grievance classification and prioritization.

## What’s Inside
- **Role-Based Portals**: Dedicated interfaces for Citizens (raise/track), Admins (assign/monitor), and Field Officers (resolve/update).
- **AI-Powered Analysis**: Uses Google Gemini Pro to automatically classify grievances, detect spam, and calculate severity scores.
- **Interactive Heatmaps**: Visualizes grievance density and hotspots using Google Maps integration.
- **AI Chatbot**: Built-in assistant to guide citizens through the grievance reporting process.
- **Multilingual Support**: Accessible to a wider audience with dynamic language selection.
- **Automated Workflow**: Streamlined process from submission → validation → assignment → resolution → verification.
- **Modern Tech Stack**: Built with Next.js 16 (App Router), Tailwind CSS, Shadcn UI, FastAPI, and Supabase (PostgreSQL).

## Quickstart

### 1) Backend
- **Prereqs**: Python 3.11+, PostgreSQL/Supabase database, Google Gemini API Key.
- **Install**:
  ```bash
  cd backend
  python -m venv .venv
  # Windows
  .venv\Scripts\activate
  # Linux/Mac
  # source .venv/bin/activate
  pip install -r requirements.txt
  ```
- **Configuration**:
  Ensure you have a `.env` file configured with your database credentials, API keys, and secret keys.
- **Run API**:
  ```bash
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```
- **Health**: `GET /` (Welcome message)

### 2) Frontend
- **Prereqs**: Node 18+.
- **Install**:
  ```bash
  cd frontend
  npm install
  ```
- **Configuration**:
  Ensure you have a `.env.local` file configured with the backend API URL.
- **Run**:
  ```bash
  npm run dev
  ```
  Access at [http://localhost:3000].

## Database Setup (Supabase)
- The project uses Supabase (PostgreSQL) for persistence.
- The application is designed to automatically create necessary tables on startup.
- **Seed Data**: Run `python -m app.seed` (or `python backend/app/seed.py`) to populate initial departments (Water, Electricity, etc.), regions, and default users.

## Key Features & Capabilities
- **Smart Classification**: AI analyzes grievance text to tag it (e.g., "Sanitation", "Roads") and assign urgency.
- **Geotagging & Mapping**: Location-based tracking of grievances allows authorities to identify infrastructure failures visually.
- **Dashboard Analytics**: Admin dashboard provides real-time insights into grievance trends, officer performance, and resolution rates.
- **Secure Auth**: JWT-based authentication ensures secure access for all roles.
- **Department & Region Management**: Organized structure for handling grievances across different zones and public utility sectors.

## Testing
- **Backend**:
  ```bash
  cd backend
  pytest
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm test
  ```

## Current Gaps / Future Roadmap
- Integration of SMS/WhatsApp notifications for status updates.
- Advanced analytics with predictive modeling for grievance hotspots.
- Offline support for field officers in low-connectivity areas.