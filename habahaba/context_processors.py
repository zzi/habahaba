import config
from funcs import globals_from_module

def config_processor(request):
    hosts_dict = globals_from_module(config.hosts)
    main_dict = globals_from_module(config.main)
    hosts_dict.update(main_dict)
    return hosts_dict

if __name__ == '__main__':
    print(config_processor(None))
