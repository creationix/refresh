var Xml = require('./lib/simplexml');
var source = require('./provider');
var PORT = 6543;
var HOST = "127.0.0.1";

var tree = {
  people: [
    {name: "Tim", age: 27},
    {name: "Jack", age: 3}
  ],
  colors: [0xff8800, 0x223322]
}

var http = require('http');
process.mixin(require('sys'));

// "OPTIONS, GET, HEAD, POST, TRACE, PROPFIND, PROPPATCH, MKCOL, COPY, PUT, DELETE, MOVE, LOCK, UNLOCK, BIND, REBIND, UNBIND, VERSION-CONTROL"
var Handlers = {
  OPTIONS: function (req, res, body) {
    res.writeHeader(200, {
      Dav: "1,2",
      Allow: Object.keys(Handlers).join(', '),
    });
    res.close();
  },
  PROPFIND: function (req, res, body) {
    var results = {};
    var xml = Xml.parse(body);
    Object.keys(xml.propfind.prop).forEach(function (name) {
      var value = source.getProp(req.url, name);
      var group = "HTTP/1.1 200 OK";
      if (value === undefined) {
        var group = "HTTP/1.1 404 Not Found";
      }
      if (!results[group]) {
        results[group] = {};
      }
      results[group][name] = value;
    })
    var output = Xml.render({
      multistatus: {
        response: {
          href: address + req.url,
          propstat: Object.keys(results).map(function (group) {
            return {
              prop: results[group],
              status: group
            }
          })
        }
      }
    });
    puts(output);
    res.writeHeader(207, "Multi Status", {
      "Content-Type": 'text/xml; charset="utf-8"',
      "Content-length": output.length
    });
    res.write(output);
    res.close();
  },
  MKCOL: function (req, res, body) {
    if (source.makeCol(req.url)) {
      res.writeHeader(201, "Created", {});
      res.close();
    } else {
      res.writeHeader(409, "Conflict", {});
      res.close();
    }
  },
  DELETE: function (req, res, body) {
    // TODO: Implement
    if (source.del(req.url)) {
      res.writeHeader(204, "No Content", {});
      res.close();
    } else {
      res.writeHeader(404, "Not Found", {});
      res.close();
    }
  },
  PUT: function (req, res, body) {
    if (source.put(req.url, { mime: req.headers['content-type'], content: body})) {
      res.writeHeader(201, "Created", {});
      res.close();
    } else {
      res.writeHeader(409, "Conflict", {});
      res.close();
    }
  },
  GET: function (req, res, body) {
    var data;
    if (data = source.get(req.url)) {
      res.writeHeader(200, {
        "Content-Type": data.mime,
        "Content-Length": data.content.length
      });
      res.write(data.content);
      res.close();
    } else {
      res.writeHeader(404, {});
      res.close();
    }
  },
  POST: function () {},
};

http.createServer(function (req, res) {
  puts("\"" + req.method + " " + req.url + " HTTP/" + req.httpVersionMajor + "." + req.httpVersionMinor + "\"");
  p(source.data);
  var close = res.close;
  res.close = function () {
    // Common Log Format (mostly)
    puts(req.connection.remoteAddress + " - - [" + (new Date()).toUTCString() + "] \"" + req.method + " " + req.url + " HTTP/" + req.httpVersionMajor + "." + req.httpVersionMinor + "\" " + res.statusCode + " " + res.output[0].length + " \"" + (req.headers['referrer'] || "") + "\" \"" + req.headers["user-agent"] + "\"");
    return close.apply(res, arguments);
  }
  var writeHeader = res.writeHeader;
  res.writeHeader = function (code) {
    res.statusCode = code;
    return writeHeader.apply(res, arguments);
  }
  function get_body(callback) {
    var content = '';
    req.addListener('data', function (chunk) {
      content += chunk;
    });
    req.addListener('end', function () {
      callback(content);
    });
  }
  if (Handlers[req.method]) {
    get_body(function (body) {
      Handlers[req.method](req, res, body);
    });
  } else {
    get_body(function (body) {
      p(req);
      p(body);
      res.writeHeader(500, {'Content-Type': 'text/plain'});
      res.write(body);
      res.close();
    });
  }
}).listen(6543);

var address = "http://" + HOST + ":" + PORT;
puts("SERVER STARTED ON " + address);

process.addListener("uncaughtException", function (err) {
  error(err.stack);
});