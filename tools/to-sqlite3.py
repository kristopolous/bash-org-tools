#!/usr/bin/env python
#
# This tool will read the txt files 
# and then convert them into a sqlite table
# which will be populated in ../sql/sqlite3.db
#
# The format for the table, named "quotes" is
#
# id (of quote)
# score 
# text 
#
# So you can execute a command like this:
#
# select * from quote order by score desc limit 10;
#
# To approximately get the first page of the top 100 quotes

import sqlite3
import glob
import re
import sys

header_re = re.compile('^#(\d*)...(-?\d*)')

conn = sqlite3.connect("../sql/sqlite3.db")
c = conn.cursor()
c.execute("drop table quotes")
c.execute('''CREATE TABLE quotes
    (id integer, score integer, quote text)''')

for filename in glob.glob("../txt/*txt"):
  with open(filename, 'r') as f:
    header = f.readline()
    m = header_re.match(header)
    qid = int(m.group(1))
    score = int(m.group(2))
    quote = f.read()
    c.execute("insert into quotes values (?, ?, ?)", (qid, score, quote))

conn.commit()
conn.close()
