/**
 * Created by Oleg Galaburda on 25.02.2015.
 * @exports Entity
 */
/**
 * @namespace Entity
 * @extends Object
 * @constructor
 */
function Entity() {
  /**
   * Create property with autocheck for value type in mutator method
   * @function Entity#property
   * @param {string} name
   * @param {*} value
   * @param {boolean} readOnly
   * @param {string|Function} valueType
   */
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
  /**
   * Will copy "data" properties to this object
   * @function Entity#apply
   * @param {Object} data
   * @param {Object} entityTypeMap Entity map is a hash object with propertyName: EntityConstructor or propertyName:{constructor:EntityConstructor, childProperty: ...}
   * @instance
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
  this.valueOf = function (depth) {
    if (isNaN(depth)) depth = 0;
    var originals = [],
      values = [],
      result = {},
      param,
      value;
    // inner function to detect type of property value -- simple or complex
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