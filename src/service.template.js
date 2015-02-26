/**
 * Created by Oleg Galaburda on 25.02.2015.
 */
//TODO add factory method generation with definition and type map in closure
(function () {
	angular.module('aw.datamapping', []).provider('entityService',
    /**
     * @namespace EntityServiceProvider
     * @extends EntityServiceSharedInterface
     * @constructor
     */
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
  /**
   * @namespace EntityService
   * @extends EntityServiceSharedInterface
   * @constructor
   */
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
      //TODO add verify(instance, skipProperties, additional data types) to verify property types. When first time object of type is created, record its properties types to validate
    };
    /**
     * @param {Object} data
     * @param strict
     */
    this.verify = function (data, strict) {
      //TODO add verify(instance, skipProperties, additional data types) to verify property types. When first time object of type is created, record its properties types to validate
    };
  }
  /**
   * @private
   * @namespace EntityServiceSharedInterface
   * @constructor
   */
  function EntityServiceSharedInterface() {
    /**
     * @function EntityServiceSharedInterface#extend
     * @param {Function} constructor
     * @returns {Function}
     * @instance
     */
    this.extend = function (constructor) {
      constructor.prototype = new Entity();
      constructor.prototype.constructor = constructor;
      return constructor;
    };
    /**
     * @function EntityServiceSharedInterface#isEntity
     * @param {Object} instance
     * @return {boolean}
     * @instance
     */
    this.isEntity = function (instance) {
      return instance instanceof Entity;
    };
    /**
     * @function EntityServiceSharedInterface#isEntityClass
     * @param {Function} constructor
     * @return {boolean}
     * @instance
     */
    this.isEntityClass = function (constructor) {
      return constructor instanceof Function && (constructor === Entity || Entity.prototype.isPrototypeOf(constructor.prototype));
    };
    /**
     * @function EntityServiceSharedInterface#get
     * @inheritDoc getType
     * @instance
     */
    this.get = getType;
    /**
     * @function EntityServiceSharedInterface#getNamespace
     * @inheritDoc getNamespace
     * @instance
     *
     */
    this.getNamespace = getNamespace;
  }
  /*--shared-*/
  /*--entity.namespace-*/
  /*--entity-*/
  /*--qname.entity-*/
})();