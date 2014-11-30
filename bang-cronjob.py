#!/usr/bin/env python3

"""
This script starts up the bang server.
It is necessary because cron screws up relative paths
(why is cron still the event scheduler on ubuntu?)
"""




from subprocess import call
import os





directory  = os.path.dirname(os.path.realpath(__file__))
bang_fpath = os.path.join(directory, 'lib', 'bang.js')






call(["forever", bang_fpath])
