var url = require('url');
var fs = require('fs');
var argv = require('optimist').default('hosted', __dirname + '/hosted-sites').argv;

var HOST_PATH = argv.hosted;

function siteExists (req, res, next) {
    var uri = url.parse('http://'+req.headers.host + req.url);
    fs.exists(HOST_PATH+'/'+uri.hostname, function(exists) {
        if (exists) {
            deliverSite(req, res, next);
        } else {
            next();
        }
    });
}

function deliverSite (req, res, next) {

    var mimeTypes = {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "svg": "image/svg+xml",
        "js": "text/javascript",
        "css": "text/css"
    };

    var uri = url.parse('http://'+req.headers.host + req.url);
    var filename = HOST_PATH+'/'+uri.hostname + req.url;
    if (filename.substr(-1,1) === '/') {
        filename = filename + 'index.html';
    }
    fs.exists(filename, function(exists) {
        if(!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        var mimeType = mimeTypes[filename.split(".")[1]];
        res.writeHead(200, {'Content-Type': mimeType} );
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
    });
}

module.exports = function (req, res, next) {
    // if no hostmore request, call through
    siteExists(req, res, next);
};
