var xml_parse = require('./lib/simplexml').parse;

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
  OPTIONS: function (req, res, xml) {
    res.writeHeader(200, {
      Dav: "1",
      Allow: Object.keys(Handlers).join(', '),
    });
    res.close();
  }
};

http.createServer(function (req, res) {
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
      Handlers[req.method](req, res, xml_parse(body));
    });
  } else {
    get_body(function (body) {
      res.writeHeader(500, {'Content-Type': 'text/plain'});
      res.write(body);
      res.close();
    });
  }
}).listen(6543);
puts("SERVER STARTED ON http://127.0.0.1:6543/");

process.addListener("uncaughtException", function (err) {
  error(err.stack);
});