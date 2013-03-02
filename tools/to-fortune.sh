#!/bin/bash

# Minimum score to include
MINSCORE=500

# First create the sqlite3 db with the python script

#./to-mysql.py

# now create a fortune 'db' using all quotes above a certain threshhold

sqlite3 ../sql/sqlite3.db "select quote from quotes where score > $MINSCORE" | sed -E 's/^$/%/' > ../fortune/bashorg

(
  cd ../fortune
  strfile bashorg bashorg.dat
)
