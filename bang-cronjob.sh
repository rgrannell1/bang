#!/bin/sh

readableTime=$(date +"%Y-%m-%d %H:%M:%S")

$log_path=/home/ryan/Code/System_Scripts/log.txt
$script_path=/home/ryan/Code/JS_Files/bang/lib/bang.js

echo initialising bang server $readableTime >> $log_path
forever $script_path
