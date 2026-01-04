
import requests
import os
from dotenv import load_dotenv

# Load env vars from backend/.env to simulate backend environment
load_dotenv('backend/.env')

API_URL = "http://127.0.0.1:8000"

def test_health():
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")

def test_db_connection():
    # Attempt to hit an endpoint that requires DB access
    # Since I don't have a simple db-check endpoint, I'll try login with bad creds, 
    # which should trigger a DB lookup and return 401 (not 500).
    try:
        response = requests.post(f"{API_URL}/auth/login", data={"username": "test", "password": "wrongpassword"})
        if response.status_code == 401 or response.status_code == 404:
            print(f"DB Connection check (via auth failure): Success (got expected {response.status_code})")
        else:
            print(f"DB Connection check: Unexpected status {response.status_code} - {response.text}")
    except Exception as e:
        print(f"DB Connection check failed: {e}")

if __name__ == "__main__":
    print("Testing local backend...")
    test_health()
    test_db_connection()
