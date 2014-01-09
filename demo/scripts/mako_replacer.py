# -*- coding: utf-8 -*-

import sys
from mako.template import Template
from glob import glob

def main():
    for f in glob(sys.argv[1] + '/*.mako'):
        mytemplate = Template(
            filename=f,
            output_encoding='utf-8',
            input_encoding='utf-8')
        out = open(f[:-5], 'w')
        out.write(mytemplate.render())
        out.close()
