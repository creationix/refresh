// Mini XML parser.  Just enough for WebDav

var Matchers = {
  header: /^<\?xml version="1.0" encoding="([a-z0-9-]+)" \?>[\s\n]*/,
  open: /^<([a-z:]+)(\s+[a-z:]+="(?:[^"]+|\\")")*>[\s\n]*/i,
  both: /^<([a-z:]+)(\s+[a-z:]+="(?:[^"]+|\\")")*\s*\/>[\s\n]*/i,
  close: /^<\/([a-z:]+)>[\s\n]*/i,
  plain: /^[\s\n]*([^<]+)[\s\n]*/
};

function find_match(part) {
  var name, match;
  for (name in Matchers) {
    if (match = part.match(Matchers[name])) {
      match.name = name;
      return match;
    }
  }
  throw new Error("XML Parse Error: " + JSON.stringify(part.substr(0,20)));
}

exports.parse = function parse(xml) {
  var pos = 0,
      length = xml.length;
      tree = {};
      stack = [],
      current = tree;
  // Left trim whitespace
  xml = xml.replace(/^[\s\n]*/, '');
  while (pos < length) {
    var match = find_match(xml.substr(pos));
    pos += match[0].length
    switch (match.name) {
      case "open":
        current[match[1]] = {}
        stack.push(current);
        current = current[match[1]];
      break;
      case "both":
        current[match[1]] = {};
      break;
      case "close":
        current = stack.pop();
      break;
      case "plain":
        current._ = match[1];
      break;
    }
  }
  return tree;
}

// var xml = '<?xml version="1.0" encoding="utf-8" ?>\n\
// <D:propfind xmlns:D="DAV:">\n\
//   <D:prop xmlns:R="http://www.foo.bar/boxschema/">\n\
//        <R:bigbox/>\n\
//        <R:author/>\n\
//        <R:DingALing/>\n\
//        <R:Random/>\n\
//   </D:prop>\n\
// </D:propfind>';
// 
// var json = {
//   propfind: {
//     prop: {
//       bigbox: null,
//       author: null,
//       DingALing: null,
//       Random: null
//     }
//   }
// };
// 
// process.mixin(require('sys'));
// p(exports.parse(xml));