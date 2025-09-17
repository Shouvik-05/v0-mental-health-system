import openai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    def generate_response(self, user_message, session):
        """Generate AI response for mental health support"""
        try:
            # Get conversation context
            recent_messages = session.messages.order_by('-timestamp')[:10]
            context = self._build_context(recent_messages)
            
            # System prompt for mental health support
            system_prompt = """You are a compassionate AI mental health assistant for college students. 
            Your role is to provide supportive, empathetic responses while following these guidelines:
            
            1. Always be supportive and non-judgmental
            2. Provide practical coping strategies when appropriate
            3. Encourage professional help for serious issues
            4. Never provide medical diagnoses or prescriptions
            5. If someone mentions self-harm or suicide, immediately encourage them to seek emergency help
            6. Keep responses concise but caring
            7. Use a warm, understanding tone
            
            Remember: You are here to support, not replace professional mental health care."""
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Context: {context}\n\nCurrent message: {user_message}"}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            # Safety check - ensure response is appropriate
            if self._is_safe_response(ai_response):
                return ai_response
            else:
                return self._get_fallback_response()
                
        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return self._get_fallback_response()
    
    def _build_context(self, recent_messages):
        """Build conversation context from recent messages"""
        context_parts = []
        for msg in reversed(recent_messages):
            role = "Student" if msg.sender == "user" else "Assistant"
            context_parts.append(f"{role}: {msg.message}")
        return "\n".join(context_parts[-6:])  # Last 6 messages for context
    
    def _is_safe_response(self, response):
        """Check if AI response is safe and appropriate"""
        unsafe_keywords = [
            'diagnose', 'prescription', 'medication', 'cure', 'treatment plan'
        ]
        response_lower = response.lower()
        return not any(keyword in response_lower for keyword in unsafe_keywords)
    
    def _get_fallback_response(self):
        """Return a safe fallback response"""
        fallback_responses = [
            "I understand this is a difficult time for you. Sometimes it helps to take a few deep breaths and remember that you're not alone in this.",
            "It sounds like you're going through something challenging. Would you like to try a grounding exercise together?",
            "I hear that you're struggling right now. Remember that it's okay to feel this way, and there are people who want to help you.",
            "Thank you for sharing that with me. It takes courage to talk about difficult feelings. How are you taking care of yourself today?"
        ]
        import random
        return random.choice(fallback_responses)
