from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

def build_mime_message(
    mail_from: str,
    mail_to: str,
    subject: str,
    html_content: str,
    mime_subtype: str = 'mixed',
    mime_charset: str = 'utf-8'):
    """
    Build a MIME message that can be used to send an email and
    returns full list of recipients.

    :param mail_from: Email address to set as the email's from
    :param mail_to: Email address to set as the email's to
    :param subject: Subject of email
    :param html_content: HTML content of email
    :param mime_subtype: Can be used to specify the subtype of the message. Default = mixed
    :param mime_charset: Email's charset. Default = UTF-8.
    :return: Email as MIMEMultipart object
    """
    mime_msg = MIMEMultipart(mime_subtype)
    mime_msg['Subject'] = subject
    mime_msg['From'] = mail_from
    mime_msg['To'] = mail_to

    mime_text = MIMEText(html_content, 'html', mime_charset)
    mime_msg.attach(mime_text)

    return mime_msg


def send_mime_email(
        mime_msg: MIMEMultipart,
        mail_from: str,
        mail_to: str,
        smtp_host: str,
        smtp_port: int,
        smtp_user: str,
        smtp_password: str,
        use_ssl: bool = True
    ):
    """
    Send an email using the provided MIME message.

    :param mime_msg: MIME message to send
    :param mail_from: Email address to set as the email's from
    :param mail_to: Email address to set as the email's to
    :param smtp_host: SMTP server to use
    :param smtp_port: SMTP port to use
    :param smtp_user: SMTP user to use
    :param smtp_password: SMTP password to use
    :param use_ssl: Use SSL to connect to SMTP server
    """

    if use_ssl:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port)
    if smtp_user and smtp_password:
        server.login(smtp_user, smtp_password)
    server.sendmail(mail_from, mail_to, mime_msg.as_string())
    server.quit()
