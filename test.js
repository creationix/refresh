var tree = {
  people: [
    {name: "Tim", age: 27},
    {name: "Jack", age: 3}
  ],
  colors: [0xff8800, 0x223322]
}

var http = require('http');
process.mixin(require('sys'));

http.createServer(function (req, res) {
  
  function get_body(callback) {
    var content = '';
    req.addListener('data', function (chunk) {
      content += chunk;
    });
    req.addListener('end', function () {
      callback(content);
    });
  }
  switch(req.method) {
    case 'OPTIONS':
      res.writeHeader(200, {
        Dav: "1,2,3,bind,bind",
        Allow: "OPTIONS, GET, HEAD, POST, TRACE, PROPFIND, PROPPATCH, MKCOL, COPY, PUT, DELETE, MOVE, LOCK, UNLOCK, BIND, REBIND, UNBIND, VERSION-CONTROL",
        "Ms-Author-Via": "DAV",
      });
      res.write(inspect(req));
      res.close();
      break;
    case "PROPFIND":
      // Sample body captured from WebDAVFS/1.8 (01808000) Darwin/10.2.0 (x86_64)
        // <?xml version="1.0" encoding="utf-8"?>
        // <D:propfind xmlns:D="DAV:">
        // <D:prop>
        // <D:getlastmodified/>
        // <D:getcontentlength/>
        // <D:resourcetype/>
        // </D:prop>
        // </D:propfind>
      // Sample response from sling
      get_body(function (body) {
        p(req);
        puts(body);
        res.writeHeader(200, {'Content-Type': 'application/json'});
        res.write(inspect(req));
        res.close();
      });
      break;
    default:
      p(req);
      res.writeHeader(200, {'Content-Type': 'application/json'});
      res.write(inspect(req));
      res.close();
      break;
  }
}).listen(6543);
