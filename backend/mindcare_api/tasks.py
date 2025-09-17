from celery import shared_task
from django.utils import timezone
from datetime import timedelta, datetime
import logging
from .models import User, ChatSession, WeeklyReport, Alert
from .services.emotion_service import EmotionDetectionService
from .services.alert_service import AlertService

logger = logging.getLogger(__name__)

@shared_task
def generate_weekly_reports():
    """Generate weekly reports for all active users"""
    try:
        # Get all active students
        students = User.objects.filter(role='student', is_active=True)
        
        # Calculate week range (Sunday to Saturday)
        today = timezone.now().date()
        days_since_sunday = today.weekday() + 1 if today.weekday() != 6 else 0
        week_start = today - timedelta(days=days_since_sunday)
        week_end = week_start + timedelta(days=6)
        
        emotion_service = EmotionDetectionService()
        alert_service = AlertService()
        
        reports_generated = 0
        
        for student in students:
            try:
                # Check if report already exists for this week
                existing_report = WeeklyReport.objects.filter(
                    user=student,
                    week_start=week_start
                ).first()
                
                if existing_report:
                    continue
                
                # Get sessions for the week
                sessions = ChatSession.objects.filter(
                    user=student,
                    session_start__date__range=[week_start, week_end]
                )
                
                if not sessions.exists():
                    continue
                
                # Calculate metrics
                total_sessions = sessions.count()
                stress_levels = [s.stress_level for s in sessions]
                stress_scores = {
                    'low': 0.2, 'moderate': 0.4, 'high': 0.7, 'critical': 1.0
                }
                avg_stress = sum(stress_scores.get(level, 0.2) for level in stress_levels) / len(stress_levels)
                
                # Analyze emotions
                emotion_analysis = emotion_service.analyze_weekly_emotions(student, week_start, week_end)
                
                # Determine risk assessment
                risk_assessment = 'low'
                if avg_stress >= 0.8:
                    risk_assessment = 'critical'
                elif avg_stress >= 0.6:
                    risk_assessment = 'high'
                elif avg_stress >= 0.4:
                    risk_assessment = 'moderate'
                
                # Generate summary
                summary = generate_weekly_summary(student, sessions, emotion_analysis, avg_stress)
                
                # Create report
                report = WeeklyReport.objects.create(
                    user=student,
                    week_start=week_start,
                    week_end=week_end,
                    total_sessions=total_sessions,
                    avg_stress_level=round(avg_stress, 2),
                    dominant_emotions=emotion_analysis,
                    summary=summary,
                    risk_assessment=risk_assessment
                )
                
                # Send report to guardian if configured
                if student.guardian_email:
                    alert_service.send_weekly_report(student, report)
                
                reports_generated += 1
                logger.info(f"Generated weekly report for user {student.id}")
                
            except Exception as e:
                logger.error(f"Error generating report for user {student.id}: {str(e)}")
                continue
        
        logger.info(f"Weekly report generation completed. Generated {reports_generated} reports.")
        return f"Generated {reports_generated} weekly reports"
        
    except Exception as e:
        logger.error(f"Error in weekly report generation task: {str(e)}")
        raise

def generate_weekly_summary(user, sessions, emotion_analysis, avg_stress):
    """Generate human-readable weekly summary"""
    try:
        total_sessions = sessions.count()
        
        # Stress level summary
        if avg_stress >= 0.8:
            stress_summary = "showed high levels of emotional distress"
        elif avg_stress >= 0.6:
            stress_summary = "experienced elevated stress levels"
        elif avg_stress >= 0.4:
            stress_summary = "had moderate stress indicators"
        else:
            stress_summary = "maintained relatively stable emotional well-being"
        
        # Emotion summary
        emotion_summary = ""
        if emotion_analysis and 'dominant_emotion' in emotion_analysis:
            dominant = emotion_analysis['dominant_emotion']
            emotion_summary = f" The most frequently detected emotion was {dominant}."
        
        # Activity summary
        if total_sessions >= 7:
            activity_summary = "engaged frequently with the mental health support system"
        elif total_sessions >= 3:
            activity_summary = "regularly used the mental health support resources"
        else:
            activity_summary = "had limited engagement with support resources"
        
        summary = f"This week, {user.first_name} {activity_summary} with {total_sessions} chat sessions and {stress_summary}.{emotion_summary}"
        
        # Add recommendations
        if avg_stress >= 0.7:
            summary += " Recommendation: Consider scheduling a counseling session for additional support."
        elif avg_stress >= 0.5:
            summary += " Recommendation: Continue monitoring and encourage use of coping strategies."
        else:
            summary += " Overall positive engagement with mental health resources."
        
        return summary
        
    except Exception as e:
        logger.error(f"Error generating weekly summary: {str(e)}")
        return f"Weekly summary for {total_sessions} sessions with average stress level of {avg_stress:.2f}."

@shared_task
def cleanup_old_sessions():
    """Clean up old inactive chat sessions"""
    try:
        # Mark sessions older than 24 hours as inactive
        cutoff_time = timezone.now() - timedelta(hours=24)
        
        updated_count = ChatSession.objects.filter(
            is_active=True,
            session_start__lt=cutoff_time
        ).update(
            is_active=False,
            session_end=timezone.now()
        )
        
        logger.info(f"Marked {updated_count} old sessions as inactive")
        return f"Cleaned up {updated_count} old sessions"
        
    except Exception as e:
        logger.error(f"Error in session cleanup task: {str(e)}")
        raise

@shared_task
def monitor_critical_stress_levels():
    """Monitor for users with consistently high stress levels"""
    try:
        # Look for users with multiple critical/high stress sessions in the last 3 days
        three_days_ago = timezone.now() - timedelta(days=3)
        
        high_stress_users = User.objects.filter(
            role='student',
            is_active=True,
            chat_sessions__stress_level__in=['high', 'critical'],
            chat_sessions__session_start__gte=three_days_ago
        ).distinct()
        
        alert_service = AlertService()
        alerts_sent = 0
        
        for user in high_stress_users:
            # Count high stress sessions in the last 3 days
            high_stress_count = user.chat_sessions.filter(
                stress_level__in=['high', 'critical'],
                session_start__gte=three_days_ago
            ).count()
            
            if high_stress_count >= 3:  # 3 or more high stress sessions
                # Check if we've already sent an alert recently
                recent_alert = Alert.objects.filter(
                    user=user,
                    alert_type='critical_stress',
                    created_at__gte=timezone.now() - timedelta(hours=48)
                ).exists()
                
                if not recent_alert:
                    alert = Alert.objects.create(
                        user=user,
                        alert_type='critical_stress',
                        message=f"Persistent high stress detected: {high_stress_count} high-stress sessions in the last 3 days."
                    )
                    
                    alert_service._send_alert_notifications(alert)
                    alerts_sent += 1
                    logger.info(f"Sent persistent stress alert for user {user.id}")
        
        logger.info(f"Stress monitoring completed. Sent {alerts_sent} alerts.")
        return f"Monitored stress levels, sent {alerts_sent} alerts"
        
    except Exception as e:
        logger.error(f"Error in stress monitoring task: {str(e)}")
        raise
