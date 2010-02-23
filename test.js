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
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.write(inspect(req));
  res.close();
}).listen(6543);
