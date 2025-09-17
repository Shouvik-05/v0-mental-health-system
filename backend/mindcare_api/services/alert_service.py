from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client

logger = logging.getLogger(__name__)

class AlertService:
    def __init__(self):
        self.sendgrid_client = SendGridAPIClient(settings.SENDGRID_API_KEY) if settings.SENDGRID_API_KEY else None
        self.twilio_client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN) if settings.TWILIO_ACCOUNT_SID else None
    
    def check_and_send_alert(self, user, session):
        """Check if alert should be sent and send if necessary"""
        from ..models import Alert
        
        try:
            # Check if we've sent an alert recently (cooldown period)
            cooldown_time = timezone.now() - timedelta(hours=settings.ALERT_COOLDOWN_HOURS)
            recent_alert = Alert.objects.filter(
                user=user,
                alert_type='critical_stress',
                created_at__gte=cooldown_time
            ).exists()
            
            if recent_alert:
                logger.info(f"Alert cooldown active for user {user.id}")
                return None
            
            # Create alert
            alert = Alert.objects.create(
                user=user,
                alert_type='critical_stress',
                message=f"High emotional distress detected in recent chat session. Stress level: {session.stress_level}"
            )
            
            # Send notifications
            self._send_alert_notifications(alert)
            
            return alert
            
        except Exception as e:
            logger.error(f"Error checking/sending alert: {str(e)}")
            return None
    
    def send_emergency_alert(self, user, message=""):
        """Send immediate emergency alert"""
        from ..models import Alert
        
        try:
            alert = Alert.objects.create(
                user=user,
                alert_type='emergency',
                message=f"EMERGENCY: {message}" if message else "Emergency alert triggered by user"
            )
            
            self._send_alert_notifications(alert, is_emergency=True)
            return alert
            
        except Exception as e:
            logger.error(f"Error sending emergency alert: {str(e)}")
            raise
    
    def send_weekly_report(self, user, report):
        """Send weekly report to guardian"""
        from ..models import Alert
        
        try:
            alert = Alert.objects.create(
                user=user,
                alert_type='weekly_report',
                message=f"Weekly mental health report for {user.get_full_name()}"
            )
            
            self._send_weekly_report_email(alert, report)
            return alert
            
        except Exception as e:
            logger.error(f"Error sending weekly report: {str(e)}")
            return None
    
    def _send_alert_notifications(self, alert, is_emergency=False):
        """Send alert via email and SMS"""
        user = alert.user
        
        # Send email to guardian
        if user.guardian_email and self.sendgrid_client:
            try:
                subject = "🚨 URGENT: Mental Health Alert" if is_emergency else "⚠️ Mental Health Alert"
                self._send_email(
                    to_email=user.guardian_email,
                    subject=subject,
                    content=self._format_alert_email(alert, is_emergency)
                )
                alert.sent_via_email = True
                alert.sent_to_guardian = True
            except Exception as e:
                logger.error(f"Error sending alert email: {str(e)}")
        
        # Send SMS to guardian
        if user.guardian_phone and self.twilio_client:
            try:
                message_body = self._format_alert_sms(alert, is_emergency)
                self._send_sms(user.guardian_phone, message_body)
                alert.sent_via_sms = True
                alert.sent_to_guardian = True
            except Exception as e:
                logger.error(f"Error sending alert SMS: {str(e)}")
        
        # Update alert status
        alert.status = 'sent' if (alert.sent_via_email or alert.sent_via_sms) else 'failed'
        alert.sent_at = timezone.now()
        alert.save()
    
    def _send_email(self, to_email, subject, content):
        """Send email using SendGrid"""
        message = Mail(
            from_email='noreply@mindcare.edu',
            to_emails=to_email,
            subject=subject,
            html_content=content
        )
        
        response = self.sendgrid_client.send(message)
        return response.status_code == 202
    
    def _send_sms(self, to_phone, message_body):
        """Send SMS using Twilio"""
        message = self.twilio_client.messages.create(
            body=message_body,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to_phone
        )
        return message.sid
    
    def _format_alert_email(self, alert, is_emergency=False):
        """Format alert email content"""
        user = alert.user
        urgency = "URGENT - IMMEDIATE ATTENTION REQUIRED" if is_emergency else "Attention Required"
        
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: {'#dc2626' if is_emergency else '#ea580c'};">{urgency}</h2>
                
                <p>Dear Guardian,</p>
                
                <p>This is an automated alert from the MindCare Mental Health System regarding <strong>{user.get_full_name()}</strong>.</p>
                
                <div style="background-color: {'#fef2f2' if is_emergency else '#fff7ed'}; border-left: 4px solid {'#dc2626' if is_emergency else '#ea580c'}; padding: 15px; margin: 20px 0;">
                    <p><strong>Alert Details:</strong></p>
                    <p>{alert.message}</p>
                    <p><strong>Time:</strong> {alert.created_at.strftime('%Y-%m-%d %H:%M:%S')}</p>
                </div>
                
                {'<p style="color: #dc2626; font-weight: bold;">If this is a life-threatening emergency, please call 911 immediately.</p>' if is_emergency else ''}
                
                <p><strong>Recommended Actions:</strong></p>
                <ul>
                    <li>Reach out to {user.first_name} with care and understanding</li>
                    <li>Consider scheduling a counseling session</li>
                    <li>Monitor their well-being closely</li>
                    {'<li>Seek immediate professional help if needed</li>' if is_emergency else ''}
                </ul>
                
                <p>For immediate crisis support, contact:</p>
                <ul>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                    <li><strong>Emergency Services:</strong> 911</li>
                </ul>
                
                <p>This alert was generated automatically based on concerning patterns detected in the student's interactions with our mental health support system.</p>
                
                <p>Best regards,<br>MindCare Mental Health System</p>
            </div>
        </body>
        </html>
        """
    
    def _format_alert_sms(self, alert, is_emergency=False):
        """Format alert SMS content"""
        user = alert.user
        prefix = "🚨 URGENT" if is_emergency else "⚠️ ALERT"
        
        return f"{prefix}: Mental health concern detected for {user.first_name}. {alert.message} Please check in with them. For crisis: call 988. -MindCare"
    
    def _send_weekly_report_email(self, alert, report):
        """Send weekly report email"""
        user = alert.user
        
        if not user.guardian_email or not self.sendgrid_client:
            return
        
        content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0891b2;">Weekly Mental Health Report</h2>
                
                <p>Dear Guardian,</p>
                
                <p>Here is the weekly mental health summary for <strong>{user.get_full_name()}</strong> for the week of {report.week_start} to {report.week_end}.</p>
                
                <div style="background-color: #f0f9ff; border-left: 4px solid #0891b2; padding: 15px; margin: 20px 0;">
                    <h3>Summary</h3>
                    <p><strong>Total Chat Sessions:</strong> {report.total_sessions}</p>
                    <p><strong>Average Stress Level:</strong> {report.avg_stress_level or 'N/A'}</p>
                    <p><strong>Risk Assessment:</strong> {report.risk_assessment.title()}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3>Weekly Summary</h3>
                    <p>{report.summary or 'No specific concerns noted this week.'}</p>
                </div>
                
                <p>This report is generated automatically to keep you informed about your student's mental health engagement. If you have any concerns, please don't hesitate to reach out.</p>
                
                <p>Best regards,<br>MindCare Mental Health System</p>
            </div>
        </body>
        </html>
        """
        
        try:
            self._send_email(
                to_email=user.guardian_email,
                subject=f"Weekly Mental Health Report - {user.get_full_name()}",
                content=content
            )
            alert.sent_via_email = True
            alert.sent_to_guardian = True
            alert.status = 'sent'
            alert.sent_at = timezone.now()
            alert.save()
        except Exception as e:
            logger.error(f"Error sending weekly report email: {str(e)}")
            alert.status = 'failed'
            alert.save()
