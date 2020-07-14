from ftplib import FTP

ftp = FTP('')
ftp.connect('27.111.29.153',8000)
ftp.login('root','?Ksp$cvH(3m(_MLS_Firewall')
# ftp.cwd('../../Desktop/test') #replace with your directory
# ftp.cwd('') #replace with your directory
# ftp.retrlines('LIST')

def uploadFile():
 filename = 'a.png' #replace with your file in your home folder
 ftp.storbinary('STOR '+filename, open(filename, 'rb'))
 ftp.quit()

def downloadFile():
 filename = 'testfile.txt' #replace with your file in the directory ('directory_name')
 localfile = open(filename, 'wb')
 ftp.retrbinary('RETR ' + filename, localfile.write, 1024)
 ftp.quit()
 localfile.close()

uploadFile()
#downloadFile()