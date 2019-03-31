'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const initmongodb = require('../db/mongodb/initdb');
module.exports = app; // for testing

initmongodb();

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});
