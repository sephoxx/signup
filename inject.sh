#!/bin/bash

wget -k -p -c -E -F http://infodisplay.live -P /var/www/html/signup/infodisplay.live

if [[ $? == 0 ]]
then
rm -rf page

mkdir page

sudo mv infodisplay.live/* page/

rm -rf infodisplay.live

sed -i 's/<\/body>/<script src="..\/auth.js"><\/script><\/body>/g' page/index.html
fi