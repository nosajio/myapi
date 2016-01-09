'use strict';
var storage = require('node-persist');
var RSS = require('rss');

module.exports = function feedHandler (req, res, next) {
  var feedOptions = {
    title: 'nosaj.io',
    description: 'A blog about making things with technology',
    feed_url: 'http://rss.nosaj.io',
    site_url: 'http://nosaj.io',
    ttl: 15
  };

  var storageOptions = {
    dir: '../../persist',
    ttl: false
  };

  var feed = new RSS( feedOptions );
  storage.initSync( storageOptions );

  var posts = storage.values();

  if (! posts) {
    console.error('Posts returned empty for rss endpoint');
    res.writeHead(204);
    return res.end();
  }

  // Sort posts newest first
  posts = posts.sort( function (a, b) {
    return b.index > a.index;
  });

  posts.forEach( function (post) {
    var feedItem = {
      title: post.title,
      description: post.body,
      link: `http://nosaj.io/#/${post.meta.slug}`,
      author: 'jason@nosaj.io',
      date: new Date(post.meta.date)
    };

    if (post.image) {
      feedItem.image = image;
    }

    feed.item( feedItem );
  });


  res.setHeader('Content-Type', 'application/rss+xml');
  res.end( feed.xml() );
}
