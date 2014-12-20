function Router(options) {

	if (!(this instanceof Router)) {
		return new Router();
	}

	var _routes = {},
		_options = options || {};

	this.addRoute = function (type, url, handler) {

		if (!(url instanceof RegExp)) {
			url = RegExp(url);
		}
		(_routes[type] || (_routes[type] = [])).push({ url: url, handler: handler });
	};

	this.listener = function (req, res) {

		// If there are any default headers to add, loop through and add them
		if (_options.headers) {
			Object.keys(_options.headers).forEach(function (key) {
				res.setHeader(key, _options.headers[key]);
			});
		}
        
        if(_options.cors) {
        
            res.setHeader("Access-Control-Allow-Origin", _options.cors);
            
            // handle this being a preflight request
            if(req.method === 'OPTIONS') {

                res.writeHead(200, {
                    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Credentials": true,
                    "Access-Control-Max-Age": '86400', // 24 hours
                    "Access-Control-Allow-Headers": "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept"
                });
                res.end();
                
                return;
            }
        }
        
        var routes = _routes[req.method];
        if (routes) {

            for (var i = 0; i < routes.length; i++) {

                var r = routes[i],
                    matches = r.url.exec(req.url);

                if (matches) {

                    r.handler(req, res, matches);
                    return;
                }
            }
        }

        res.writeHead(404);
        res.end('Not found');
	}
}

Router.prototype.get = function (url, handler) {
	this.addRoute('GET', url, handler);
};

Router.prototype.post = function (url, handler) {
	this.addRoute('POST', url, handler);
};

Router.prototype.put = function (url, handler) {
	this.addRoute('PUT', url, handler);
};

Router.prototype.del = function (url, handler) {
	this.addRoute('DELETE', url, handler);
};

Router.prototype.routeNotFound = function (req, res) {

	res.writeHead(404, {
		'Access-Control-Allow-Origin': '*'
	});
	res.end('Not found');
};

module.exports = Router;