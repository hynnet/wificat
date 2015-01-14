var log4js  = require('log4js');
var config  = require('./config.js').conf;
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');

var route   = require('./db/route.js');
var token   = require('./db/token.js');
var logger  = log4js.getLogger('PIN');
var user = require('./user/route.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(__dirname));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/login', user.login);
app.post('/login', user.password);

app.get('/auth', user.auth);

app.get('/portal', user.portal);

app.get('/ping', function(req, res) {
    if (!req.query.gw_id) { return; }
    route.getRoute(req.query.gw_id).then(function(data) {
        if (!data) { return; }
        logger.info('Receive "Ping" from [' + data.routeId + ']');
        // logger.info('Receive "Ping" from [' + data.routeId + ']:\n' + JSON.stringify(req.query, null, 4));
        res.send('Pong');
    });
});

app.get('/gw_message.php', function(req, res) {
    res.sendFile('gw_message.html', {
            root: __dirname
        },
        function(err) {
            if (err) {
                res.sendStatus(404);
            }
        }
    );
});

app.get('/qrcode/:routeId', user.qrcode);

app.listen(50006);

// console.log('GG');
// route.addPassword('wr720n112304', {value: 'gytgytgyt', type: 1, time: 60}, function(err, data) {
//     console.log(err);
//     console.log(data);
// });

// route.getPassword('gyt', 'gggh', function(err, data) {
//     console.log(err);
//     console.log(data);
// });

// route.addRoute('gyt');