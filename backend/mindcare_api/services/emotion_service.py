from transformers import pipeline
import torch
from django.conf import settings
import logging
from collections import Counter

logger = logging.getLogger(__name__)

class EmotionDetectionService:
    def __init__(self):
        try:
            # Load the emotion detection model
            self.emotion_classifier = pipeline(
                "text-classification",
                model="bhadresh-savani/distilbert-base-uncased-emotion",
                device=0 if torch.cuda.is_available() else -1
            )
        except Exception as e:
            logger.error(f"Error loading emotion model: {str(e)}")
            self.emotion_classifier = None
    
    def detect_emotion(self, text):
        """Detect emotion in text and return emotion with confidence"""
        if not self.emotion_classifier or not text.strip():
            return None
            
        try:
            result = self.emotion_classifier(text)
            if result:
                emotion = result[0]['label'].lower()
                confidence = result[0]['score']
                return {
                    'emotion': emotion,
                    'confidence': round(confidence, 2)
                }
        except Exception as e:
            logger.error(f"Error detecting emotion: {str(e)}")
        
        return None
    
    def calculate_session_stress(self, session):
        """Calculate overall stress level for a chat session"""
        try:
            messages = session.messages.filter(sender='user', emotion_detected__isnull=False)
            
            if not messages.exists():
                return 'low'
            
            # Define stress weights for different emotions
            stress_weights = {
                'sadness': 0.7,
                'anger': 0.8,
                'fear': 0.9,
                'disgust': 0.6,
                'surprise': 0.3,
                'joy': 0.1,
                'love': 0.1,
                'anxiety': 0.8,
                'depression': 0.9,
                'stress': 0.8
            }
            
            # Calculate weighted average stress
            total_weight = 0
            total_score = 0
            
            for message in messages:
                emotion = message.emotion_detected.lower()
                confidence = float(message.emotion_confidence or 0)
                weight = stress_weights.get(emotion, 0.5)
                
                total_score += weight * confidence
                total_weight += confidence
            
            if total_weight == 0:
                return 'low'
            
            avg_stress = total_score / total_weight
            
            # Convert to stress level categories
            if avg_stress >= settings.STRESS_THRESHOLD_CRITICAL:
                return 'critical'
            elif avg_stress >= settings.STRESS_THRESHOLD_HIGH:
                return 'high'
            elif avg_stress >= settings.STRESS_THRESHOLD_MODERATE:
                return 'moderate'
            else:
                return 'low'
                
        except Exception as e:
            logger.error(f"Error calculating session stress: {str(e)}")
            return 'low'
    
    def analyze_weekly_emotions(self, user, week_start, week_end):
        """Analyze emotions for a user over a week period"""
        from ..models import ChatMessage
        
        try:
            messages = ChatMessage.objects.filter(
                session__user=user,
                sender='user',
                timestamp__date__range=[week_start, week_end],
                emotion_detected__isnull=False
            )
            
            if not messages.exists():
                return {}
            
            # Count emotions
            emotions = [msg.emotion_detected.lower() for msg in messages]
            emotion_counts = Counter(emotions)
            
            # Calculate percentages
            total_messages = len(emotions)
            emotion_percentages = {
                emotion: round((count / total_messages) * 100, 1)
                for emotion, count in emotion_counts.items()
            }
            
            return {
                'dominant_emotion': emotion_counts.most_common(1)[0][0],
                'emotion_distribution': emotion_percentages,
                'total_analyzed_messages': total_messages
            }
            
        except Exception as e:
            logger.error(f"Error analyzing weekly emotions: {str(e)}")
            return {}
