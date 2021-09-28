import os

from setuptools import find_packages, setup

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, "README.txt")) as f:
    README = f.read()
with open(os.path.join(here, "CHANGES.txt")) as f:
    CHANGES = f.read()

requires = [
    "plaster_pastedeploy",
    "pyramid",
    "pyramid_mako",
    "pyramid_debugtoolbar",
    "waitress",
    "alembic",
    "pyramid_retry",
    "pyramid_tm",
    "SQLAlchemy",
    "transaction",
    "zope.sqlalchemy",
]

tests_require = [
    "WebTest",
    "pytest",
    "pytest-cov",
]

setup(
    name="custom",
    version="0.0",
    description="custom",
    long_description=README + "\n\n" + CHANGES,
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author="",
    author_email="",
    url="",
    keywords="web pyramid pylons",
    packages=find_packages(exclude=["tests"]),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        "testing": tests_require,
    },
    install_requires=requires,
    entry_points={
        "paste.app_factory": [
            "main = custom:main",
        ],
        "console_scripts": [
            "initialize_custom_db=custom.scripts.initialize_db:main",
        ],
    },
)
