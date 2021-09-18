#!/bin/bash

sudo wget -k -p -c -E -F http://infodisplay.live?page_id=9546 -P /var/www/html/signup/

sudo rm -rf /var/www/html/signup/page

sudo mkdir /var/www/html/signup/page

sudo mv /var/www/html/signup/infodisplay.live/* /var/www/html/signup/page/

sudo rm -rf /var/www/html/signup/infodisplay.live

sudo sed -i 's/<\/body>/<script src="..\/auth.js"><\/script><\/body>/g' /var/www/html/signup/page/index.html
