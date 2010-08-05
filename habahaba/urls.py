from django.conf.urls.defaults import *

urlpatterns = patterns('jabber.habahaba.views',
    (r'^$', 'app_view'),
    (r'^old/$', 'app_1_view'),
)

