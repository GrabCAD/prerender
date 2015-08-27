var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');

module.exports = {
	init: function(){
		this.cache = cacheManager.caching({
			store: redisStore,
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
			ttl: process.env.CACHE_TTL
		});
	},

	beforePhantomRequest: function(req, res, next) {
		var key = "prerender:" + req.prerender.url;
		this.cache.get(key, function (err, result) {
			if (!err && result) {
				res.send(200, result);
			} else {
				next();
			}
		});
	},

	afterPhantomRequest: function(req, res, next) {
		var key = "prerender:" + req.prerender.url;
		this.cache.set(key, req.prerender.documentHTML, {}, function(err){});
		next();
	}
}
