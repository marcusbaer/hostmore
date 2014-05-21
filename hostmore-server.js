var argv = require('optimist').default('port', 80).default('static', __dirname + '/static').default('live', false).argv;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cors = require("cors");
var hostmore = require('./hostmore');

function getIpAddress () {
    // look up ip address
    var os=require('os');
    var ifaces=os.networkInterfaces();
    var lookupIpAddress = null;
    for (var dev in ifaces) {
        if(dev != "en1" && dev != "en0" && dev != "eth0" && dev != "eth1") {
            continue;
        }
        ifaces[dev].forEach(function(details){
            if (details.family=='IPv4') {
                lookupIpAddress = details.address;
            }
        });
    }
//    console.log(lookupIpAddress);
    return lookupIpAddress;
}

app.set('port', argv.port);
app.set('static', argv.static);
app.set('live', argv.live);
app.set('title', 'HM Server');
app.set('views', __dirname + '/jade');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/client'));

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

app.get('/404', function(req, res){
    throw new NotFound;
});

app.get('/500', function(req, res){
    throw new Error('keyboard cat!');
});

app.engine('jade', require('jade').__express);

app.use(bodyParser());
//app.use(cors(corsOptions));
app.use(cors());
app.use(hostmore);

// define default static path
app.use(express.static(app.get('static')));

//app.use("/static", express.static(__dirname + "/static"));

//var static_handler = express.static(__dirname + '/static/');
//app.get(/^\/static(\/.*)?$/, function(req, res, next) {
//    req.url = req.url.substr('/static'.length);
//    return static_handler(req, res, next);
//});

//app.use(express.logger('dev'));

//app.use("/", express.basicAuth(function(user, pass){
//    return 'foo' == user && 'bar' == pass;
//}));

//app.use(express.json());

if (app.get('live')) {
    // use live reload on page
    app.use(require('connect-livereload')({
        port: 35729,
        ignore: ['.js', '.svg']
    }));
    // use simple logger
    app.use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    });
}

app.get('/', function(req, res){
    res.render('hostmore',
        { title : app.get('title'), host: getIpAddress(), port: app.get('port'), notCordovaBuild: true, menu: { dashboard: "/hello", options: "/404" } }
    )
});

if (!module.parent) {
    app.listen(app.get('port'));
}