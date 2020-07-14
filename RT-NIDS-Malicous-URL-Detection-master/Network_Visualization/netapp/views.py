from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse,Http404
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages as msg
from django.core.mail import send_mail
from django.contrib.auth.models import User, Group
from django.utils import timezone

import random
import re
import csv
import json
from ip2geotools.databases.noncommercial import DbIpCity
from dash.models import TrafficLog
# Create your views here.

class IpResponse:
	def __init__(self):
		self.latitude = 0.0
		self.latitude = 0.0
	def latitude(self):
		return self.latitude
	def longitude(self):
		return self.longitude
		
def index(request):
	if not request.user.is_authenticated:
		msg.add_message(request,msg.INFO,"You must login to continue.")
		return redirect("/accounts/login/")
	messages=msg.get_messages(request)

	return render(request,"netapp/index.html",{'messages':messages,})

def dashboard(request):
	if not request.user.is_authenticated:
		return redirect("/accounts/login/")
	messages=msg.get_messages(request)

	return render(request,"netapp/dashboard.html",{'messages':messages,})

def jsonWorld(request):
	with open('netapp/datasets/topojson/asia_110m.json','r') as myfile:
		data=myfile.read()
		obj=json.loads(data)
	return JsonResponse(obj)
		
def IpTracing(request):
	datasets=[]
	src_ip=[]
	src_lat=[]
	src_lon=[]
	dst_ip=[]
	dst_lat=[]
	dst_lon=[]
	with open('netapp/datasets/wlan2.pcap_Flow.csv','r') as csvfile:
		file_rows=csv.reader(csvfile)
		for row in file_rows:
			datasets.append(row)
		srcip_index=datasets[0].index('Src IP')
		dstip_index=datasets[0].index('Dst IP')
		index=0
		for row in datasets:
			if index != 0:
				src_ip.append(row[srcip_index])
				dst_ip.append(row[dstip_index])
			index+=1
		for ip in src_ip:
			response=IpResponse()
			try:
				response=DbIpCity.get(ip,api_key="free")
			except:
				pass
			if response:
				src_lat.append(response.latitude)
				src_lon.append(response.longitude)
		for ip in dst_ip:
			try:
				response=DbIpCity.get(ip,api_key="free")
			except:
				pass
			if response:
				dst_lat.append(response.latitude)
				dst_lon.append(response.longitude)
	return JsonResponse({'src_ip':src_ip,'dst_ip':dst_ip,'src_lat':src_lat,'src_lon':src_lon,'dst_lat':dst_lat,'dst_lon':dst_lon})

def portScan(request):
    datasets=[]
    portcount={}
    logs=TrafficLog.objects.all()
    for log in logs:
    	if log.src_port in portcount:
    		portcount[log.src_port]+=1
    	else:
    		portcount[log.src_port]=1
    return JsonResponse(portcount)

def graphbox(request):
	packetsflow=[]
	bytesflow=[]
	src_ip=[]
	src_port=[]
	ip="none"
	port="none"
	logs=TrafficLog.objects.all()[:1000]
	if request.GET.get('ip',"") or request.GET.get('port',""):
		ip= request.GET.get('ip',"")
		port= request.GET.get('port',"")
	for log in logs:
		if ip=="none" and port=="none":
			packetsflow.append(log.flow_pkts_per_s)
			bytesflow.append(log.flow_byts_per_s)
			if log.src_ip in src_ip:
				pass
			else:
				src_ip.append(log.src_ip)
			if log.src_port in src_port:
				pass
			else:
				src_port.append(log.src_port)

		if ip=="none" and port!="none":
			if port==log.src_port:
				packetsflow.append(log.flow_pkts_per_s)
				bytesflow.append(log.flow_byts_per_s)
				if log.src_ip in src_ip:
					pass
				else:
					src_ip.append(log.src_ip)
			if log.src_port in src_port:
				pass
			else:
				src_port.append(log.src_port)
		if ip!="none" and port=="none":
			if ip==log.src_ip:
				packetsflow.append(log.flow_pkts_per_s)
				bytesflow.append(log.flow_byts_per_s)
				if log.src_port in src_port:
					pass
				else:
					src_port.append(log.src_port)
			if log.src_ip in src_ip:
				pass
			else:
				src_ip.append(log.src_ip)
		if ip!="none" and port!="none":
			if ip==log.src_ip and port==log.src_port:
				packetsflow.append(log.flow_pkts_per_s)
				bytesflow.append(log.flow_byts_per_s)
	return JsonResponse({'src_ip':src_ip,'src_port':src_port,'packetsflow':packetsflow,'bytesflow':bytesflow})

def networkflowgraph(request):
	datasets=[]
	data={}
	data0={}
	bytesflow=[]
	flowduration=[]
	packetsflow=[]
	flowdate=None
	dates=[]
	logs=TrafficLog.objects.all().order_by('timestamp')
	for log in logs:
		if log.timestamp in data:
			data[log.timestamp]+=log.flow_byts_per_s
		else:
			data[log.timestamp]=log.flow_byts_per_s

		if log.timestamp in data0:
			data0[log.timestamp]+=log.flow_pkts_per_s
		else:
			data0[log.timestamp]=log.flow_pkts_per_s
	for key in data:
		if key.split(" ")[0] not in dates:
			dates.append(key.split(" ")[0])
		time=(key.split(" ")[1]).split(":")
		flowduration.append(int(time[0])*60*60+int(time[1])*60+int(time[2]))
		bytesflow.append(data[key])
	for key in data0:
		packetsflow.append(data0[key])

	return JsonResponse({'bytesflow':bytesflow,'flowduration':flowduration,'packetsflow':packetsflow,'dates':dates})

