import pandas as pd
import numpy as np
import os
import json
from django.shortcuts import render
from django.http import HttpResponse
from .models import TrafficLog
from django.db.models import Avg, Count, Min, Sum
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from string import printable
from pusher_push_notifications import PushNotifications
from memoize import Memoizer
from memoize import memoize, delete_memoized, delete_memoized_verhash

memoizer = Memoizer()


beams_client = PushNotifications(
    instance_id='38dbeee7-632f-4a66-8e10-6f09c792724b',
    secret_key='3E4FEDF0B3645FE816199C0810532CA4B5897549D23D4D2556FEBC1843370D14',
)

def push_notify(url):
  response = beams_client.publish_to_interests(
    interests=['hello'],
    publish_body={
        'apns': {
            'aps': {
                'alert': 'Hello!'
            }
        },
        'fcm': {
            'notification': {
                'title': f'Malicious Url Visit Detected',
                'body': f'{url}'
            }
        }
    }
  )
  print(response['publishId'])

tfid_vectorizer = joblib.load('../models/tfid_vectorizer.pkl')
url_classifier = joblib.load('../models/url_classifier.pkl') 



# Create your views here.
def index(request):
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
      dest_addresses=dest_addresses)
    return render(request,"dash/index.html",context)

def data(request):
    protocol_result = TrafficLog.objects.all().values('protocol').annotate(total=Count('protocol')).order_by('total')
    data = dict(protocol_result=list(protocol_result))
    return JsonResponse(data)


def network_data(request):
    filename = os.path.join('/home/keshavchaurasia/Desktop/codes/mp/campus/src','data.csv')
    df = pd.read_csv(filename)
    # df = df.loc[df['new_old'] == 'new']
    df['Timestamp'] = pd.to_datetime(df['Timestamp'])
    df.sort_values('Timestamp', axis=0, ascending=True, inplace=True, kind='quicksort', na_position='last')
    json_data = df.to_json(orient='records')
    return HttpResponse(json_data, content_type="application/json")

@memoize(timeout=60)
def predict_mal_url(url_link):
  if url_link:
      url_link=[url_link]
      X_test = tfid_vectorizer.transform(url_link)
      predict = url_classifier.predict(X_test)
      if predict == 0:
        print(f"safe: {url_link}")
      elif predict==1:
        print(f"malicious: {url_link}")
        push_notify(url_link)


@csrf_exempt
def check_url(request):
  url_link = request.POST.get('url_link', '')
  predict_mal_url(url_link)
  return HttpResponse(request,"")
