from staticmedia import get_mount_points

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

#  THE STATIC FILES HOST (same server: . or external one like http://static.jappix.com)
HOST_STATIC =  '.'

# THE MAIN XMPP HOST (your XMPP server host, like im.jappix.com)
HOST_MAIN = 'localhost'

# THE MUC XMPP HOST (your MUC server host, like muc.jappix.com)

HOST_MUC = 'muc.jappix.com'

#  THE ANONYMOUS XMPP HOST
HOST_ANONYMOUS = 'anonymous.localhost'

# DOMAIN FOR ANONYMOUS MESSAGES TRANSPORT
HABAHABA_DOMAIN = 'gateway.habahaba.im'

# APP VERSION
VERSION = '0.0'

try:
    from habahaba.settings_local import *
except ImportError:
    pass
