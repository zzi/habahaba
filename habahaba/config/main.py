from staticmedia import get_mount_points
from django.conf import settings

# SERVICE_NAME
SERVICE_NAME = 'Jappix'

# SERVICE DESCRIPTION
SERVICE_DESC = 'a free distributed social network'

# JAPPIX RESOURCE
JAPPIX_RESOURCE = 'Jappix'

# BINDING HTTP-BASE (generally : bosh/http-bind/bind)
HTTP_BASE = 'bosh'

# SECURED HTTP CONNECTIONS WITH SSL (on/off)
SSL = 'off'

# LOCK TO THE DEFINED HOST (on/off)
LOCK_HOST = 'off'

# ALL PAGES COMPRESSED WITH GZIP (on/off)
GZIP = 'on'

# ANONYMOUS MUC CONNECTIONS ALLOWED (on/off)
ANONYMOUS_ENABLED = 'off'

# DISABLE THE CACHING WITH THE DEVELOPER MODE (on/off)
DEVELOPER_MODE = 'off'

# MEDIA ALIAS FOR USING IN JAVASCRIPT
if not settings.STATICMEDIA_MOUNTS:
    MEDIA_ALIAS = get_mount_points()[0][0] #'/appmedia/habahaba'

