function Router() {

	if (!(this instanceof Router)) {
		return new Router();
	}

	var _routes = {};

	this.addRoute = function (type, url, handler) {

		if (!(url instanceof RegExp)) {
			url = RegExp(url);
		}
		(_routes[type] || (_routes[type] = [])).push({ url: url, handler: handler });
	};

	this.listener = function (req, res) {

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

module.exports = Router;