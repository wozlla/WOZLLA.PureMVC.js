#!/bin/sh

workpath=$(cd `dirname $0`; pwd)/
cd ${workpath}

find src -name "*.ts" >> files.txt
tsc -d @files.txt --out WOZLLA.PureMVC.js -t ES5 --sourceMap
rm files.txt
