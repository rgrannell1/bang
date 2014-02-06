#!/usr/bin/env python

"""
This script spins up the bang.js server as a 
daemon process, and logs the time at which that
occurred to a file.
"""

from subprocess import call
import logging
from time import gmtime, strftime
import os

directory = os.path.dirname(os.path.realpath(__file__))

log_path = directory + "/log.txt"
bang_script_path = directory + "/lib/bang.js"

logging.basicConfig(
	filename = log_path,
	level = logging.DEBUG)

current_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())

logging.debug("initialising bang server at " + current_time)

call(["forever", bang_script_path])
