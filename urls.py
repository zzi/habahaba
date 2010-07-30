from django.conf.urls.defaults import *
from django.views.generic.simple import direct_to_template
from django.conf import settings
import staticmedia

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    (r'^habahaba/', include('jabber.habahaba.urls')),
    # Example:
    # (r'^jabber/', include('jabber.foo.urls')),

    # Uncomment the admin/doc line below and add 'django.contrib.admindocs' 
    # to INSTALLED_APPS to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
) 

if settings.DEBUG:
    urlpatterns += staticmedia.serve()

