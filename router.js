var _ = require('lodash')

var proto = {} //Object.create(Function.prototype, {})

function Router(endpoints) {
  var router = function (req, res, next) {
    //console.log('Req rcevied:', req.method, req.path)
    var match = router.match(req.path)

    if (match) {
      var endpoint = match[0]

      if (typeof endpoint[req.method] === 'function') {
        req.params = match[1] || {}
        return endpoint[req.method](req, res)
      }

      return res.send(400, new Error('Unsupoprted method for ' + endpoint.name))
      return res.error(new Error('Unsupported method for ' + endpoint.name))
    }
    defaultRoute(req, res, next)

  }
  
  router.__proto__ = proto // https://gist.github.com/jden/5149561
  router.endpoints = endpoints
  
  return router
}

proto.match = function(path) {
  for (var i = this.endpoints.length-1; i >= 0; i--) {
    var endpoint = this.endpoints[i]
    var matches = path.match(endpoint.pattern)
    if (matches) break;
  }
  if (!matches) { return false; }
  if (endpoint.parameters.length === 0) {
    return [endpoint]
  }
  var params = {}
  endpoint.parameters.forEach(function (parameter, i) {
    params[parameter] = matches[i+1]
    if (params[parameter] === void 0) {
      params[parameter] = endpoint.defaults[parameter]
    }
  })
  return [endpoint, params]
}

function defaultRoute(req, res, next) {
  //console.log(defaultRoute)
  res.send(404)
}

module.exports = Router