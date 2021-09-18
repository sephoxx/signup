#!/bin/bash

rm -rf page

wget -k -p -c -E -F http://infodisplay.live

mkdir page

sudo mv infodisplay.live/* page/

rm -rf infodisplay.live

sed -i 's/<\/body>/<script src="..\/auth.js"><\/script><\/body>/g' page/index.html
