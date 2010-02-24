var data = [];

function find(path) {
  if (path === '/' || path === '') {
    return data;
  }
  return path.replace(/[^a-z\/]/g, '').split('/').reduce(function (data, name) {
    if (name === "") return data;
    return data[name];
  }, data);
}

module.exports = {
  getProp: function (path, name) {
    var obj = find(path);
    if (name === "getlastmodified") {
      return (new Date()).toUTCString();
    }
    if (name === "resourcetype") {
      return "container";
    }
    if (obj.hasOwnProperty(name)) {
      return obj[name];
    }
  },
  get: function (path) {
    var pos = path.lastIndexOf('/');
    var name = path.substr(pos + 1);
    path = path.substr(0, pos);
    var parent = find(path);
    if (parent && parent.hasOwnProperty(name)) {
      return parent[name];
    }
  },
  put: function (path, contents) {
    var pos = path.lastIndexOf('/');
    var name = path.substr(pos + 1);
    path = path.substr(0, pos);
    var parent = find(path);
    if (parent && !parent.hasOwnProperty(name)) {
      parent[name] = contents;
      return parent[name];
    }
  },
  makeCol: function (path) {
    path = path.substr(0, path.length - 1);
    var pos = path.lastIndexOf('/');
    var name = path.substr(pos + 1);
    path = path.substr(0, pos);
    var parent = find(path);
    if (parent && !parent.hasOwnProperty(name)) {
      parent[name] = [];
      return parent[name];
    }
  },
  del: function (path) {
    path = path.substr(0, path.length - 1);
    var pos = path.lastIndexOf('/');
    var name = path.substr(pos + 1);
    path = path.substr(0, pos);
    var parent = find(path);
    if (parent && parent.hasOwnProperty(name)) {
      delete parent[name];
      return true;
    }
  },
  data: data
}

