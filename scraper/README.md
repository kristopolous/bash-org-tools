There is no automated scraper yet ... but here are my notes

links -dump -width 400 14217.html | sed '1,6d' | sed -e :a -e '$d;N;2,6ba' -e 'P;D' | sed -E s/'^ *//' | sed -E s/' *$//'
