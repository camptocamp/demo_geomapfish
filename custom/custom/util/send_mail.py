import smtplib
from email.message import EmailMessage
from email.utils import formatdate


def send_mail(mail_list: list[str], text: str, subject: str) -> None:
    msg = EmailMessage()
    msg["From"] = "info@camptocamp.ch"
    msg["To"] = ", ".join(mail_list)
    msg["Date"] = formatdate(localtime=True)
    msg["Subject"] = subject
    msg.set_content(text)
    s = smtplib.SMTP("smtp.camptocamp.ch")
    s.send_message(msg)
    s.quit()
