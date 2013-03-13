var chai = require('chai')
chai.should()
var expect = chai.expect
chai.use(require('chai-interface'))

var Endpoint = require('../endpoint')

describe('Endpoint', function () {
  it ('requires a tag and a path', function () {
    expect(function () {
      Endpoint()
    }).to.throw(/tag and path/)

    expect(function () {
      Endpoint('/foo/:id')
    }).to.throw(/tag and path/)

    expect(function () {
      Endpoint('foo', '/foo')
    }).not.to.throw()
  })
  it('path starts with a slash', function () {
    expect(function () {
      Endpoint('foo', 'foo')
    }).to.throw(/\//)
  })
  it('doesn\'t require new', function () {
    var e = Endpoint('foo', '/foo')
    e.should.be.instanceof(Endpoint)
  })
  it('builds a regex', function () {
    var e = Endpoint('foo', '/bax/:qux')
    e.pattern.should.be.instanceof(RegExp)
  })
  it('can add get handlers', function () {
    var handler = function () {}
    var e = Endpoint('foo', '/foo')
    expect(e.GET).to.equal(undefined)
    e.get(handler)
    e.GET.should.be.a('function')
  })
  it('can add post handlers', function () {
    var handler = function () {}
    var e = Endpoint('foo', '/foo')
    expect(e.POST).to.equal(undefined)
    e.post(handler)
    e.POST.should.be.a('function')
  })
  it('can add put handlers', function () {
    var handler = function () {}
    var e = Endpoint('foo', '/foo')
    expect(e.PUT).to.equal(undefined)
    e.put(handler)
    e.PUT.should.be.a('function')
  })
  it('can add delete handlers', function () {
    var handler = function () {}
    var e = Endpoint('foo', '/foo')
    expect(e.DELETE).to.equal(undefined)
    e.delete(handler)
    e.DELETE.should.be.a('function')
  })
  it('can chain multiple method handlers', function () {
    var handler = function () {}
    var e = Endpoint('foo', '/foo')
    e.get(handler).post(handler).put(handler).delete(handler)
    e.should.have.interface({
      GET: Function,
      PUT: Function,
      POST: Function,
      DELETE: Function
    })
  })
})
