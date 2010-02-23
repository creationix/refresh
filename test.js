var tree = {
  people: [
    {name: "Tim", age: 27},
    {name: "Jack", age: 3}
  ],
  colors: [0xff8800, 0x223322]
}

var http = require('http');
process.mixin(require('sys'));

// A super dumb xml parser that works enough for our needs.
function get_props(xml) {
  var props = xml.match(/<D:\w+\/>/g);
  props = props.map(function (prop) {
    return prop.match(/<D:(\w+)\/>/)[1];
  })
  puts(xml);
  return props;
}

function propfind(props, callback) {
  
  
}

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
        //   <D:prop>
        //     <D:getlastmodified/>
        //     <D:getcontentlength/>
        //     <D:resourcetype/>
        //   </D:prop>
        // </D:propfind>
      // Sample response from sling
        // <?xml version="1.0" encoding="UTF-8"?>
        // <D:multistatus xmlns:D="DAV:">
        //   <D:response>
        //     <D:href>http://127.0.0.1:8080/</D:href>
        //     <D:propstat>
        //       <D:prop>
        //         <D:resourcetype><D:collection/></D:resourcetype>
        //         <D:getlastmodified>Tue, 23 Feb 2010 21:02:41 GMT</D:getlastmodified>
        //       </D:prop>
        //       <D:status>HTTP/1.1 200 OK</D:status>
        //     </D:propstat>
        //     <D:propstat>
        //       <D:prop>
        //         <D:getcontentlength/>
        //       </D:prop>
        //       <D:status>HTTP/1.1 404 Not Found</D:status>
        //     </D:propstat>
        //   </D:response>
        // </D:multistatus>
      
      get_body(function (body) {
        var json = get_props(body)
        p(json);
        <?xml version="1.0" encoding="UTF-8"?><D:multistatus xmlns:D="DAV:"><D:response><D:href>http://127.0.0.1:8080/</D:href><D:propstat><D:prop><D:resourcetype><D:collection/></D:resourcetype><D:getlastmodified>Tue, 23 Feb 2010 21:02:41 GMT</D:getlastmodified></D:prop><D:status>HTTP/1.1 200 OK</D:status></D:propstat><D:propstat><D:prop><D:getcontentlength/></D:prop><D:status>HTTP/1.1 404 Not Found</D:status></D:propstat></D:response></D:multistatus>
        
        res.writeHeader(200, {
          "Content-Type": "text/xml; charset=utf-8",
          "Content-Length": xml.length
        });
        
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
