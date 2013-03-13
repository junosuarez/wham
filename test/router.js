var chai = require('chai')
chai.should()
var sinon = require('sinon')
chai.use(require('sinon-chai'))

var Endpoint = require('../endpoint')
var Router = require('../router')

var noop = function (){}

describe('Router', function () {
  it('returns a connect middleware function based on an array of Endpoints', function () {
    var endpoints = [Endpoint('foo', '/foo')]
    var router = Router(endpoints)

    router.should.be.a('function')
  })

  it('matches endpoints based on path', function () {
    var endpoints = [Endpoint('foo', '/foo'), Endpoint('bar', '/bar/:id')]
    var router = Router(endpoints)
    router.match('/foo')[0].should.equal(endpoints[0])

    router.match('/bar/2')[0].should.deep.equal(endpoints[1])

  })

  it('calls handler functions by method by matched routes', function () {
    var handler = sinon.spy()
    var endpoints = [Endpoint('foo', '/foo')]
    endpoints[0].GET = handler

    var router = Router(endpoints)
    router({path: '/foo', method: 'GET'}, {})

    handler.should.have.been.called
  })

  it('parses url parameters into req.params object', function () {
    var handler = function (req, res) {
      req.should.have.property('params')
      req.params.should.deep.equal({
        bar: 'faa',
        baz: 'fum'
      })
    }
    var endpoints = [Endpoint('foo', '/foo/:bar/:baz')]
    endpoints[0].GET = handler

    var router = Router(endpoints)
    router({path: '/foo/faa/fum', method: 'GET'}, {})

  })

})