def piegraph(request):
	protocol_data={}
	logs=TrafficLog.objects.all()
	for log in logs:
		if log.protocol in protocol_data:
			protocol_data[log.protocol]+=1
		else:
			protocol_data[log.protocol]=1
	return JsonResponse(protocol_data)

def dashgraph(request):
	choice=None
	datasets=[]
	src_ip=[]
	dst_ip=[]
	src_port=[]
	dst_port=[]
	logs=TrafficLog.objects.all()
	if request.GET and request.GET.get('basis',""):
		choice=request.GET["basis"]
	for log in logs:
		src_ip.append(log.src_ip)
		dst_ip.append(log.dst_ip)
		src_port.append(log.src_port)
		dst_port.append(log.dst_port)
	modified_src_ip=[]
	modified_dst_ip=[]
	for row in src_ip:
		mod_ip=row.split('.')
		modified_src_ip.append(mod_ip[0]+mod_ip[1])#+mod_ip[2]+mod_ip[3])
	for row in dst_ip:
		mod_ip=row.split('.')
		modified_dst_ip.append(mod_ip[0]+mod_ip[1])#+mod_ip[2]+mod_ip[3])

	return JsonResponse({'choice':choice,'src_ip':src_ip,'mod_src':modified_src_ip,'src_port':src_port,'dst_ip':dst_ip,'mod_dst':modified_dst_ip,'dst_port':dst_port})

def packetGraph(request):
	datasets=[]
	data_pkts={}
	data_fwdpkts={}
	data_bwdpkts={}
	datetime=[]
	logs=TrafficLog.objects.all().order_by('timestamp')
	for log in logs:
		if (log.timestamp in data_pkts) and (log.timestamp in data_fwdpkts) and (log.timestamp in data_bwdpkts):
			data_pkts[log.timestamp]+=log.flow_pkts_per_s
			data_fwdpkts[log.timestamp]+=log.tot_fwd_pkts
			data_bwdpkts[log.timestamp]+=log.tot_bwd_pkts
		else:
			datetime.append(log.timestamp)
			data_pkts[log.timestamp]=log.flow_pkts_per_s
			data_fwdpkts[log.timestamp]=log.tot_fwd_pkts
			data_bwdpkts[log.timestamp]=log.tot_bwd_pkts

	packetsflow=list(data_pkts.values())
	fwdpacketsflow=list(data_fwdpkts.values())
	bwdpacketsflow=list(data_bwdpkts.values())
	return JsonResponse({'datetime':datetime,'packetsflow':packetsflow,'fwdpacketsflow':fwdpacketsflow,'bwdpacketsflow':bwdpacketsflow})


def indexgraph(request):
	datasets=[]
	src_data={}
	dst_data={}
	tcp={}
	udp={}
	others={}
	overall={}
	logs=TrafficLog.objects.all().order_by('timestamp')
	for log in logs:
		if log.timestamp in overall:
				overall[log.timestamp]+=log.flow_byts_per_s
		else:
			overall[log.timestamp]=log.flow_byts_per_s

		if log.protocol==6:
			if log.timestamp in tcp:
				tcp[log.timestamp]+=log.flow_byts_per_s
			else:
				tcp[log.timestamp]=log.flow_byts_per_s
		elif log.protocol==17:
			if log.timestamp in udp:
				udp[log.timestamp]+=log.flow_byts_per_s
			else:
				udp[log.timestamp]=log.flow_byts_per_s
		else:
			if log.timestamp in others:
				others[log.timestamp]+=log.flow_byts_per_s
			else:
				others[log.timestamp]=log.flow_byts_per_s

	logs=random.sample(list(TrafficLog.objects.all()),90)
	for log in logs:
		if log.src_ip in src_data:
			src_data[log.src_ip]+=log.flow_byts_per_s
		else:
			src_data[log.src_ip]=log.flow_byts_per_s

		if log.dst_ip in dst_data:
			dst_data[log.dst_ip]+=log.flow_byts_per_s
		else:
			dst_data[log.dst_ip]=log.flow_byts_per_s

	return JsonResponse({'src_data':src_data,'dst_data':dst_data,'tcp':tcp,'udp':udp,'others':others,"overall":overall})

def notification(request):
	notes=['django is great for web developemnet','Network visualization is simple','Background process is runing']
	return render(request,'netapp/notification.html',{'notes':notes})

def loginView(request):
	errors=[]
	username=""
	password=""
	user=None
	if request.user.is_authenticated:
		return redirect('/')
	messages=msg.get_messages(request)
	if request.method=='POST':
		username=request.POST['username']
		password=request.POST['password']
		try:
			user=User.objects.get(username=username)
		except Exception as e:
			pass

		if request.session.test_cookie_worked():
			pass
		else:
			return HttpResponse("<center><h1>Please enable cookie to continue.</h1><center>")

		if user:
			checkuser=authenticate(username=user.username,password=password)
		else: 
			checkuser=None

		if checkuser is not None and checkuser.is_active:
			try:
			    login(request,checkuser)
			    #request.session[str(user.id)]="is_active"
			    msg.add_message(request,msg.INFO,"You are Sucessfully logged In.")
			    return redirect("/")
			except:
			    errors.append("Internal Server Error.")
		else:
			errors.append("Invalid email or password.")
	
	request.session.set_test_cookie()
	return render(request,"netapp/login.html",{'errors':errors,'username':username,'messages':messages})

def logoutView(request):
	msg.add_message(request,msg.INFO,"You are logged Out.")
	msg.add_message(request,msg.INFO,"Thank you! for spending some quality time with us.")
	logout(request)
	del request.session
	try:
		User.objects.get(username=user)
	except:
		return redirect('/accounts/login/')
	return render(request,'blog/logout.php',{})