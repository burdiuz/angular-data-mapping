/**
 * Created by Oleg Galaburda on 25.02.2015.
 */
//TODO add factory method generation with definition and type map in closure
function define(module) {
  /**
   * @type {Object}
   */
  var namespaces = {},
    /**
     * @type {?Function}
     */
    defaultType = null,
    /**
     * @type {string}
     */
    defaultNamespace = '';
  module.provider('entityService', function EntityServiceProvider() {
    EntityServiceSharedInterface.apply(this);
    this.register = function (name, constructor, namespace) {
      if (collection.hasOwnProperty(name)) {
        throw new Error('EntityService, entity with name "' + name + '" is already registered.');
      }
    };
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
  function EntityService() {
    EntityServiceSharedInterface.apply(this);
    this.create = function (name, data, entityTypeMap, namespace) {
      var definition = this.get(name, namespace);
      //FIXME entyityTypeMap must resolve entity names to constructors, now it takes constructors only
      return Entity.create(data, definition, entityTypeMap);
    };
    this.createNew = function (name, namespace) {
      var definition = this.get(name, namespace);
      return new definition();
    };
  }

  function EntityServiceSharedInterface() {
    this.extend = Entity.extend;
    this.isEntity = Entity.isEntity;
    this.isEntityClass = Entity.isEntityClass;
    this.get = function (name, namespace) {
      return this.getNamespace(namespace).get(name);
    };
    this.getNamespace = function (name) {
      var namespace;
      name = name || defaultNamespace;
      if (namespaces.hasOwnProperty(name)) {
        namespace = namespaces[name];
      } else {
        namespaces[name] = namespace = new EntityNamespace(name);
      }
      return namespace;
    };
  }

  function EntityNamespace(name) {
    var name = name,
      definitions;
    Object.defineProperty(this, 'name', {value: name, writable: false, enumerable: true});
    this.add = function (name, definition) {
      if (definitions.hasOwnProperty(name)) {
        throw new Error('EntityNamespace "' + this.name + '" already has entity with name "' + name + '".');
      } else if (typeof(definition) !== "function") {
        throw new Error('EntityNamespace#add requires second parameter to be Entity constructor function.');
      } else {
        definitions[name] = definition;
      }
    };
    this.get = function (name) {
      var definition;
      name = name || defaultType;
      if (definitions.hasOwnProperty(name) && definitions[name] instanceof Function) {
        definition = definitions[name];
      } else {
        throw new Error('EntityNamespace "' + this.name + '" does not have entity with name "' + name + '".');
      }
      return definition;
    };
  }
};