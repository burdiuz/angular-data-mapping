/**
 * Created by Oleg Galaburda on 01.01.2015.
 */
(function () {
  /**
   * @class
   * @name Entity
   * @constructor
   */
  function Entity() {
    /**
     * Will copy "data" properties to this object
     * @function
     * @name Entity#apply
     * @param {Object} data
     * @param {Object} entityTypeMap - Entity map is a hash object with propertyName: EntityConstructor or propertyName:{constructor:EntityConstructor, childProperty: ...}
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
            result = createEntity(value, entityType);
          }
        }
        return result || value;
      }

      function createEntity(data, entityType) {
        var result;
        if (entityType) {
          if (typeof(entityType) === "function") { // Entity Constructor
            result = Entity.create(data, entityType);
          } else { // {constructor: EntityConstructor, childProperty: ...}
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
     * @function
     * @name Entity#copy
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

  /**
   * @name Entity.extend
   * @param {Function} constructor
   * @returns {Function}
   * @static
   */
  Entity.extend = function Entity_extend(constructor) {
    constructor.prototype = new Entity();
    constructor.prototype.constructor = constructor;
    return constructor;
  };
  /**
   * @function
   * @name Entity.isEntity
   * @param {Object} instance
   * @return {boolean}
   * @static
   */
  Entity.isEntity = function Entity_isEntity(instance) {
    return instance instanceof Entity;
  };
  /**
   * @function
   * @name Entity.isEntityClass
   * @param {Function} constructor
   * @return {boolean}
   * @static
   */
  Entity.isEntityClass = function Entity_isEntityClass(constructor) {
    return constructor instanceof Function && (constructor === Entity || Entity.prototype.isPrototypeOf(constructor.prototype));
  };
  /**
   * @function
   * @name Entity.create
   * @param {Object} data
   * @param {Function} [constructor]
   * @param {Object} [propertyTypeMap]
   * @return {Entity}
   * @static
   */
  Entity.create = function Entity_create(data, constructor, entityTypeMap) {
    var instance;
    if (!constructor) {
      if (data instanceof Entity) {
        constructor = data.constructor || data.__proto__.constructor;
      } else if ("$$constructor" in data && data["$$constructor"]) {
        try {
          eval("constructor = window." + data["$$constructor"]);
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
    //console.log('Entity.create', instance, entityTypeMap);
    return instance;
  };
})();