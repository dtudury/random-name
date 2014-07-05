process.chdir(__dirname);

var fs = require('fs');
var path = require('path');

var MAX_COUNT = 500;

var places_split = fs.readFileSync('./PEP_2012.csv').toString().split(/\r\n/);
var places = {};
places.total = 0;
places.weights = {};
var count = 0;
places_split.every(function (place) {
    if (place) {
        var cols = place.match(/"[^"]+"|[^,]+/g);
        var city_state = cols[6].match(/"([^,]*),(.*)"/);
        var city = city_state[1].match(/((?:[A-Z][a-z.'-]* *)+)/)[0].trim();
        var state = city_state[2].trim();
        var weight = parseInt(cols[8]);
        places.total += weight;
        places.weights[city + ", " + state] = weight;
        return ++count < MAX_COUNT;
    }
});
fs.writeFileSync('../etc/places.json', JSON.stringify(places, null, " "));

var name_files = [
    {src: './dist.all.last.txt', dest: '../etc/all.last.json'},
    {src: './dist.female.first.txt', dest: '../etc/female.first.json'},
    {src: './dist.male.first.txt', dest: '../etc/male.first.json'}
];
name_files.forEach(function (name_file) {
    var names_split = fs.readFileSync(name_file.src).toString().split(/\r?\n/);
    var names = {};
    names.total = 0;
    names.weights = {};
    count = 0;
    names_split.every(function (name) {
        if (name) {
            var cols = name.match(/([A-Z]*)  *([0-9.]*) ([0-9.]*)  *(\d*)/);
            var name = cols[1].charAt(0) + cols[1].substr(1).toLowerCase();
            var weight = parseFloat(cols[2]);
            if (weight) {
                names.total += weight;
                names.weights[name] = weight;
            }
            return ++count < MAX_COUNT;
        }
    });
    fs.writeFileSync(name_file.dest, JSON.stringify(names, null, " "));
});
