var connect = require('connect')
var http = require('http')
var responsible = require('responsible')
var qed = require('qed')

function Wham (serviceName) {
  var endpoints = []

  var stack = connect()
  stack.use(parseUrl)
  stack.use(connect.query())

  var wham = function (name, path) {
    var endpoint = new Endpoint(name, path)
    endpoints.push(endpoint)
    return endpoint
  }

  wham.bam = function (port) {
    // start this wreck
    stack.use(responsible)
    stack.use(Router(endpoints))

    http.createServer(stack).listen(port)

    //console.log('started ' + serviceName + ' on ' + port)
    stack.started = true
  }

  wham.use = function (middleware) {
    if (!stack.started) { stack.use(middleware) }
    return wham
  }

  wham.endpoints = endpoints
  return wham

}

var url = require('url')
function parseUrl(req, res, next) {
  req.path = url.parse(req.url).pathname
  next()
}

function Endpoint (name, path) {
  if (!(this instanceof Endpoint)) {
    return new Endpoint(name, path)
  }

  this.name = name
  this.path = path
  this._regex = new RegExp()
}

['get','post','put','delete'].forEach(function (method) {
  Endpoint.prototype[method] = function (opts, fn, args) {
    // if (typeof opts === 'function') {
    //   fn = opts
    //   opts = {}
    //   args = Array.prototype.slice.call(arguments, 1)
    // }
    // else { args = Array.prototype.slice.call(arguments, 2) }

    var args = Array.prototype.slice.call(arguments, typeof opts === 'function' ? 0 : 1)

    console.log(args, typeof opts, typeof args[0])
    this[method.toUpperCase()] = qed.apply(null, args)

    //console.log(method.toUpperCase() + 'ing ' + this.name + ' (' + this.path + ')')
  }
})

function handle() {
  console.log('handlin', this)
}

var _ = require('lodash')
function Router(endpoints) {
  return function (req, res, next) {
    console.log('Req rcevied:', req.url, req.method, req.path, endpoints)
    var endpoint = _.find(endpoints, function (endpoint) {
      console.log(endpoint.path, req.path)
      return endpoint.path === req.path
    })
    //console.log('at', endpoint)
    if (endpoint) {
      console.log('EP', endpoint)
      if (typeof endpoint[req.method] === 'function') {
        console.log('foo', endpoint[req.method])
        return endpoint[req.method](req, res)
      }
      console.log('no')
      return res.send(400, new Error('Unsupoprted method for ' + endpoint.name))
      return res.error(new Error('Unsupported method for ' + endpoint.name))
    }

    defaultRoute(req, res, next)

  }
}

function defaultRoute(req, res, next) {
  //console.log(defaultRoute)
  res.send(404)
}

module.exports = Wham