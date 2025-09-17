from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils import timezone
from django.db.models import Q, Avg, Count
from datetime import datetime, timedelta
import logging

from .models import (
    User, ChatSession, ChatMessage, Booking, WeeklyReport,
    Alert, Resource, SupportGroup, GroupMembership, PeerPost
)
from .serializers import (
    UserSerializer, LoginSerializer, ChatSessionSerializer, ChatMessageSerializer,
    BookingSerializer, WeeklyReportSerializer, AlertSerializer, ResourceSerializer,
    SupportGroupSerializer, PeerPostSerializer, GroupMembershipSerializer
)
from .services.ai_service import AIService
from .services.emotion_service import EmotionDetectionService
from .services.alert_service import AlertService

logger = logging.getLogger(__name__)

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """Register a new user"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Login user and return token"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout(request):
    """Logout user by deleting token"""
    try:
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'})
    except:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# Chat Views
class ChatSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSessionSerializer
    
    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ChatSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatSessionSerializer
    
    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

@api_view(['POST'])
def send_message(request, session_id):
    """Send a message in a chat session and get AI response"""
    try:
        session = ChatSession.objects.get(id=session_id, user=request.user)
        user_message = request.data.get('message', '')
        
        if not user_message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save user message
        user_msg = ChatMessage.objects.create(
            session=session,
            sender='user',
            message=user_message
        )
        
        # Detect emotion in user message
        emotion_service = EmotionDetectionService()
        emotion_result = emotion_service.detect_emotion(user_message)
        
        if emotion_result:
            user_msg.emotion_detected = emotion_result['emotion']
            user_msg.emotion_confidence = emotion_result['confidence']
            user_msg.save()
        
        # Generate AI response
        ai_service = AIService()
        bot_response = ai_service.generate_response(user_message, session)
        
        # Save bot message
        bot_msg = ChatMessage.objects.create(
            session=session,
            sender='bot',
            message=bot_response
        )
        
        # Update session stress level based on conversation
        stress_level = emotion_service.calculate_session_stress(session)
        session.stress_level = stress_level
        session.save()
        
        # Check if alert is needed
        if stress_level in ['high', 'critical']:
            alert_service = AlertService()
            alert_service.check_and_send_alert(request.user, session)
        
        return Response({
            'user_message': ChatMessageSerializer(user_msg).data,
            'bot_message': ChatMessageSerializer(bot_msg).data,
            'session_stress_level': stress_level
        })
        
    except ChatSession.DoesNotExist:
        return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error in send_message: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Booking Views
class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'counselor':
            return Booking.objects.filter(counselor=self.request.user)
        return Booking.objects.filter(student=self.request.user)
    
    def perform_create(self, serializer):
        if self.request.user.role == 'student':
            serializer.save(student=self.request.user)
        else:
            serializer.save()

class BookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'counselor':
            return Booking.objects.filter(counselor=self.request.user)
        return Booking.objects.filter(student=self.request.user)

# Resource Views
class ResourceListView(generics.ListAPIView):
    serializer_class = ResourceSerializer
    
    def get_queryset(self):
        queryset = Resource.objects.filter(is_active=True)
        category = self.request.query_params.get('category')
        resource_type = self.request.query_params.get('type')
        language = self.request.query_params.get('language', 'en')
        
        if category:
            queryset = queryset.filter(category=category)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        if language:
            queryset = queryset.filter(language=language)
            
        return queryset

# Support Group Views
class SupportGroupListView(generics.ListAPIView):
    serializer_class = SupportGroupSerializer
    queryset = SupportGroup.objects.filter(is_active=True)

class GroupMembershipListCreateView(generics.ListCreateAPIView):
    serializer_class = GroupMembershipSerializer
    
    def get_queryset(self):
        return GroupMembership.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PeerPostListCreateView(generics.ListCreateAPIView):
    serializer_class = PeerPostSerializer
    
    def get_queryset(self):
        group_id = self.request.query_params.get('group_id')
        if group_id:
            return PeerPost.objects.filter(group_id=group_id, is_flagged=False)
        return PeerPost.objects.filter(is_flagged=False)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Dashboard and Analytics Views
@api_view(['GET'])
def user_dashboard(request):
    """Get user dashboard data"""
    user = request.user
    
    # Recent chat sessions
    recent_sessions = ChatSession.objects.filter(user=user).order_by('-session_start')[:5]
    
    # Upcoming bookings
    upcoming_bookings = Booking.objects.filter(
        student=user,
        appointment_date__gte=timezone.now().date(),
        status='scheduled'
    ).order_by('appointment_date', 'appointment_time')[:3]
    
    # Weekly stress trend
    week_ago = timezone.now() - timedelta(days=7)
    stress_data = ChatSession.objects.filter(
        user=user,
        session_start__gte=week_ago
    ).values('stress_level').annotate(count=Count('id'))
    
    # Support groups
    user_groups = GroupMembership.objects.filter(user=user, is_active=True)
    
    return Response({
        'recent_sessions': ChatSessionSerializer(recent_sessions, many=True).data,
        'upcoming_bookings': BookingSerializer(upcoming_bookings, many=True).data,
        'stress_trend': list(stress_data),
        'support_groups': GroupMembershipSerializer(user_groups, many=True).data,
        'total_sessions': ChatSession.objects.filter(user=user).count(),
        'total_bookings': Booking.objects.filter(student=user).count(),
    })

@api_view(['GET'])
def weekly_report(request):
    """Get user's latest weekly report"""
    try:
        report = WeeklyReport.objects.filter(user=request.user).latest('week_start')
        return Response(WeeklyReportSerializer(report).data)
    except WeeklyReport.DoesNotExist:
        return Response({'message': 'No weekly report available'}, status=status.HTTP_404_NOT_FOUND)

# Emergency and Crisis Views
@api_view(['POST'])
def emergency_alert(request):
    """Trigger emergency alert"""
    try:
        alert_service = AlertService()
        alert = alert_service.send_emergency_alert(request.user, request.data.get('message', ''))
        return Response(AlertSerializer(alert).data)
    except Exception as e:
        logger.error(f"Error sending emergency alert: {str(e)}")
        return Response({'error': 'Failed to send alert'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Counselor-specific views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def counselor_dashboard(request):
    """Dashboard for counselors"""
    if request.user.role != 'counselor':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    today = timezone.now().date()
    
    # Today's appointments
    today_bookings = Booking.objects.filter(
        counselor=request.user,
        appointment_date=today,
        status='scheduled'
    ).order_by('appointment_time')
    
    # This week's appointments
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    week_bookings = Booking.objects.filter(
        counselor=request.user,
        appointment_date__range=[week_start, week_end]
    ).count()
    
    # High-risk students (those with recent critical stress levels)
    high_risk_sessions = ChatSession.objects.filter(
        stress_level='critical',
        session_start__gte=timezone.now() - timedelta(days=7)
    ).select_related('user').distinct('user')
    
    return Response({
        'today_appointments': BookingSerializer(today_bookings, many=True).data,
        'week_appointment_count': week_bookings,
        'high_risk_students': [
            {
                'id': session.user.id,
                'name': session.user.get_full_name(),
                'last_session': session.session_start,
                'stress_level': session.stress_level
            }
            for session in high_risk_sessions
        ]
    })
