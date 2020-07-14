from django.contrib import admin
from django.urls import path
from sklearn.externals import joblib


from . import views

urlpatterns = [
    path('', views.index,name='index'),
    path('data',views.data,name='api_data'),
    path('url',views.check_url,name='check_url')
]


GLOBAL_tfid_vectorizer = joblib.load('../models/tfid_vectorizer.pkl')
GLOBAL_url_classifier = joblib.load('../models/url_classifier.pkl') 
