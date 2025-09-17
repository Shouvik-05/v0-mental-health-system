import openai
from django.conf import settings
import logging
import json
import re
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class EnhancedAIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
            'want to die', 'better off dead', 'no point living', 'end my life'
        ]
        
    def generate_response(self, user_message, session, user_context=None):
        """Generate enhanced AI response with context awareness"""
        try:
            # Check for crisis indicators first
            if self._detect_crisis(user_message):
                return self._get_crisis_response()
            
            # Get conversation context
            context = self._build_enhanced_context(session, user_context)
            
            # Generate contextual response
            response = self._call_openai_api(user_message, context, session)
            
            # Apply safety filters
            safe_response = self._apply_safety_filter(response)
            
            return safe_response
            
        except Exception as e:
            logger.error(f"Error in enhanced AI response generation: {str(e)}")
            return self._get_fallback_response()
    
    def _detect_crisis(self, message):
        """Detect crisis indicators in user message"""
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in self.crisis_keywords)
    
    def _get_crisis_response(self):
        """Return immediate crisis intervention response"""
        return """I'm very concerned about what you've shared. Your life has value and there are people who want to help you right now.

🚨 **Immediate Help Available:**
• **Crisis Text Line**: Text HOME to 741741
• **National Suicide Prevention Lifeline**: Call or text 988
• **Emergency Services**: Call 911

Please reach out to one of these resources immediately. You don't have to go through this alone. There are trained counselors available 24/7 who care about you and want to help.

Would you like me to help you find additional local resources or support?"""
    
    def _build_enhanced_context(self, session, user_context=None):
        """Build comprehensive context for AI response"""
        context = {
            'conversation_history': self._get_conversation_summary(session),
            'session_stress_level': session.stress_level,
            'user_emotions': self._get_recent_emotions(session),
            'session_duration': self._calculate_session_duration(session),
            'time_of_day': datetime.now().strftime('%H:%M'),
            'user_context': user_context or {}
        }
        return context
    
    def _get_conversation_summary(self, session):
        """Get summarized conversation history"""
        recent_messages = session.messages.order_by('-timestamp')[:10]
        summary = []
        
        for msg in reversed(recent_messages):
            role = "Student" if msg.sender == "user" else "Assistant"
            emotion_info = f" (emotion: {msg.emotion_detected})" if msg.emotion_detected else ""
            summary.append(f"{role}: {msg.message[:100]}...{emotion_info}")
        
        return "\n".join(summary[-6:])  # Last 6 exchanges
    
    def _get_recent_emotions(self, session):
        """Get recent emotional patterns"""
        recent_messages = session.messages.filter(
            sender='user',
            emotion_detected__isnull=False,
            timestamp__gte=datetime.now() - timedelta(minutes=30)
        )
        
        emotions = [msg.emotion_detected for msg in recent_messages]
        return emotions[-5:] if emotions else []
    
    def _calculate_session_duration(self, session):
        """Calculate how long the current session has been active"""
        if session.session_start:
            duration = datetime.now() - session.session_start.replace(tzinfo=None)
            return int(duration.total_seconds() / 60)  # minutes
        return 0
    
    def _call_openai_api(self, user_message, context, session):
        """Make enhanced API call to OpenAI"""
        system_prompt = self._build_system_prompt(context, session)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Current message: {user_message}"}
        ]
        
        # Add conversation context if available
        if context['conversation_history']:
            messages.insert(1, {
                "role": "system", 
                "content": f"Recent conversation context:\n{context['conversation_history']}"
            })
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=400,
            temperature=0.7,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )
        
        return response.choices[0].message.content.strip()
    
    def _build_system_prompt(self, context, session):
        """Build comprehensive system prompt"""
        base_prompt = """You are a compassionate AI mental health assistant specifically designed for college students. Your responses should be:

CORE PRINCIPLES:
• Empathetic and non-judgmental
• Supportive but not prescriptive
• Encouraging of professional help when appropriate
• Focused on immediate coping strategies
• Culturally sensitive and inclusive

RESPONSE GUIDELINES:
• Keep responses concise (2-3 paragraphs max)
• Offer practical, actionable advice
• Validate emotions and experiences
• Use warm, understanding language
• Suggest breathing exercises, grounding techniques, or mindfulness when appropriate

SAFETY PROTOCOLS:
• NEVER provide medical diagnoses or treatment recommendations
• NEVER suggest medication or dosage changes
• For crisis situations, immediately direct to emergency resources
• Encourage professional counseling for persistent issues
• Recognize your limitations as an AI

STUDENT-SPECIFIC FOCUS:
• Understand academic pressures and deadlines
• Be aware of common college stressors (exams, social issues, financial concerns)
• Offer study-life balance suggestions
• Acknowledge the unique challenges of student life"""

        # Add contextual information
        if context['session_stress_level'] in ['high', 'critical']:
            base_prompt += f"\n\nIMPORTANT: The student's current stress level is {context['session_stress_level']}. Be extra supportive and consider suggesting immediate coping strategies or professional resources."
        
        if context['user_emotions']:
            emotions_str = ', '.join(context['user_emotions'][-3:])
            base_prompt += f"\n\nRECENT EMOTIONS DETECTED: {emotions_str}. Acknowledge these feelings appropriately."
        
        if context['session_duration'] > 30:
            base_prompt += f"\n\nNOTE: This has been a longer conversation ({context['session_duration']} minutes). The student may be in significant distress. Consider suggesting a break or professional support."
        
        return base_prompt
    
    def _apply_safety_filter(self, response):
        """Apply safety filters to AI response"""
        # Check for inappropriate medical advice
        medical_flags = [
            'diagnose', 'prescription', 'medication', 'dosage', 'treatment plan',
            'cure', 'disorder', 'illness', 'disease', 'therapy session'
        ]
        
        response_lower = response.lower()
        if any(flag in response_lower for flag in medical_flags):
            logger.warning("Medical advice detected in AI response, using fallback")
            return self._get_fallback_response()
        
        # Check response length and quality
        if len(response) < 20 or len(response) > 1000:
            logger.warning("Response length outside acceptable range")
            return self._get_fallback_response()
        
        return response
    
    def _get_fallback_response(self):
        """Return safe fallback response"""
        fallback_responses = [
            "I understand you're going through a difficult time right now. It's completely normal to feel overwhelmed sometimes. Would you like to try a simple breathing exercise together? Just breathe in slowly for 4 counts, hold for 4, then breathe out for 4.",
            
            "Thank you for sharing what's on your mind. It takes courage to reach out when you're struggling. Remember that you're not alone in this - many students face similar challenges. What's one small thing that usually helps you feel a bit better?",
            
            "I hear that you're dealing with something challenging right now. Sometimes when we're stressed, it can help to focus on what we can control in this moment. Is there something specific that's been weighing on your mind that you'd like to talk through?",
            
            "It sounds like you're carrying a lot right now. That's really hard, and your feelings are completely valid. Sometimes it helps to take things one step at a time. What feels like the most pressing thing you're dealing with today?"
        ]
        
        import random
        return random.choice(fallback_responses)
    
    def generate_coping_strategy(self, emotion, stress_level):
        """Generate specific coping strategies based on emotion and stress level"""
        strategies = {
            'anxiety': [
                "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
                "Practice box breathing: Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 5 times.",
                "Write down your worries, then ask yourself: 'Is this something I can control right now?' Focus only on what you can influence."
            ],
            'sadness': [
                "It's okay to feel sad - emotions are temporary visitors. Try doing one small thing that usually brings you comfort.",
                "Consider reaching out to a friend or family member. Connection can help when we're feeling down.",
                "Gentle movement like a short walk or stretching can sometimes help shift our mood naturally."
            ],
            'anger': [
                "When anger feels overwhelming, try counting to 10 slowly or taking 5 deep breaths before responding.",
                "Physical activity can help release angry energy - try doing jumping jacks or going for a quick walk.",
                "Write down what's making you angry without censoring yourself, then tear up the paper when you're done."
            ],
            'fear': [
                "Fear often comes from uncertainty. Try writing down what specifically you're afraid of, then what you know to be true right now.",
                "Use progressive muscle relaxation: tense and then relax each muscle group from your toes to your head.",
                "Remind yourself of times you've overcome challenges before. You have more strength than you realize."
            ]
        }
        
        emotion_strategies = strategies.get(emotion.lower(), strategies['anxiety'])
        
        if stress_level in ['high', 'critical']:
            return f"Since you're feeling quite overwhelmed right now, let's try this: {emotion_strategies[0]} If this doesn't help, please consider reaching out to a counselor or trusted friend."
        else:
            import random
            return random.choice(emotion_strategies)
