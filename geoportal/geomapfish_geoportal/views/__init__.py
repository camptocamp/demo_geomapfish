# -*- coding: utf-8 -*-

from collections import defaultdict
import logging
from os import listdir
import re
import socket
from typing import Any, Dict

from pyramid.view import view_config

LOG = logging.getLogger(__name__)

SPACE_RE = re.compile(r" +")

# 7ff7d33bd000-7ff7d33be000 r--p 00000000 00:65 49                         /usr/lib/toto.so
SMAPS_LOCATION_RE = re.compile(r'^[0-9a-f]+-[0-9a-f]+ +.... +[0-9a-f]+ +[^ ]+ +\d+ +(.*)$')

# Size:                  4 kB
SMAPS_ENTRY_RE = re.compile(r'^([\w]+): +(\d+) kB$')

NUMBER_RE = re.compile(r'^[0-9]+$')

@view_config(route_name="metrics")
def metrics(request):
    values = []
    for pid in listdir('/proc/'):
        if NUMBER_RE.match(pid):
            try:
                with open("/proc/{}/smaps".format(pid)) as input_:
                    cur_dict: Dict[str, int] = defaultdict(int)
                    sizes: Dict[str, Any] = {}
                    for line in input_:
                        line = line.rstrip("\n")
                        matcher = SMAPS_LOCATION_RE.match(line)
                        if matcher:
                            cur_dict = sizes.setdefault(matcher.group(1), defaultdict(int))
                        else:
                            matcher = SMAPS_ENTRY_RE.match(line)
                            if matcher:
                                name = matcher.group(1)
                                if name in ('Size', 'Rss', 'Pss'):
                                    cur_dict[name.lower()] += int(matcher.group(2))
                            elif not line.startswith("VmFlags:"):
                                LOG.warning("Don't know how to parse /proc/self/smaps line: %s", line)
                    values += [
                        {'name': name, 'pid': pid, **value}
                        for name, value in sizes.items()
                        if value.get('pss', 0) > 0
                    ]
            except:
                pass


    result = [
        '# HELP pod_process_smap_rss_kb Container smap used RSS',
        '# TYPE pod_process_smap_rss_kb gauge',
    ]
    for value in values:
        result.append('pod_process_smap_rss_kb{{hostname="{}",pid="{}",name="{}"}} {}'.format(
            socket.gethostname(), value['pid'], value['name'], value['rss']
        ))
    result += [
        '# HELP pod_process_smap_pss_kb Container smap used PSS',
        '# TYPE pod_process_smap_pss_kb gauge',
    ]
    for value in values:
        result.append('pod_process_smap_pss_kb{{hostname="{}",pid="{}",name="{}"}} {}'.format(
            socket.gethostname(), value['pid'], value['name'], value['pss']
        ))
    result += [
        '# HELP pod_process_smap_size_kb Container smap used size',
        '# TYPE pod_process_smap_size_kb gauge',
    ]
    for value in values:
        result.append('pod_process_smap_size_kb{{hostname="{}",pid="{}",name="{}"}} {}'.format(
            socket.gethostname(), value['pid'], value['name'], value['size']
        ))

    request.response.text = '\n'.join(result)

    return request.response
