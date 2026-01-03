from typing import Dict, Any, Tuple
import random

class AIService:
    @staticmethod
    def classify_grievance(title: str, description: str) -> Dict[str, Any]:
        """
        Mock AI service to classify grievance, detect spam, and calculate severity.
        """
        # Mock logic
        text = (title + " " + description).lower()
        
        # Categories
        categories = ["Sanitation", "Roads", "Water Supply", "Electricity", "Law & Order", "Other"]
        category = "Other"
        for cat in categories:
            if cat.lower() in text:
                category = cat
                break
        
        # Severity
        severity_score = 0.3
        if "urgent" in text or "danger" in text or "accident" in text:
            severity_score = 0.9
        elif "broken" in text or "leak" in text:
            severity_score = 0.6
            
        # Spam detection
        is_spam = False
        if "test" in text or len(text) < 5:
            is_spam = True
            
        return {
            "category": category,
            "severity_score": severity_score,
            "is_spam": is_spam,
            "summary": description[:100] + "..." if len(description) > 100 else description
        }

    @staticmethod
    def suggest_department(category: str) -> str:
        """
        Maps category to department code.
        """
        mapping = {
            "Sanitation": "DEPT-SAN",
            "Roads": "DEPT-PWD",
            "Water Supply": "DEPT-WAT",
            "Electricity": "DEPT-PWR",
            "Law & Order": "DEPT-POL"
        }
        return mapping.get(category, "DEPT-GEN")
