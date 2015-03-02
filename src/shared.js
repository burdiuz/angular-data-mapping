/**
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
    namespace = name.uri;
    name = name.localName;
  }
  if(!isEntityClass(constructor)){
    constructor = extend(constructor);
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
    namespace = name.uri;
    name = name.localName;
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
  }else if(typeof(constructor)!=="function"){
    constructor = getType(constructor);
  }
  if(constructor) {
    if(!isEntityClass(constructor)) constructor = extend(constructor);
  }else constructor = Entity;
  instance = new constructor();
  typeMaps.create(instance);
  if (data) {
    instance.apply(data, entityTypeMap);
  }
  //console.log('create', instance, entityTypeMap);
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
 * @param {string|QNameEntity} name
 * @return {boolean}
 */
function isEntity(instance, name) {
  if(name){
    return instance instanceof getType(name);
  }
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