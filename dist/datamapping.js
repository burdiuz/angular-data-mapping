(function () {
  angular.module('aw.datamapping', []).provider('entityService',
    function EntityServiceProvider() {
      EntityServiceSharedInterface.apply(this);
      this.register = function (name, constructor, namespace){
        addType(name, constructor, namespace);
      };
      this.setDefaultType = function (constructor) {
        defaultType = constructor;
      };
      this.setDefaultNamespace = function (name) {
        defaultNamespace = name || '';
      };
      this.$get =
        function EntityServiceFactory() {
          return new EntityService();
        };
    }
  );
  function EntityService() {
    EntityServiceSharedInterface.apply(this);
    this.create = function (name, data, entityTypeMap, namespace) {
      var definition = this.get(name, namespace);
      return createEntity(data, definition, entityTypeMap);
    };
    this.createNew = function (name, namespace) {
      var definition = this.get(name, namespace);
      return new definition();
    };
    this.factory = function (name, entityTypeMap, namespace) {
      var self = this;
      return function(data){
        self.create(name, data, entityTypeMap, namespace);
      };
    };
    this.verify = function (data) {
      return typeMaps.verify(data);
    };
  }
  function EntityServiceSharedInterface() {
    this.extend = extend;
    this.isEntity = isEntity;
    this.isEntityClass = isEntityClass;
    this.get = getType;
    this.getNamespace = getNamespace;
  }
var namespaces = {};
var defaultType = null;
var defaultNamespace = '';
var typeMaps = new EntityMaps();
function addType(name, constructor, namespace) {
  if (name instanceof QNameEntity) {
    namespace = name.localName;
    name = name.uri;
  }
  getNamespace(namespace).add(name, constructor);
}
function getType(name, namespace) {
  if (name instanceof QNameEntity) {
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
function createEntity(data, constructor, entityTypeMap) {
  var instance;
  if (!constructor) {
    if (data instanceof Entity) {
      constructor = data.constructor || data.__proto__.constructor;
    } else if ("$constructor" in data && data["$constructor"]) {
      try {
        eval("constructor = window." + data["$constructor"]);
      } catch (error) {
        console.log(error);
        throw new Error('Entity class "'+data["$constructor"]+'" is not defined.');
      }
    }
  } else if (!isEntityClass(constructor)) {
    constructor = extend(constructor);
  }
  if (!constructor) constructor = Entity;
  instance = new constructor();
  typeMaps.create(instance);
  if (data) {
    instance.apply(data, entityTypeMap);
  }
  return instance;
}
function extend(constructor) {
  constructor.prototype = new Entity();
  constructor.prototype.constructor = constructor;
  return constructor;
}
function isEntity(instance) {
  return instance instanceof Entity;
}
function isEntityClass(constructor) {
  return constructor instanceof Function && (constructor === Entity || Entity.prototype.isPrototypeOf(constructor.prototype));
}
function Dictionary() {
  var keys;
  var values;
  this.add = function (key, value) {
    keys.push(key);
    values.push(value);
  };
  this.get = function (key) {
    var index = keys.indexOf(key);
    return index >= 0 ? values[index] : null;
  };
  this.getFirstKey = function (value) {
    var index = values.indexOf(value);
    return index >= 0 ? keys[index] : null;
  };
  this.getAllKeys = function (value) {
    var list = [],
      index = -1;
    while((index = values.indexOf(value, index))>=0){
      list.push(values[index]);
      index++;
    }
    return list;
  };
  this.has = function (key) {
    return keys.indexOf(key) >= 0;
  };
  this.remove = function (key) {
    var index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      values.splice(index, 1);
    }
  };
  this.clear = function () {
    keys = [];
    values = [];
  };
  this.clear();
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
function EntityMaps(){
  var maps = new Dictionary();
  this.create = function(object, propertyTypes){
    var map;
    var definition = getDefinition(object);
    map = maps.get(definition);
    if(!map){
      map = {};
      for (var param in object) {
        if (object.hasOwnProperty(param) && typeof(object[param]) != "function") {
          if(propertyTypes && propertyTypes.hasOwnProperty(param)){
            map[param] = propertyTypes[param];
          }else {
            var value = object[param];
            if (value !== undefined) {
              map[param] = value.constructor instanceof Function && value instanceof value.constructor ? value.constructor : typeof(value);
            }
          }
        }
      }
      maps.add(definition, map);
    }
    return map;
  };
  this.has = function(object){
    return maps.has(getDefinition(object));
  };
  this.hasDefinition = function(definition){
    return maps.has(definition);
  };
  this.verify = function(object, deep){
    var map = maps.get(getDefinition(object));
    if(!map) return undefined;
    var result = true;
      for (var param in map) {
        if (!map.hasOwnProperty(param)) continue;
        var valueType = map[param];
        console.log(param, valueType);
        if(typeof(valueType)=="string"){
          result = typeof(object[param]) == valueType;
        }else{
          result = object[param] instanceof valueType;
        }
        if(!result) break;
      }
    return result;
  };
  function getDefinition(object){
    return object.constructor instanceof Function ? object.constructor : object.__proto__.constructor;
  }
}
function Entity() {
  this.property = function(name, value, readOnly, valueType){
    if(typeof(value)=="undefined" && !valueType) throw new Error("Property must have a default value ot type defined to determine its type.");
    if(!valueType) valueType = value.constructor instanceof Function && value instanceof value.constructor ? value.constructor : typeof(value);
    var descriptor = {
      get: function(){
        return value;
      },
      enumerable: true
    };
    if(!readOnly){
      if(typeof(valueType)=="string") descriptor.set = mutator_type;
      else descriptor.set = mutator_class;
    }
    Object.defineProperty(this, name, descriptor);
    function mutator_type(newValue){
      if(typeof(newValue)==valueType){
        value = newValue;
      }else{
        throw new Error('Property "'+name+'" value must be of "'+valueType+'" type, "'+typeof(newValue)+'" passed.');
      }
    }
    function mutator_class(newValue){
      if(newValue instanceof valueType){
        value = newValue;
      }else{
        throw new Error('Property "'+name+'" new value of wrong type.');
      }
    }
  };
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
          result = createObject(value, entityType);
        }
      }
      return result || value;
    }
    function createObject(data, entityType) {
      var result;
      if (entityType) {
        if(entityType instanceof QNameEntity || typeof(entityType)==='string'){
          entityType = getType(entityType);
        }
        if (typeof(entityType) === "function") {
          result = createEntity(data, entityType);
        } else {
          result = createEntity(data, entityType.constructor, entityType);
        }
      } else {
        result = createEntity(data);
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
  this.valueOf = function (depth, filterEmpty) {
    if (isNaN(depth)) depth = 0;
    var originals = [],
      values = [],
      result = {},
      param,
      value;
    function valueOf(value, depth, filterEmpty) {
      var result;
      if (depth >= 0 && value && typeof(value) === "object") {
        if (value instanceof Array) {
          result = valueOfArray(value, depth ? depth - 1 : 0, filterEmpty);
        } else {
          result = valueOfObject(value, depth ? depth - 1 : 0, filterEmpty);
        }
      } else {
        result = value;
      }
      return result;
    }
    function valueOfArray(value, depth, filterEmpty) {
      var list = [],
        length = value.length,
        index;
      for (index = 0; index < length; index++) {
        list[index] = valueOf(value[index], depth, filterEmpty);
      }
      return list;
    }
    function valueOfObject(value, depth, filterEmpty) {
      var index = originals.indexOf(value),
        result;
      if (index >= 0) {
        result = values[index];
      } else {
        originals.push(value);
        if("valueOf" in value && value["valueOf"] instanceof Function){
          if(value instanceof Entity){
            result = value.valueOf(depth, filterEmpty);
          }else{
            result = value.valueOf();
          }
        }else result = value;
        values[index] = result;
      }
      return result;
    }
    for (param in this) {
      value = this[param];
      if (typeof(value) !== "function") {
        if(filterEmpty && (value === "" || value === null || value === undefined)) continue;
        result[param] = valueOf(this[param], depth, filterEmpty);
      }
    }
    return result;
  };
}
window.Entity = Entity;
function QNameEntity(name, uri) {
  this.localName = name ? String(name) : '';
  this.uri = uri ? String(uri) : '';
}
addType('QName', QNameEntity);
})();