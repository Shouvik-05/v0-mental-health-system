from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    User, ChatSession, ChatMessage, Booking, WeeklyReport, 
    Alert, Resource, SupportGroup, GroupMembership, PeerPost
)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone', 'guardian_email', 'guardian_phone',
            'emergency_contact_name', 'emergency_contact_phone',
            'password', 'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            data['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return data

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            'id', 'sender', 'message', 'emotion_detected', 
            'emotion_confidence', 'timestamp', 'is_flagged'
        ]

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = ChatSession
        fields = [
            'id', 'session_start', 'session_end', 'overall_emotion',
            'stress_level', 'session_summary', 'is_active', 'messages'
        ]

class BookingSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    counselor_name = serializers.CharField(source='counselor.get_full_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'student', 'counselor', 'appointment_date', 'appointment_time',
            'duration_minutes', 'status', 'notes', 'student_name', 'counselor_name',
            'created_at', 'updated_at'
        ]

class WeeklyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyReport
        fields = [
            'id', 'week_start', 'week_end', 'total_sessions',
            'avg_stress_level', 'dominant_emotions', 'summary',
            'risk_assessment', 'created_at'
        ]

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'id', 'alert_type', 'message', 'sent_to_guardian',
            'sent_via_email', 'sent_via_sms', 'status',
            'created_at', 'sent_at'
        ]

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            'id', 'title', 'description', 'resource_type',
            'content_url', 'language', 'category', 'tags',
            'is_active', 'created_at'
        ]

class SupportGroupSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportGroup
        fields = [
            'id', 'name', 'description', 'category',
            'is_active', 'created_at', 'member_count'
        ]
    
    def get_member_count(self, obj):
        return obj.memberships.filter(is_active=True).count()

class PeerPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = PeerPost
        fields = [
            'id', 'content', 'is_anonymous', 'emotion_tag',
            'created_at', 'is_flagged', 'author_name'
        ]
    
    def get_author_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.user.get_full_name() or obj.user.username

class GroupMembershipSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    
    class Meta:
        model = GroupMembership
        fields = ['id', 'group', 'group_name', 'joined_at', 'is_active']
