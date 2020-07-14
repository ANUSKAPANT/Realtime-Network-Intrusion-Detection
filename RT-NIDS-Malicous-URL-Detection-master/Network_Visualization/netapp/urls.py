from django.urls import path
from . import views

urlpatterns=[
	path('netview/',views.index,name="index"),path('accounts/login/',views.loginView,name="login"),
	path('accounts/logout/',views.logoutView,name="logout"),path('notification/', views.notification,name="notification"),
	path('graph/index/',views.indexgraph,name="indexgraph"),path('graph/dash/',views.dashgraph,name="dashgraph"),
	path('graph/pie/',views.piegraph,name="piegraph"),path('graph/networkflow/',views.networkflowgraph,name="networkflowgraph"),
	path('graph/box/',views.graphbox,name="boxgraph"),
	path('dash/',views.dashboard,name="dashboard"),
	path('graph/portscan/',views.portScan,name="portscan"),path('json/world/',views.jsonWorld),
	path('graph/packets/',views.packetGraph,name="packetgraph"),
	path('fetch/coordinates/',views.IpTracing),
]