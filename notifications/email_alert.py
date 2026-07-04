import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")


def send_email_alert(root_cause, confidence, action, recovery_status):
    """
    Send an email alert when an anomaly is detected.
    """

    subject = "🚨 AutoHeal-AI Alert"

    body = f"""
AutoHeal-AI has detected an anomaly.

Root Cause:
{root_cause}

Confidence:
{confidence}%

Recommended Action:
{action}

Recovery Status:
{recovery_status}

Please check the AutoHeal-AI dashboard for more details.
"""

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = EMAIL_ADDRESS
    message["To"] = RECEIVER_EMAIL

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(message)

        print("✅ Email Alert Sent Successfully!")

    except Exception as e:
        print("❌ Failed to send email:", e)