def globals_from_module(module_name):
    """
    function returns dictionary with global variables which contain strings and numbers
    """
    globals_list = [name for name in dir(module_name)
        if isinstance(getattr(module_name, name), (str, int, float))
        and not name.startswith('_')]
    globals_dict = dict((name, getattr(module_name, name)) for name in globals_list)
    return globals_dict
