var connect = require('connect')
var http = require('http')
var responsible = require('responsible')
var qed = require('qed')
var Endpoint = require('./endpoint')
var Router = require('./router')

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


module.exports = Wham