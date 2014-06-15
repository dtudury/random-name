
var es = require('event-stream')
var JSONStream = require('JSONStream')

process.stdin  
  .pipe(es.split(/\r?\n/))
  .pipe(es.map(function (data, callback) {
    var cols;
    if (cols = data.match(/([A-Z]*)  *([0-9.]*) ([0-9.]*)  *(\d*)/)) {
      return callback(null, {
        name: cols[1].charAt(0) + cols[1].substr(1).toLowerCase(),
        weight: Math.max(parseFloat(cols[2]), 0.0005)
      });
    }
    if (cols = data.match(/0100000US,,United States,.*United States - ([^,\/(-]*) *(?:city|town|village|municipality|CDP).*, ([^"]*).*,(\d*),/)) {
      return callback(null, {
        name: cols[1].trim() + ", " + cols[2],
        weight: parseInt(cols[3])
      });
    }
    if (cols = data.match(/0100000US,,United States,.*United States - ([^,\/(-]*).*, ([^"]*).*,(\d*),/)) {
      return callback(null, {
        name: cols[1].trim() + ", " + cols[2],
        weight: parseInt(cols[3])
      });
    }
  }))
  .pipe(JSONStream.stringify())
  .pipe(process.stdout)
