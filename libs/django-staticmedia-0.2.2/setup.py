try:
    from setuptools import setup
    setup_kwargs = {'zip_safe': False}
except ImportError:
    from distutils.core import setup
    setup_kwargs = {}


setup(
    name='django-staticmedia',
    version='0.2.2',
    license='BSD',

    url='http://pypi.python.org/pypi/django-staticmedia',
    keywords='django utilities templatetag static media',
    description=(
        'Dynamically get URLs for your site-level and app-level static media.'
    ),

    author='Tamas Kemenczy',
    author_email='tamas.kemenczy@gmail.com',

    classifiers=(
        'Development Status :: 5 - Production/Stable',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
    ),

    packages=(
        'staticmedia',
        'staticmedia.management',
        'staticmedia.management.commands',
        'staticmedia.templatetags',
    ),

    **setup_kwargs
)
