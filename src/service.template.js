/**
 * Created by Oleg Galaburda on 25.02.2015.
 */
(function () {
  angular.module('aw.datamapping', []).provider('entityService',
    /**
     * @namespace EntityServiceProvider
     * @extends EntityServiceSharedInterface
     * @constructor
     */
    function EntityServiceProvider() {
      EntityServiceSharedInterface.apply(this);
      /**
       * @function EntityServiceProvider#register
       * @param {string|QNameEntity} name
       * @param {Function} constructor
       * @param {string} [namespace]
       * @inheritDoc addType
       * @instance
       */
      this.register = function (name, constructor, namespace){
        addType(name, constructor, namespace);
      };
      /**
       * @function EntityServiceProvider#setDefaultType
       * @param {Function} constructor
       * @instance
       */
      this.setDefaultType = function (constructor) {
        defaultType = constructor;
      };
      /**
       * @function EntityServiceProvider#setDefaultNamespace
       * @param {string} name
       * @instance
       */
      this.setDefaultNamespace = function (name) {
        defaultNamespace = name || '';
      };
      /**
       * @private
       * @instance
       */
      this.$get =
        /**
         * @private
         * @returns {EntityService}
         */
        function EntityServiceFactory() {
          return new EntityService();
        };
    }
  );
  /**
   * @namespace EntityService
   * @extends EntityServiceSharedInterface
   * @constructor
   */
  function EntityService() {
    EntityServiceSharedInterface.apply(this);
    /**
     * @function EntityService#create
     * @param {string|QNameEntity} name
     * @param {Object} [data]
     * @param {Object} [entityTypeMap]
     * @param [namespace]
     * @returns {Entity}
     * @instance
     */
    this.create = function (name, data, entityTypeMap, namespace) {
      var definition = this.get(name, namespace);
      return createEntity(data, definition, entityTypeMap);
    };
    /**
     * @function EntityService#createNew
     * @param {string|QNameEntity} name
     * @param [namespace]
     * @returns {Entity}
     * @instance
     */
    this.createNew = function (name, namespace) {
      var definition = this.get(name, namespace);
      return new definition();
    };
    /**
     * Method to create factories for Entities, pass data type and Entity Type Map for properties and it will return Entity based on passed data and Entity Type Map.
     * @function EntityService#factory
     * @param {string|QNameEntity} name
     * @param {Object} [entityTypeMap]
     * @param [namespace]
     * @returns {Function} Factory method with definition and type map in closure, that accepts only data and returns entity.
     * @instance
     */
    this.factory = function (name, entityTypeMap, namespace) {
      /**
       * @type {EntityService}
       */
      var self = this;
      return function(data){
        self.create(name, data, entityTypeMap, namespace);
      };
    };
    /**
     * @function EntityService#verify
     * @param {Object} data
     * @returns {boolean|undefined}
     */
    this.verify = function (data) {
      return typeMaps.verify(data);
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
    this.extend = extend;
    /**
     * @function EntityServiceSharedInterface#isEntity
     * @param {Object} instance
     * @return {boolean}
     * @instance
     */
    this.isEntity = isEntity;
    /**
     * @function EntityServiceSharedInterface#isEntityClass
     * @param {Function} constructor
     * @return {boolean}
     * @instance
     */
    this.isEntityClass = isEntityClass;
    /**
     * @function EntityServiceSharedInterface#get
     * @param {string|QNameEntity} name
     * @param {string} [namespace]
     * @returns {Function}
     * @inheritDoc getType
     * @instance
     */
    this.get = getType;
    /**
     * @function EntityServiceSharedInterface#getNamespace
     * @param {string} name
     * @returns {EntityNamespace}
     * @inheritDoc getNamespace
     * @instance
     *
     */
    this.getNamespace = getNamespace;
  }
  /*--shared-*/
  /*--dictionary-*/
  /*--entity.namespace-*/
  /*--entity.maps-*/
  /*--entity-*/
  /*--qname.entity-*/
})();