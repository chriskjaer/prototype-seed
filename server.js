'use strict';

var express = require('express'),
        app = express(),
       path = require('path'),
       auth = require('http-auth');


var basic = auth.basic({
    realm: 'Prototype'
  }, function(username, password, callback) {
    callback(username === USER && password === PASS);
  });

// Auth Config
var USER = 'prototype',
    PASS = 'iddqd',
    USEAUTH = false;


app.use(express.static(path.resolve('./build')));

if (USEAUTH) {
  app.use(auth.connect(basic));
}

//Heroku
module.exports = app;
