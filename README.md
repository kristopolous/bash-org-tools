<img src=http://i.imgur.com/XcU3mOH.gif>

http://www.youtube.com/watch?v=a6Pr4jOPZTg

# Bash.org scrape

Bash.org is basically the aphorisms of the internet and as far as I'm concerned it has languished.

This is a scrape, database, and fortune file of bash.org taken on March 1, 2013.  It has all the approved quotes - the removed quotes in txt format.

Each quote is a result of a `links -dump` command and has the following format:

    #(quote number) +(score)- [x]
    quote

For instance:

    #162189 +(1203)- [X]
    <ANDYHAZARD> i need a file
    <kenners> you misspelled "life"

## Goodies

in tools/ there is

 * a program that creates an SQLite3 database out of the quotes
 * a script that creates a fortune(6) database from this database with a minimum threshhold.

In fortune/ this database is there.

