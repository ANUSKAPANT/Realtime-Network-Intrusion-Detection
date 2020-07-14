from django.contrib import admin
from .models import TrafficLog

# Register your models here.
class TrafficLogAdmin(admin.ModelAdmin):
    list_display = ('src_ip','src_port','dst_ip','dst_port','protocol','timestamp','flow_duration','tot_fwd_pkts','tot_bwd_pkts','fwd_pkts_per_s','flow_byts_per_s','label','sublabel')
    filter_display = ['src_port','dst_port','protocol','timestamp']

admin.site.register(TrafficLog,TrafficLogAdmin)