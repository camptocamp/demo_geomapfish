#!/usr/bin/env python3


from setuptools import find_packages, setup

setup(
    name="custom",
    packages=find_packages(exclude=["tests.*"]),
    entry_points={
        "paste.app_factory": [
            "main = custom:main",
        ],
    },
)
