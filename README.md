# random-name

return random names (weighted by popularity in year 1990 U.S. census data).
also random cities (weighted by population in year 2012 U.S. census data).

``` js
  var random = require('random-name')
  console.log(random());

  //provides first, middle, last, female, and male names.

  console.log(random.first())
  console.log(random.middle())
  console.log(random.last())
  console.log(random.female())
  console.log(random.male())

  //also, random place name!
  console.log(random.place())

  //or a person object with gender matching first and middle, and a state
  var person = random.person();
  console.log(person.full_name, "from", person.city + ", " + person.state);
```

also optionally builds names using markov chains

``` js
  var random = require('random-name')
  console.log(random(true));
  console.log(random.first(true))
  console.log(random.last(true))
  var person = random.person(true);
```

Taken from the [U.S. census geneology website](https://www.census.gov/genealogy/www/data/1990surnames/names_files.html)
and the [U.S. census population estimate](https://www.census.gov/popest/)

The .json files are limited to 500 entries to regenerate the data using more entries
edit `MAX_COUNT` in original_census_data/build_json.js and re-run the script:
`node original_census_data/build_json.js`

## License

MIT
