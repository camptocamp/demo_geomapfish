import smtplib
from email.message import EmailMessage
from email.utils import formatdate


def send_mail(mail_list, text, subject):
    msg = EmailMessage()
    msg["From"] = "sitn@ne.ch"
    msg["To"] = ", ".join(mail_list)
    msg["Date"] = formatdate(localtime=True)
    msg["Subject"] = subject
    msg.set_content(text)
    s = smtplib.SMTP("smtp.ne.ch")
    s.send_message(msg)
    s.quit()
