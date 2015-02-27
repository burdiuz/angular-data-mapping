/**
 * Created by Oleg Galaburda on 25.02.2015.
 * @exports addType
 * @exports getType
 * @exports getNamespace
 * @exports createEntity
 * @exports isEntity
 * @exports isEntityClass
 */
/**
 * @type {Object<string,EntityNamespace>}
 */
var namespaces = {};
/**
 * @type {Function}
 */
var defaultType = null;
/**
 * @type {string}
 */
var defaultNamespace = '';
/**
 * @type {EntityMaps}
 */
var typeMaps = new EntityMaps();
/**
 * @function addType
 * @param {string|QNameEntity} name
 * @param {Function} constructor
 * @param {string} [namespace]
 */
function addType(name, constructor, namespace) {
  if (name instanceof QNameEntity) {
    namespace = name.localName;
    name = name.uri;
  }
  getNamespace(namespace).add(name, constructor);
}

/**
 * @function getType
 * @param {string|QNameEntity} name
 * @param {string} [namespace]
 * @returns {Function}
 */
function getType(name, namespace) {
  if (name instanceof QNameEntity) {
    namespace = name.localName;
    name = name.uri;
  }
  return getNamespace(namespace).get(name);
}

/**
 * @function getNamespace
 * @param {string} name
 * @returns {EntityNamespace}
 */
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

/**
 * @function createEntity
 * @param {Object} data
 * @param {Function} [constructor]
 * @param {Object} [entityTypeMap]
 * @return {Entity}
 */
function createEntity(data, constructor, entityTypeMap) {
  var instance;
  if (!constructor) {
    if (data instanceof Entity) {
      constructor = data.constructor || data.__proto__.constructor;
    } else if ("$$constructor" in data && data["$$constructor"]) {
      try {
        eval("constructor = window." + data["$$constructor"]);
      } catch (error) {
        console.log(error);
        throw new Error('Entity class "'+data["$$constructor"]+'" is not defined.');
      }
    }
  } else if (!Entity.isEntityClass(constructor)) {
    constructor = Entity.extend(constructor);
  }
  if (!constructor) constructor = Entity;
  instance = new constructor();
  typeMaps.create(instance);
  if (data) {
    instance.apply(data, entityTypeMap);
  }
  //console.log('Entity.create', instance, entityTypeMap);
  return instance;
}
/**
 * @function extend
 * @param {Function} constructor
 * @returns {Function}
 */
function extend(constructor) {
  constructor.prototype = new Entity();
  constructor.prototype.constructor = constructor;
  return constructor;
}
/**
 * @function isEntity
 * @param {Object} instance
 * @return {boolean}
 */
function isEntity(instance) {
  return instance instanceof Entity;
}
/**
 * @function isEntityClass
 * @param {Function} constructor
 * @return {boolean}
 */
function isEntityClass(constructor) {
  return constructor instanceof Function && (constructor === Entity || Entity.prototype.isPrototypeOf(constructor.prototype));
}