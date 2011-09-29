#!/bin/bash

cat src/util.js src/interception.js src/data.js src/main.js src/dataDecoration.js src/report.js > triggerFinger.js

java -jar ../closure-compiler/compiler.jar --js src/util.js --js src/interception.js --js src/data.js --js src/main.js --js src/dataDecoration.js --js src/report.js --js_output_file triggerFinger-min.js
