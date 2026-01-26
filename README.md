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
- **Prereqs**: Python 3.11+, optional PostgreSQL/Supabase, optional Google Gemini API Key.
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
  Create a `.env` in `backend` if you want PostgreSQL/Supabase:
  ```
  SUPABASE_URL=your_supabase_project_url
  SUPABASE_DB_PASSWORD=your_database_password
  # Optional: allow frontend origin(s), comma-separated
  ALLOW_ORIGINS=https://your-vercel-domain.vercel.app
  ```
  - If these are not set, the backend uses local SQLite automatically.
- **Run API**:
  ```bash
  cd backend
  python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
  ```
- **Health**: `GET /` (Welcome message)
- **Seed Data**:
  ```bash
  cd backend
  python -m app.seed
  ```
  Seeds departments, regions, and default users (admin@example.com, etc.).
  
  Windows helpers:
  - Double-click `START_BACKEND.bat` (PostgreSQL/Supabase or SQLite based on `.env`)
  - Or `START_SIMPLE.bat` to force SQLite

### 2) Frontend
- **Prereqs**: Node 18+.
- **Install**:
  ```bash
  cd frontend
  npm install
  ```
- **Configuration**:
  Create `frontend/.env.local`:
  ```
  NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```
  - In production (Vercel), set these as Environment Variables.
  - The app also supports calling `/api/...` via Next.js rewrites when `NEXT_PUBLIC_API_URL` is present.
- **Run**:
  ```bash
  npm run dev
  ```
  Access at [http://localhost:3000].

## Backend Database
- Default: SQLite (no setup needed).
- Optional: Supabase (PostgreSQL). Set `SUPABASE_URL` and `SUPABASE_DB_PASSWORD` in `backend/.env`.
- Tables are auto-created on startup.

## Key Features & Capabilities
- **Smart Classification**: AI analyzes grievance text to tag it (e.g., "Sanitation", "Roads") and assign urgency.
- **Geotagging & Mapping**: Location-based tracking of grievances allows authorities to identify infrastructure failures visually.
- **Dashboard Analytics**: Admin dashboard provides real-time insights into grievance trends, officer performance, and resolution rates.
- **Secure Auth**: JWT-based authentication ensures secure access for all roles.
- **Department & Region Management**: Organized structure for handling grievances across different zones and public utility sectors.

## Development Checks
- **Backend quick check**:
  ```bash
  cd backend
  python test_backend.py
  ```
- **Frontend lint/build**:
  ```bash
  cd frontend
  npm run lint
  npm run build
  ```

## Deploy to Vercel (Frontend)
- Project Settings:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Install Command: `npm install`
- Environment Variables (Production):
  - `NEXT_PUBLIC_API_URL=https://your-backend-host.tld`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key` (optional)
- Backend:
  - Deploy FastAPI separately (Render, Railway, Fly.io, Cloud Run).
  - Set `ALLOW_ORIGINS=https://your-vercel-domain.vercel.app` in backend env.
  - Ensure routes `/auth`, `/metadata`, `/grievance`, `/admin`, and static `/uploads` are accessible.
- Troubleshooting:
  - `NOT_FOUND` on Vercel: verify Root Directory = `frontend`, env set, and backend reachable.
  - CORS errors: update backend `ALLOW_ORIGINS` to include your Vercel domain.
  - Heatmap message: set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable geospatial view.
