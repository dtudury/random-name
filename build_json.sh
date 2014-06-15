#!/bin/bash

cat etc/txt/dist.all.last.txt | node toJSON.js > etc/json/all.last.json
cat etc/txt/dist.female.first.txt | node toJSON.js > etc/json/female.first.json
cat etc/txt/dist.male.first.txt | node toJSON.js > etc/json/male.first.json
cat etc/txt/PEP_2012.csv | node toJSON.js > etc/json/places.json
