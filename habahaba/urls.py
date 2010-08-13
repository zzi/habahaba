from django.conf.urls.defaults import *

urlpatterns = patterns('habahaba.views',
    (r'^$', 'app_view'),
    (r'^old/$', 'app_1_view'),
)

