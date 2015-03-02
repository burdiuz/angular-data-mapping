/**
 * @exports EntityMaps
 */
/**
 * @namespace EntityMaps
 * @constructor
 */
function EntityMaps() {
  var maps = new Dictionary();
  //TODO #propertyTypes = add support for registered string names and QNameEntities
  /**
   * @function EntityMaps#create
   * @param {Object} object
   * @param {Object} propertyTypes
   * @returns {Object}
   */
  this.create = function (object, propertyTypes) {
    //FIXME verify if angular utility properties are enumerable, if yes, then add condition to skip them(charAt()=="$")
    var map;
    var definition = getDefinition(object);
    map = maps.get(definition);
    if (!map) {
      map = {};
      for (var param in object) {
        if (object.hasOwnProperty(param) && typeof(object[param]) != "function") {
          if (propertyTypes && propertyTypes.hasOwnProperty(param)) {
            map[param] = propertyTypes[param];
          } else {
            var value = object[param];
            if (value !== undefined && value !== null) {
              map[param] = value.constructor instanceof Function && value instanceof value.constructor ? value.constructor : typeof(value);
            }
          }
        }
      }
      maps.add(definition, map);
    }
    return map;
  };
  /**
   * @function EntityMaps#has
   * @param {Object} object
   * @returns {boolean}
   */
  this.has = function (object) {
    return maps.has(getDefinition(object));
  };
  /**
   * @function EntityMaps#hasDefinition
   * @param {Function} definition
   * @returns {boolean}
   */
  this.hasDefinition = function (definition) {
    return maps.has(definition);
  };
  //TODO Add support for deep verify, including nested entites
  /**
   * @function EntityMaps#verify
   * @param {Object} object
   * @param {boolean} deep
   * @returns {boolean}
   */
  this.verify = function (object, deep) {
    var map = maps.get(getDefinition(object));
    if (!map) return undefined;
    var result = true;
    for (var param in map) {
      if (!map.hasOwnProperty(param)) continue;
      var value = object[param];
      var valueType = map[param];
      if (typeof(valueType) == "string") {
        result = typeof(value) == valueType;
      } else if (value !== undefined && value !== null && value.constructor) {
        result = value.constructor === valueType;
      } else {
        result = value instanceof valueType;
      }
      if (!result) break;
    }
    return result;
  };
  /**
   * @private
   * @param {Object} object
   * @returns {Function}
   */
  function getDefinition(object) {
    return object.constructor instanceof Function ? object.constructor : object.__proto__.constructor;
  }
}
/*
 var maps = new EntityMaps();
 function TestEntity(){
 this.property("string", "");
 this.property("bool", false);
 this.property("num", 15);
 this.property("nan", NaN);
 this.content = new Entity();
 }
 extend(TestEntity);
 var entity = new TestEntity();
 console.log(maps.create(entity, {content: "object"}));
 entity.content = null;
 console.log(maps.verify(entity));
 //*/