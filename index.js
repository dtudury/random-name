var last = require('./etc/all.last.json');
var female = require('./etc/female.first.json');
var male = require('./etc/male.first.json');
var places = require('./etc/places.json');


//build markov chains
[last, female, male].forEach(function (names) {
    var _c, __c;
    names.markov = {};
    Object.keys(names.weights).forEach(function (name) {
        _c = __c = "";
        var weight = names.weights[name];
        for (var i = 0; i <= name.length; i++) {
            var c = name.charAt(i);
            if (!names.markov[__c]) names.markov[__c] = {};
            if (!names.markov[__c][_c]) names.markov[__c][_c] = {total:0,weights:{}};
            if (!names.markov[__c][_c].weights[c]) names.markov[__c][_c].weights[c] = 0;
            names.markov[__c][_c].weights[c] += weight;
            names.markov[__c][_c].total += weight;
            __c = _c;
            _c = c;
        }
    });
});

//select element from weighted list
function select_element(set) {
    var next_elements = Object.keys(set.weights);
    var r = Math.random() * set.total;
    var next_element;
    for (var i = 0; i < next_elements.length; i++) {
        next_element = next_elements[i];
        var next_element_weight = set.weights[next_element];
        if (next_element_weight > r) break;
        r -= next_element_weight;
    }
    return next_element;
}

//probabilistically traverse markov chain until terminating character
function walk_chain(markov, max_length) {
    max_length = max_length || 20;
    var output = ['', ''];
    while (output.length - 2 < max_length) {
        var suffix = output.slice(-2);
        var __c = suffix[0];
        var _c = suffix[1];
        var next_letter = select_element(markov[__c][_c]);
        output.push(next_letter);
        if (next_letter === '') break;
    }
    return output.join('').trim();
}

function r(set) {
    return function (use_markov, max_length) {
        if (use_markov && set.markov) return walk_chain(set.markov, max_length);
        return select_element(set);
    }
}


var CHANCE_OF_MIDDLE = 0.75;
var GENDER_RATIO = 0.97 / 1.97;

var random = module.exports = function (use_markov) {
    return random.person(use_markov).full_name;
};
random.last   = r(last);
random.female = r(female);
random.male   = r(male);
random.city_state  = r(places);
random.place = function () {
    return random.city_state().split(", ")[0];
}
random.gender = function() {
    return Math.random() < GENDER_RATIO ? 'F' : 'M';
}
random.first  = random.middle = function (use_markov, max_length) {
    return (random.gender() === 'F') ? random.female(use_markov, max_length) : random.male(use_markov, max_length);
};
random.person = function (use_markov) {
    var output = {};
    output.gender = random.gender();
    var first = random.female;
    if (output.gender === 'M') first = random.male;
    output.first = first(use_markov);
    if (Math.random() < CHANCE_OF_MIDDLE) output.middle = first(use_markov, 8);
    output.last = random.last(use_markov);
    output.full_name = output.first + " " + (output.middle ? (output.middle + " ") : "") + output.last;
    var city_state = random.city_state().split(", ");
    output.city = city_state[0];
    output.state = city_state[1];
    output.toString = function () {return output.full_name + " from " + output.city + ", " + output.state};
    return output;
};



if(!module.parent) {
  var l = process.argv[2] || 100
  while (l--) console.log(random.person(true).toString());
}
