var http = require("http"),
    url = require("url"),
    util = require("util"),
    dns = require("dns"),
    Q = require("q"),
    beacon = require("./lib/beacon.js"),
    debug = require("debug")("beacon");

// Populate the info object
var info = {};
beacon.setInfo(info);

// Start the server
http.createServer(function (req, res) {  
  res.writeHead(200, {'Content-Type': 'application/javascript'});
  res.write(JSON.stringify(info));
  res.end();
}).listen(1792);

