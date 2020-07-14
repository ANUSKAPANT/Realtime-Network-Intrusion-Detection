import smtplib, ssl

port = 465  # For SSL
smtp_server = "smtp.gmail.com"
sender_email = "keshav.chaurasia1995@gmail.com"  # Enter your address
receiver_email = ["simran.st1197@gmail.com","bibekacemagar@gmail.com","keshavcha691@gmail.com","072bex423.keshav@pcampus.edu.np"] # Enter receiver address
password = "Xperia_KES@134"
message = """\
Subject: Hi there

Nice to mmet you!! 
This message is sent from Python."""

context = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, message)