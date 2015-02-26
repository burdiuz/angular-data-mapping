
(function () {
	angular.module('aw.datamapping', []).provider('entityService',
    function EntityServiceProvider() {
    EntityServiceSharedInterface.apply(this);
    this.register = addType;
    this.setDefaultType = function (constructor) {
      defaultType = constructor;
    };
    this.setDefaultNamespace = function (name) {
      defaultNamespace = name || '';
    };
    this.$get = function EntityServiceFactory() {
      return new EntityService();
    };
  });
  function EntityService() {
    EntityServiceSharedInterface.apply(this);
    this.create = function (name, data, entityTypeMap, namespace) {
      var definition = this.get(name, namespace);
      return Entity.create(data, definition, entityTypeMap);
    };
    this.createNew = function (name, namespace) {
      var definition = this.get(name, namespace);
      return new definition();
    };
    this.factory = function (name, entityTypeMap, namespace) {
    };
    this.verify = function (data, strict) {
    };
  }
  function EntityServiceSharedInterface() {
    this.extend = function (constructor) {
      constructor.prototype = new Entity();
      constructor.prototype.constructor = constructor;
      return constructor;
    };
    this.isEntity = function (instance) {
      return instance instanceof Entity;
    };
    this.isEntityClass = function (constructor) {
      return constructor instanceof Function && (constructor === Entity || Entity.prototype.isPrototypeOf(constructor.prototype));
    };
    this.get = getType;
    this.getNamespace = getNamespace;
  }
var namespaces = {},
  defaultType = null,
  defaultNamespace = '';
function addType(name, constructor, namespace) {
  if(name instanceof QNameEntity){
    namespace = name.localName;
    name = name.uri;
  }
  getNamespace(namespace).add(name, constructor);
}
function getType(name, namespace) {
  if(name instanceof QNameEntity){
    namespace = name.localName;
    name = name.uri;
  }
  return getNamespace(namespace).get(name);
}
function getNamespace(name) {
  var namespace;
  name = name || defaultNamespace;
  if (namespaces.hasOwnProperty(name)) {
    namespace = namespaces[name];
  } else {
    namespaces[name] = namespace = new EntityNamespace(name);
  }
  return namespace;
}
function EntityNamespace(name) {
  name =  name ? String(name) : '';
  var definitions = {};
  Object.defineProperty(this, 'name', {value: name, writable: false, enumerable: true});
  this.add = function (name, definition) {
    if (definitions.hasOwnProperty(name)) {
      throw new Error('EntityNamespace "' + this.name + '" already has entity with name "' + name + '".');
    } else if (typeof(definition) !== "function") {
      throw new Error('EntityNamespace#add requires second parameter to be Entity constructor function.');
    } else {
      definitions[name] = definition;
    }
  };
  this.get = function (name) {
    var definition;
    name = name || defaultType;
    if (definitions.hasOwnProperty(name) && definitions[name] instanceof Function) {
      definition = definitions[name];
    } else {
      throw new Error('EntityNamespace "' + this.name + '" does not have entity with name "' + name + '".');
    }
    return definition;
  };
}
function Entity() {
  this.apply = function (data, entityTypeMap) {
    var self = this,
      param;
    function apply(value, entityType) {
      var result;
      if (value && typeof(value) === "object") {
        if (value instanceof Array) {
          result = applyArray(value, entityType);
        } else if (value instanceof Entity) {
          result = value.copy();
        } else {
          result = createEntity(value, entityType);
        }
      }
      return result || value;
    }
    function createEntity(data, entityType) {
      var result;
      if (entityType) {
        if(entityType instanceof QNameEntity || typeof(entityType)==='string'){
          entityType = getType(entityType);
        }
        if (typeof(entityType) === "function") {
          result = Entity.create(data, entityType);
        } else {
          result = Entity.create(data, entityType.constructor, entityType);
        }
      } else {
        result = Entity.create(data);
      }
      return result;
    }
    function applyArray(value, entityType) {
      var list = [];
      var length = value.length,
        index;
      for (index = 0; index < length; index++) {
        list[index] = apply(value[index], entityType);
      }
      return list;
    }
    for (param in data) {
      if (data.hasOwnProperty(param)) {
        if (this[param] instanceof Entity) {
          this[param].apply(data[param], entityTypeMap && entityTypeMap.hasOwnProperty(param) ? entityTypeMap[param] : null);
        } else {
          this[param] = apply(data[param], entityTypeMap && entityTypeMap.hasOwnProperty(param) ? entityTypeMap[param] : null);
        }
      }
    }
  };
  this.copy = function () {
    var inst = new (this.constructor || this.__proto__.constructor)(),
      param,
      value;
    function copy(value) {
      var result = value;
      if (value && typeof(value) === "object") {
        if (value instanceof Array) {
          result = copyArray(value);
        } else if (value instanceof Entity) {
          result = value.copy();
        }
      }
      return result;
    }
    function copyArray(value) {
      var list = [],
        index;
      var length = value.length;
      for (index = 0; index < length; index++) {
        list[index] = copy(value[index]);
      }
      return list;
    }
    for (param in this) {
      if (this.hasOwnProperty(param)) {
        value = this[param];
        if (typeof(value) === "function") continue;
        inst[param] = copy(value);
      }
    }
    return inst;
  };
  this.valueOf = function (depth) {
    if (isNaN(depth)) depth = 0;
    var originals = [],
      values = [],
      result = {},
      param,
      value;
    function valueOf(value, depth) {
      var result;
      if (depth >= 0 && value && typeof(value) === "object") {
        if (value instanceof Array) {
          result = valueOfArray(value, depth ? depth - 1 : 0);
        } else {
          result = valueOfObject(value, depth ? depth - 1 : 0);
        }
      } else {
        result = value;
      }
      return result;
    }
    function valueOfArray(value, depth) {
      var list = [],
        length = value.length,
        index;
      for (index = 0; index < length; index++) {
        list[index] = valueOf(value[index], depth);
      }
      return list;
    }
    function valueOfObject(value, depth) {
      var index = originals.indexOf(value),
        result;
      if (index >= 0) {
        result = values[index];
      } else {
        originals.push(value);
        result = "valueOf" in value ? value.valueOf() : value;
        values[index] = result;
      }
      return result;
    }
    for (param in this) {
      if (param.charAt() === "$") continue;
      value = this[param];
      if (typeof(value) !== "function" && value !== "" && value !== null && value !== undefined) {
        result[param] = valueOf(this[param], depth);
      }
    }
    return result;
  };
}
Entity.create = function Entity_create(data, constructor, entityTypeMap) {
  var instance;
  if (!constructor) {
    if (data instanceof Entity) {
      constructor = data.constructor || data.__proto__.constructor;
    } else if ("$constructor" in data && data["$constructor"]) {
      try {
        eval("constructor = window." + data["$constructor"]);
      } catch (error) {
        console.log(error);
      }
    }
  } else if (!Entity.isEntityClass(constructor)) {
    constructor = Entity.extend(constructor);
  }
  if (!constructor) constructor = Entity;
  instance = new constructor();
  if (data) {
    instance.apply(data, entityTypeMap);
  }
  return instance;
};
function QNameEntity(name, uri) {
  this.localName = name ? String(name) : '';
  this.uri = uri ? String(uri) : '';
}
addType('QName', QNameEntity);
})();