/**
 * @exports EntityNamespace
 */
/**
 * @class EntityNamespace
 * @param {string} name
 */
function EntityNamespace(name) {
  name =  name ? String(name) : '';
  /**
   * @private
   * @type {Object<string,Function>}
   */
  var definitions = {};

  /**
   * @property EntityNamespace#name
   * @readonly
   * @instance
   */
  Object.defineProperty(this, 'name', {value: name, writable: false, enumerable: true});

  /**
   * @throws {Error} Already has entity with passed name
   * @throws {Error} Requires second parameter to be Entity constructor function.
   * @param {string} name
   * @param {Function} definition
   * @instance
   */
  this.add = function (name, definition) {
    if (definitions.hasOwnProperty(name)) {
      throw new Error('EntityNamespace "' + this.name + '" already has entity with name "' + name + '".');
    } else if (typeof(definition) !== "function") {
      throw new Error('EntityNamespace#add requires second parameter to be Entity constructor function.');
    } else {
      definitions[name] = definition;
    }
  };

  /**
   * @throws {Error} EntityNamespace does not have entity with passed name.
   * @param {string} name
   * @returns {Function}
   * @instance
   */
  this.get = function (name) {
    var definition;
    if (definitions.hasOwnProperty(name) && definitions[name] instanceof Function) {
      definition = definitions[name];
    } else if(defaultType) {
      definition = defaultType;
    }else{
      throw new Error('EntityNamespace "' + this.name + '" does not have entity with name "' + name + '".');
    }
    return definition;
  };
}