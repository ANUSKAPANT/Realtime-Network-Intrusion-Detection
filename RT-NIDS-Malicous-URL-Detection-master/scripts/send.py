import pika
import sys
import os    
import time
import pyshark
from time import sleep


class PcapCapture:
    def __init__(self,interface_name,output_file):
        self.capture = None
        self.interface = interface_name
        self.output_file = output_file
    
    def start(self,packet_count=200):
        print("*** starting packet capture *** ")
        self.capture = pyshark.LiveCapture(interface=self.interface,output_file=self.output_file)
        self.capture.sniff(packet_count=packet_count)
    
    def stop(self):
        print("*** stopping packet capture *** ")
        self.capture.close()

# lan interface = enx00e04c3606db

if __name__ == "__main__":

    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    channel.exchange_declare(exchange='logs',exchange_type='fanout')

    while True:
        # check starting time
        start = time.process_time()
        timestr = time.strftime("%Y%m%d-%H%M%S")

        # sniff live packet    
        filename = f"dump-{timestr}.pcap"
        # cap = PcapCapture(interface_name='enx00e04c3606db',output_file=filename)
        cap = PcapCapture(interface_name='enx00e04c3606db',output_file=filename)
        cap.start()
        cap.stop()
        sleep(2)
        filename = str(''.join(filename))
        channel.basic_publish(exchange='logs',routing_key='',body=filename)
        print(f"[x] sent {filename}")
        
        # your code here    
        print(time.process_time() - start)
    connection.close()

    


