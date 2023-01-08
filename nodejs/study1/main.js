var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var template = require('./lib/template.js')

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  var title = queryData.id;
  console.log(pathname);

  if (pathname === '/') {

    if (queryData.id == undefined) {
      fs.readdir('./data', function(error, filelist) {
        var title = "Welcome";
        var description = 'Hello, Node.js';
        list = template.list(filelist);
        var html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>,`,
        `<a href="/create">create</a>`)
        response.writeHead(200);
        response.end(html);
      })

    } else {
      fs.readdir('./data', function(error,  filelist) {
        list = template.list(filelist);
        var filteredId = path.parse(queryData.id).base;  
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']
      });
        var html = template.HTML(title, list, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
        `<a href="/create">create</a>
        <a href="/update?id=${sanitizedTitle}">update</a>
      <form action ="/delete_process" method = "post">
        <input type = "hidden" name="id" value="${sanitizedTitle}">
        <input type = "submit" value="delete">
      </form>
      `);

        response.writeHead(200);
        response.end(html);
      });
    });
  }
}
    else if(pathname === '/create') {
    fs.readdir('./data', function(error, filelist) {
      var title = "Web - create";

      list = template.list(filelist);
      var html = template.HTML(title, list, `
      <form action="http://localhost:3000/create_process" method = "post">
<p>
    <input type="text" name="title" placeholder="title">
</p>
<p> 
    <textarea name = "description" placeholder="description"></textarea>
</p>
<p> 
    <input type="submit">
</p>
</form>
      `,'')
      response.writeHead(200);
      response.end(html);
    });
  } else if(pathname === '/create_process') {
    var body = ''
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
    });

  } else if(pathname==='/update') {
    fs.readdir('./data', function(error, filelist) {
      list = template.list(filelist);
      var filteredId = path.parse(queryData.id).base; 
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = queryData.id;
      var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']
      });
      console.log(description);
      var html = template.HTML(title, list,
      `<form action="/update_process" method = "post">
          <input type="hidden" name="id" placeholder="title" value="${sanitizedTitle}">
      <p> 
          <input type="text" name="title" placeholder="title" value="${sanitizedTitle}">
      </p>
      <p> 
          <textarea name = "description" placeholder="description">${sanitizedDescription}</textarea>
      </p>
      <p> 
          <input type="submit">
      </p>
      </form>`,'');
      response.writeHead(200);
      response.end(html);
    });
  });
  }else if(pathname === '/update_process') { // 업데이트
    var body = ''
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(err){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      })
    });
  }); 
}else if(pathname ==='/delete_process') {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    var post = qs.parse(body);
    var id = post.id;
    var filteredId = path.parse(post.id).base; 
    fs.unlink(`data/${filteredId}`, function(error) {
      response.writeHead(302, {Location: `/`});
      response.end();
    })
  });
}else {
    response.writeHead(404);
    response.end("Not Found");
  } 
});
app.listen(3000);