var random = require('../index');
var tap = require('tap');

var last = require('../etc/all.last.json');
var female = require('../etc/female.first.json');
var male = require('../etc/male.first.json');
var places = require('../etc/places.json');

tap.test("one", function(t) {
    for (var i = 0; i < 10; i++) {
        t.ok(last.weights[random.last()], "random last name should be in last names list");
        t.ok(places.weights[random.city_state()], "random place should be in place list");
        t.ok(female.weights[random.female()], "random female name should be in female name list");
        t.ok(male.weights[random.male()], "random male name should be in male name list");
        t.ok(['F', 'M'].indexOf(random.gender()) !== -1, "random gender should be F or M");
        var name = random.first();
        t.ok(female.weights[name] || male.weights[name], "random name should be in female or male name list");

        //make sure person names match gender
        var person = random.person();
        var list = (person.gender === 'F') ? female : male;
        t.ok(list.weights[person.first], "random person first name should be in correct gender list");
        if (person.middle) t.ok(list.weights[person.middle], "random person middle name should be in correct gender list");

        //light testing for markov chain
        t.ok(random.first(true).length > 2, "markov chain first names should be longer than 2 characters");
        t.ok(random.last(true).length > 2, "markov chain last names should be longer than 2 characters");
        t.ok(random.first(true, 3).length == 3, "length limits for first names should work");
        t.ok(random.last(true, 3).length == 3, "length limits for last names should work");
    }
    t.end();
});
