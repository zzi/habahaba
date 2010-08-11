from django.conf import settings

def config_processor(request):
    return { 'settings': settings }

