#!/bin/sh
echo $1
python tl2json.py "$1" && python combine.py "$1" && python genschema.py "$1"