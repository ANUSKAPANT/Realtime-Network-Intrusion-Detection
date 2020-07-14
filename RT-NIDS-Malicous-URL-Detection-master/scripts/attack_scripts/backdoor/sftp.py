import paramiko
import threading

def ftp(local_path,name):
  transport = paramiko.Transport(('27.111.29.153', 22))
  transport.connect(username = 'pa', password = 'FAujJPp_^rYs')
  sftp = paramiko.SFTPClient.from_transport(transport)
  sftp.put(local_path, name)
  sftp.close()
  transport.close()
  return '[+] Done'

if __name__=="__main__":
  ftp("a.png","/root/pa/palo")