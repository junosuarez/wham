# wham
whimsical web framework

this is a work in progress. life a the bleeding edge! i sure hope you know what you're doing....


## a peek at what your life could be like:

    var wham = require('wham')('demo')

    var shows = require('./core/shows')

    wham('showsList', '/shows')
      .get(shows.list, 'req.query.skip', 'req.query.limit', 'req.user')

    wham('upcomingShows', '/shows/upcoming')
      .get(shows.listFuture, 'req.query.skip', 'req.query.limit', 'req.user')

    wham('upvote', '/shows/:id/upvote')
      .put({auth: true},
        shows.upvoteShow, 'req.params.id', 'req.user')

    wham('downvote', '/shows/:id/downvote')
      .put({auth: true},
        shows.upvoteShow, 'req.params.id', 'req.user')

    wham.bam(2323)

## author

jden <jason@denizac.org>

## license

MIT. (c) 2013 jden <jason@denizac.org>. See LICENSE.md