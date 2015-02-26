/**
 * Created by Oleg Galaburda on 25.02.2015.
 * @exports addType
 * @exports getType
 * @exports getNamespace
 */
/**
 * @type {Object}
 */
var namespaces = {},
  /**
   * @type {Function}
   */
  defaultType = null,
  /**
   * @type {string}
   */
  defaultNamespace = '';
/**
 * @function addType
 * @param {string|QNameEntity} name
 * @param {Function} constructor
 * @param {string} [namespace]
 */
function addType(name, constructor, namespace) {
  if(name instanceof QNameEntity){
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
  if(name instanceof QNameEntity){
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