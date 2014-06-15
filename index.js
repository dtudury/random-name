var last = require('./etc/json/all.last.json');
var female = require('./etc/json/female.first.json');
var male = require('./etc/json/male.first.json');
var places = require('./etc/json/places.json');

function _expand_by_weight(data, atomic) {
  var expanded = [];
  data.forEach(function (row) {
    for (var i = 0; i < Math.round(row.weight / atomic); i++) {
      expanded.push(row.name);
    }
  });
  return expanded;
}

var last_weighted = _expand_by_weight(last, 0.0005);
var female_weighted = _expand_by_weight(female, 0.001);
var male_weighted = _expand_by_weight(male, 0.001);
var places_weighted = _expand_by_weight(places, 50000);

var chance_of_middle = 0.75;
var gender_ratio = 1 - 0.97 / 1.97;

function r(names) {
  return function () {
    return names[~~(Math.random()*names.length)]
  }
}


var random = module.exports = function random_person() {
  var person = {};
  var name_generator = Math.random() < gender_ratio ? random.female : random.male;
  person.first = name_generator();
  if (Math.random() < chance_of_middle) {
    do {
      person.middle = name_generator();
    } while (person.first === person.middle);
  }
  person.last = random.last();
  person.place = random.place();
  person.toString = function() {
    return '"' + this.first + (this.middle ? ' ' + this.middle : '') +  ' ' + this.last + '"' + " from " + this.place;
  }
  return person;
}

random.last   = r(last_weighted);
random.female = r(female_weighted);
random.male   = r(male_weighted);
random.place  = r(places_weighted);
random.first  = random.middle = function () {
  return Math.random() < gender_ratio ? random.female() : random.male();
}
  

if(!module.parent) {
  var l = process.argv[2] || 10
  while (l--)
    console.log(random().toString());
}
