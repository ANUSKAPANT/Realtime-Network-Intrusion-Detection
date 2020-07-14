# path of the tcpdump
import os
import subprocess

tcpdump = '/usr/sbin/tcpdump'

class TcpDump:
    def __init__(self,pcap_file):
        self.pcap_file = pcap_file
        self.proc = None

        if not os.path.isfile(tcpdump):
            raise 'Cannot find tcpdump in ' + tcpdump

    def start(self,duration,iface):
        pargs = [tcpdump,'-i',iface,'-G',duration]
        pargs.extend(['-w',self.pcap_file])
        self.proc = subprocess.Popen(pargs)

    def stop(self):
        if self.proc != None and self.proc.poll() == None :
            self.proc.terminate()

    def read(self):
        proc = subprocess.Popen([tcpdump,'-r',self.pcap_file],stdout=subprocess.PIPE)
        return proc.communicate()[0]


if __name__ == "__main__":
    Dump = TcpDump("init.pcap")
    Dump.start("60","wlp2s0")
    Dump.stop()
    print(Dump.read())
