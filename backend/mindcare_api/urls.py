from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# API URL patterns
urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Chat
    path('chat/sessions/', views.ChatSessionListCreateView.as_view(), name='chat-sessions'),
    path('chat/sessions/<int:pk>/', views.ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('chat/sessions/<int:session_id>/message/', views.send_message, name='send-message'),
    
    # Bookings
    path('bookings/', views.BookingListCreateView.as_view(), name='bookings'),
    path('bookings/<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    
    # Resources
    path('resources/', views.ResourceListView.as_view(), name='resources'),
    
    # Support Groups
    path('groups/', views.SupportGroupListView.as_view(), name='support-groups'),
    path('groups/memberships/', views.GroupMembershipListCreateView.as_view(), name='group-memberships'),
    path('groups/posts/', views.PeerPostListCreateView.as_view(), name='peer-posts'),
    
    # Dashboard
    path('dashboard/', views.user_dashboard, name='user-dashboard'),
    path('dashboard/counselor/', views.counselor_dashboard, name='counselor-dashboard'),
    path('reports/weekly/', views.weekly_report, name='weekly-report'),
    
    # Emergency
    path('emergency/alert/', views.emergency_alert, name='emergency-alert'),
]
