var http = require("http"),
    url = require("url"),
    Q = require("q"),
    debug = require("debug")("beacon");

module.exports = {

    // Populates the info of the beacon (fire & forget)
    setInfo: function(info){
        module.exports.getPublic().then(function(data){
            info.public = data;
        }).fail(function(err){
            module.exports.get('icanhazip.com', '/').then(function(data){
                info.public = data;
            }).fail(function(err){
                debug(err);
            })
        });

        module.exports.getPrivate().then(function(data){
            info.local = data;
        }).fail(function(err){
            debug(err);
        });
    },

    // Gets the public address of the host
    getPrivate: function(){
        return module.exports.get('169.254.169.254', '/latest/meta-data/local-ipv4');
    },

    // Gets the public address of the host
    getPublic: function(){
        return module.exports.get('169.254.169.254', '/latest/meta-data/public-ipv4');
    },

    // issues a HTTP GET request
    get: function(host, path) {
        var q = Q.defer();
        debug('HTTP GET ' + host + path);
        http.get({
            host: host,
            path: path
        }, function(response) {
            // Continuously update stream with data
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                // Resolve the body
                q.resolve(body.trim());
            });
        }).on('error', function(e) {
            q.reject(e);
        });
        return q.promise;
    }

}