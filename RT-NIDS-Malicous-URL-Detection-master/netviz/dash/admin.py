from django.contrib import admin
from .models import TrafficLog

# Register your models here.
class TrafficLogAdmin(admin.ModelAdmin):
    fields = ('src_ip','src_port','dst_ip','dst_port','protocol','timestamp','flow_duration','tot_fwd_pkts','tot_bwd_pkts','fwd_pkts_per_s','flow_byts_per_s','label','sublabel')

admin.site.register(TrafficLog,TrafficLogAdmin)