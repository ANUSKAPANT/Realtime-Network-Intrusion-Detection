from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from .models import TrafficLog
from django.db.models import Avg,Count,Min,Sum
from django.contrib import messages as msg
#import pandas as pd
import os
import json
import csv
# Create your views here.
'''datasets=[]
with open('netapp/datasets/wlan2.pcap_Flow.csv','r') as csvfile:
  file_rows=csv.reader(csvfile)
  for row in file_rows:
    datasets.append(row)
  index=0
  for row in datasets:
    if index!=0 and index<100:
      dt=row[6].split(" ")
      date=dt[0].split("/")
      ndate=date[2]+"-"+date[1]+"-"+date[0]
      time=dt[1].split(":")
      if dt[2]=='PM':
        time[0]=str(int(time[0])+12)
      ntime=time[0]+":"+time[1]+":"+time[2]
      new_dt=ndate+" "+ntime
      log=TrafficLog(flow_id = row[0],src_ip = row[1], src_port = int(row[2]),
        dst_ip = row[3],dst_port = int(row[4]),protocol = int(row[5]),
        timestamp = new_dt,flow_duration = float(row[7]),
        tot_fwd_pkts = float(row[8]),tot_bwd_pkts = float(row[9]),totlen_fwd_pkts = float(row[10]),
        totlen_bwd_pkts = float(row[11]),fwd_pkt_len_max = float(row[12]),fwd_pkt_len_min = float(row[13]),
        fwd_pkt_len_mean = float(row[14]),fwd_pkt_len_std = float(row[15]),bwd_pkt_len_max = float(row[16]),
        bwd_pkt_len_min = float(row[17]),bwd_pkt_len_mean = float(row[18]),bwd_pkt_len_std = float(row[19]),
        flow_byts_per_s = row[20],flow_pkts_per_s = row[21],flow_iat_mean = float(row[22]),
        flow_iat_std = row[23],    flow_iat_max = row[24],flow_iat_min = row[25],
        fwd_iat_tot = row[26],fwd_iat_mean = row[27],fwd_iat_std = row[28],
        fwd_iat_max = row[29],fwd_iat_min = row[30],bwd_iat_tot = row[31],bwd_iat_mean = row[32],
        bwd_iat_std = row[33],bwd_iat_max = row[34],bwd_iat_min = row[35],fwd_psh_flags = row[36],
        bwd_psh_flags = row[37],fwd_urg_flags = row[38],bwd_urg_flags = row[39],
        fwd_header_len = row[40],bwd_header_len = row[41],fwd_pkts_per_s = row[42],
        bwd_pkts_per_s = row[43],pkt_len_min = row[44],pkt_len_max = row[45],
        pkt_len_mean = row[46],pkt_len_std = row[47],pkt_len_var = row[48],fin_flag_cnt = row[49],
        syn_flag_cnt = row[50],rst_flag_cnt = row[51],psh_flag_cnt = row[52],ack_flag_cnt = row[53],
        urg_flag_cnt = row[54],cwe_flag_count = row[55],ece_flag_cnt = row[56],
        down_per_up_ratio = row[57],pkt_size_avg = row[58],fwd_seg_size_avg = row[59],
        bwd_seg_size_avg = row[60],fwd_byts_per_b_avg = row[61],fwd_pkts_per_b_avg = row[62],
        fwd_blk_rate_avg = row[63],bwd_byts_per_b_avg = row[64],bwd_pkts_per_b_avg = row[65],
        bwd_blk_rate_avg = row[66],subflow_fwd_pkts = row[67],subflow_fwd_byts = row[68],
        subflow_bwd_pkts = row[69],subflow_bwd_byts = row[70],init_fwd_win_byts = row[71],
        init_bwd_win_byts = row[72],fwd_act_data_pkts = row[73],fwd_seg_size_min = row[74],
        active_mean = row[75],active_std = row[76],active_max = row[77],active_min = row[78],
        idle_mean = row[79],idle_std = row[80],idle_max = row[81],idle_min = row[82],
        label = row[83],sublabel = 'unchecked'
        )
      log.save()
    index+=1'''
def index(request):
    if not request.user.is_authenticated:
      msg.add_message(request,msg.INFO,"You must login to continue.")
      return redirect("/accounts/login/")
    messages=msg.get_messages(request)

    total_threats = TrafficLog.objects.exclude(label = "Normal").count()
    traffic_logs = TrafficLog.objects.all().order_by('-timestamp')[:200]
    protocols = TrafficLog.objects.all().values('protocol').annotate(total=Count('protocol')).order_by('-total')
    source_addresses = TrafficLog.objects.all().values('src_ip').filter(src_ip__contains='192.168.').annotate(total=Sum('tot_fwd_pkts')).order_by('-total')
    dest_addresses = TrafficLog.objects.all().values('dst_ip').filter(dst_ip__contains='192.168.').annotate(total=Sum('tot_fwd_pkts')).order_by('-total')
    context = dict(
      total_threats=total_threats,
      traffic_logs=traffic_logs,
      protocols=protocols,
      source_addresses=source_addresses,
      dest_addresses=dest_addresses,
      messages=messages)
    return render(request,"dash/index.html",context)

def data(request):
    protocol_result = TrafficLog.objects.all().values('protocol').annotate(total=Count('protocol')).order_by('total')
    data = dict(protocol_result=list(protocol_result))
    return JsonResponse(data)


def network_data(request):
    filename = os.path.join('/home/keshavchaurasia/Desktop/codes/mp/campus/src','data.csv')
    df = pd.read_csv(filename)
    df = df.loc[df['new_old'] == 'new']
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df.sort_values('Timestamp', axis=0, ascending=True, inplace=True, kind='quicksort', na_position='last')
    json_data = df.to_json(orient='records')
    return HttpResponse(json_data, content_type="application/json")