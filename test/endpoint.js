var chai = require('chai')
chai.should()
var expect = chai.expect

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

  })
})
