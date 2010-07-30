from django.shortcuts import render_to_response
from django.template import RequestContext
from context_processors import config_processor
import config

def test_view(request):
    return render_to_response('test.html',
        {'title': 'test title'},
        context_instance=RequestContext(request, processors=[config_processor]))

def app_view(request):
    lockHost = ''
    if config.main.LOCK_HOST == 'on':
        lockHost = 'disabled="disabled" '
    return render_to_response('app.html',
        {'version': '0.0', 'lockHost': lockHost},
        context_instance=RequestContext(request, processors=[config_processor]))


