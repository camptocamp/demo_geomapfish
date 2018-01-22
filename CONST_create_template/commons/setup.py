#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name='demo_commons',
    version='1.0',
    description='demo, a c2cgeoportal project',
    author='demo',
    author_email='info@demo.com',
    url='http://www.demo.com/',
    install_requires=[
        'c2cgeoportal_commons',
    ],
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    entry_points={
    },
)
