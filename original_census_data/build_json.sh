#!/bin/bash

cat dist.all.last.txt | node toJSON.js > ../etc/all.last.json
cat dist.female.first.txt | node toJSON.js > ../etc/female.first.json
cat dist.male.first.txt | node toJSON.js > ../etc/male.first.json
cat PEP_2012.csv | node toJSON.js > ../etc/places.json
