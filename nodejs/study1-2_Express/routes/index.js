var express = require('express');
var router = express.Router()
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

router.get('/', function (request, response) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <h2>${title}</h2>${description}
      <img src="/images/image1.jpg" style="width:300px; display:block;">
      `,
      `<a href="/topic/create">create</a>
      `
    );
    response.send(html);
});
module.exports = router