# -*- coding: utf-8 -*-

try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(
    name='demo',
    version='1.0',
    description='demo, a c2cgeoportal project',
    author='camptocamp',
    author_email='info@camptocamp.com',
    url='http://www.camptocamp.com/geospatial-solutions',
    install_requires=[
        'PasteScript',
        'c2cgeoportal>=1.6dev',
    ],
    packages=find_packages(exclude=['ez_setup']),
    include_package_data=True,
    message_extractors={'demo': [
        ('static/mobile/index.html', 'mako', {'input_encoding': 'utf-8'}),
        ('static/**', 'ignore', None),
        ('**.py', 'python', None),
        ('templates/**.html', 'mako', {'input_encoding': 'utf-8'}),
        ('templates/**.js', 'mako', {'input_encoding': 'utf-8'}),
    ]},
    zip_safe=False,
    entry_points={
        'paste.app_factory': [
            'main = demo:main',
        ],
        'console_scripts': [
            'create_db = demo.scripts.create_db:main',
            'mako = demo.scripts.mako_replacer:main',
        ],
    },
)
