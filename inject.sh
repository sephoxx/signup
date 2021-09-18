#!/bin/bash

wget -k -p -c -E -F http://infodisplay.live -P /var/www/html/signup/infodisplay.live

if [[ $? == 0 ]]
then
rm -rf /var/www/html/signup/page

mkdir /var/www/html/signup/page

sudo mv /var/www/html/signup/infodisplay.live/* /var/www/html/signup/page/

rm -rf /var/www/html/signup/infodisplay.live

sed -i 's/<\/body>/<script src="..\/auth.js"><\/script><\/body>/g' /var/www/html/signup/page/index.html
fi