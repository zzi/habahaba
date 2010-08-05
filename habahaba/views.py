from django.shortcuts import render_to_response
from django.template import RequestContext
import config

def app_view(request):
    lockHost = ''
    if config.main.LOCK_HOST == 'on':
        lockHost = 'disabled="disabled" '
    return render_to_response('app.html',
        {'version': '0.0', 'lockHost': lockHost},
        context_instance=RequestContext(request))

def app_1_view(request):
    lockHost = ''
    if config.main.LOCK_HOST == 'on':
        lockHost = 'disabled="disabled" '
    return render_to_response('app_1.html',
        {'version': '0.0', 'lockHost': lockHost},
        context_instance=RequestContext(request))


