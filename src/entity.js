/**
 * @exports Entity
 */
/**
 * @namespace Entity
 * @extends Object
 * @constructor
 */
function Entity() {
  /**
   * Create property with auto-check for value type in mutator method
   * @function Entity#property
   * @param {string} name
   * @param {*} value
   * @param {boolean} readOnly
   * @param {string|Function} valueType
   */
  this.property = function(name, value, readOnly, valueType){
    //FIXME value can be also GET and SET functions.If value is Function, expect readOnly to be Function or NULL if readonly.
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
      else if(valueType) descriptor.set = mutator_class;
      else descriptor.set = mutator_nocheck;
    }
    Object.defineProperty(this, name, descriptor);
      function mutator_nocheck(newValue){
        value = newValue;
      }
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
  /**
   * Will copy "data" properties to this object
   * @function Entity#apply
   * @param {Object} data
   * @param {Object} entityTypeMap Entity map is a hash object with propertyName: EntityConstructor or propertyName:{constructor:EntityConstructor, childProperty: ...}
   * @instance
   */
  /*TODO check possibility to apply Entity class to custom objects via replacing __proto__ & constructor values.
    Instead of creating Entity and applying properties to it, might be faster if create Entity and apply it to object
    object.__proto__ = new Entity;
    object.constructor = Entity;
    but still its required to check nested objects to make them Entities. this can be done via requirement of dataMapObjects for nested objects.
   */
  this.apply = function (data, entityTypeMap) {
    var self = this,
      param;
    // inner function to detect type of property value -- simple or complex
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
        if (typeof(entityType) === "function") { // Entity Constructor
          result = createEntity(data, entityType);
        } else { // {constructor: EntityConstructor, childProperty: ...}
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
        //console.log(' -- ', param);
        if (this[param] instanceof Entity) {
          this[param].apply(data[param], entityTypeMap && entityTypeMap.hasOwnProperty(param) ? entityTypeMap[param] : null);
        } else {
          this[param] = apply(data[param], entityTypeMap && entityTypeMap.hasOwnProperty(param) ? entityTypeMap[param] : null);
        }
      }
    }
    //console.log('##ENTITY Apply', this);
  };
  /**
   * Make a copy of this object
   * @function Entity#copy
   * @returns {Entity}
   */
  this.copy = function () {
    //console.log('##ENTITY Original', this);
    var inst = new (this.constructor || this.__proto__.constructor)(),
      param,
      value;
    // inner function to detect type of property value -- simple or complex
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
        //console.log(' --- ', param, '=', value, inst[param]);
      }
    }
    //console.log('## ----- Copy', inst);
    return inst;
  };
  /**
   * @function Entity#valueOf
   * @param {number} [depth]
   * @returns {Object}
   */
  this.valueOf = function (depth, filterEmpty) {
    if (isNaN(depth)) depth = 0;
    var originals = [],
      values = [],
      result = {},
      param,
      value;
    // inner function to detect type of property value -- simple or complex
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
      //if (param.charAt() == "$") continue;
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