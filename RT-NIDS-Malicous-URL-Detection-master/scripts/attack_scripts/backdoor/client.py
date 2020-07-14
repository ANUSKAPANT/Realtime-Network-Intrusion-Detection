import paramiko
import threading

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('10.0.2.15', username='keshavchaurasia', password='Ncell_KES@134')
chan = client.get_transport().open_session()
chan.send('Hey i am connected :) ')
print chan.recv(1024)
client.close

9851148555