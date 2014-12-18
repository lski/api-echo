var http = require('http');
var Router = require('./router');

var port = process.env.port || 1337;
var router = new Router();
var server = http.createServer(router.listener).listen(port);

router.get('/headers', function(req, res) {

    res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    res.end(JSON.stringify(getHeaders(req)));
});

router.get('/ip', function(req, res) {

     res.writeHead(200, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    res.end(JSON.stringify({ 
        ip: getIp(req) 
    }));
    
});

router.post('/echo', function(req, res) {

    var body = '',
        contentType = (req.headers['content-type'] == null || req.headers['content-type'] === 'application/x-www-form-urlencoded' ? 'text/plain' : req.headers['content-type']);

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        res.writeHead(200, { 
            'Content-Type': contentType, 
            'Access-Control-Allow-Origin' : '*' 
        });
        res.end(body);
    });
});

function getIp(req) {
    
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    
    return /[0-9\.]*/.exec(ip)[0];
}

function getHeaders(req) {
    
    var headersToExclude = ['x-arr-ssl', 'x-liveupgrade', 'x-arr-log-id', 'x-site-deployment-id', 'disguised-host'],
        headers = JSON.parse(JSON.stringify(req.headers));
                            
    for(var i = 0, n = headersToExclude.length; i<n; i++) {
        delete headers[headersToExclude[i]];
    }

    // slightly alter this
    if(headers['x-forwarded-for']) {
        headers['x-forwarded-for'] = getIp(req);
    }

    return headers;
}

function _extend(out) {

    out = out || {};

    for (var i = 1; i < arguments.length; i++) {

        var obj = arguments[i];

        if (!obj) {
            continue;
        }

        for (var key in obj) {

            if (Object.prototype.hasOwnProperty.call(obj, key)) {

                var val = obj[key];

                if (val !== null && typeof val === 'object' && !(val instanceof Date)) {

                    out[key] = _extend(out[key], val);
                }
                else {
                    out[key] = val;
                }
            }
        }
    }

    return out;
}