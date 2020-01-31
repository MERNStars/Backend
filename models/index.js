
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');

// optionally:
//mongoose.set('debug', true);

exports.Presenter = require('./presenter');
exports.Request = require('./request');
exports.Event = require("./event");
exports.User = require("./user");