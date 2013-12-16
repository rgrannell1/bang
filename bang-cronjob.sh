#!/bin/sh

time=$(date +"%Y-%m-%d %H:%M:%S")

echo initialising bang server $time >> /home/ryan/Code/System_Scripts/log.txt

forever '/home/ryan/Code/JS_Files/bang/lib/bang.js'
