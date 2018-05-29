# -*- coding: utf-8 -*-

# Copyright (c) 2014-2018, Camptocamp SA
# All rights reserved.

# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:

# 1. Redistributions of source code must retain the above copyright notice, this
#    list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright notice,
#    this list of conditions and the following disclaimer in the documentation
#    and/or other materials provided with the distribution.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
# ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

# The views and conclusions contained in the software and documentation are those
# of the authors and should not be interpreted as representing official policies,
# either expressed or implied, of the FreeBSD Project.


# Tool used to deactivate accounts that was not logged since X days.
# Example of a manual use:
# .build/venv/bin/python3 ../deactivate_olds_accounts.py --help


import logging
import os
import pytz
import sys
import transaction
from argparse import ArgumentParser
from pyramid.paster import get_app
from logging.config import fileConfig
from datetime import datetime, timedelta


logging.basicConfig(format="%(asctime)s %(levelname)-5.5s [%(name)s] %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def main():
    parser = ArgumentParser(
        prog=sys.argv[0], add_help=True,
        description="Tool used to deactivate accounts that was not logged since X days.",
    )

    parser.add_argument(
        "-i", "--app-config",
        default="geoportal/production.ini",
        dest="app_config",
        help="the application .ini config file (optional, default is 'production.ini')"
    )

    parser.add_argument(
        "-n", "--app-name",
        default="app",
        dest="app_name",
        help="the application name (optional, default is 'app')"
    )

    parser.add_argument(
        "-e", "--exclude",
        action="append",
        dest="exclude",
        default=["admin"],
        help="Exclude some users by username."
    )

    parser.add_argument(
        "days",
        type=int,
        help="The maximum numbers of days between now and the last login date. "
             "Older accounts will be deactivated. Default to 365 days."
    )

    options = parser.parse_args()

    app_config = options.app_config
    app_name = options.app_name
    if app_name is None and "#" in app_config:
        app_config, app_name = app_config.split("#", 1)

    # fileConfig(app_config, defaults=os.environ, disable_existing_loggers=False)
    logger.info("{} called with {}".format(sys.argv[0], vars(options)))

    app = get_app(app_config, app_name, options=os.environ)

    with transaction.manager:
        deactivate_olds_accounts(options.days)


def deactivate_olds_accounts(days: int):
    # must be done only once we have loaded the project config
    from c2cgeoportal_commons.models import DBSession
    from c2cgeoportal_commons.models.static import User

    limite = datetime.now(pytz.utc) - timedelta(days=days)

    for user in DBSession.query(User). \
            filter(User.deactivated==False). \
            filter(User.last_login < limite):
        user.deactivated = True
        logger.info("User with username {} is now deactivated".format(user.username))


if __name__ == "__main__":
    main()
