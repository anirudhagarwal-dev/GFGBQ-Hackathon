import random
from typing import Tuple, Optional

class AIService:
    @staticmethod
    def analyze_grievance(title: str, description: str, image_url: Optional[str] = None) -> dict:
        """
        Mock AI analysis for grievance.
        Returns: category, priority, sentiment, summary
        """
        text = (title + " " + description).lower()
        
        # Classification Logic
        category = "General"
        if any(w in text for w in ["leak", "overflow", "pipeline", "water"]):
            category = "Water Supply"
        elif any(w in text for w in ["wire", "fire", "spark", "electric", "pole"]):
            category = "Electricity"
        elif any(w in text for w in ["road", "pothole", "asphalt"]):
            category = "Roads & Transport"
        elif any(w in text for w in ["garbage", "trash", "waste", "bin"]):
            category = "Sanitation"

        # Severity/Priority Logic
        priority = "Low"
        if any(w in text for w in ["fire", "spark", "danger", "accident", "emergency"]):
            priority = "Critical"
        elif any(w in text for w in ["blocked", "broken", "overflow"]):
            priority = "High"
        
        # Image impact (Mock)
        if image_url:
            # Assume images imply visual evidence of damage, slightly raising priority if low
            if priority == "Low":
                priority = "Medium"

        # Sentiment Logic
        sentiment = 0.0
        if any(w in text for w in ["angry", "frustrated", "worst", "useless", "urgent"]):
            sentiment = -0.8
        elif any(w in text for w in ["please", "kindly", "help"]):
            sentiment = 0.2
        
        # Summary
        summary = f"AI Summary: Issue related to {category} with {priority} priority."

        return {
            "category": category,
            "priority": priority,
            "sentiment_score": sentiment,
            "ai_summary": summary
        }

    @staticmethod
    def check_duplicates(text: str, existing_embeddings: list) -> bool:
        # Mock deduplication
        return False
