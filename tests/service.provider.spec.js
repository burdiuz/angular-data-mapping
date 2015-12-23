/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('AngularJS Service Provider tests', function () {
  var provider, service;
  beforeEach(function () {
    // get provider factory methods
    if (!provider) {
      angular.module('aw.datamapping').config([
        'entityServiceProvider',
        function (entityServiceProvider) {
          provider = entityServiceProvider;
        }
      ]);
      module('aw.datamapping');
    }
    // get provider service methods
    if (!service) {
      var injector = angular.injector(['ng', 'aw.datamapping']);
      service = injector.get('entityService');
    }
  });
  afterEach(function(){
    provider.setDefaultType(null);
    provider.setDefaultNamespace('');
    namespaces = {};
  });
  /**
   * @extends Entity
   * @constructor
   */
  function ParentEntity() {
    this.children = [
      new ChildEntity(),
      new ChildEntity(),
      new ChildEntity()
    ];
  }

  function ChildEntity() {
    this.propertyString = "string";
    this.propertyNumber = 14;
    this.propertyBoolean = false;
  }
  it('Register entities', function () {
    provider.register('parentEntity', ParentEntity);
    provider.register('childEntity', ChildEntity);
    expect(getType('parentEntity')).toBe(ParentEntity);
    expect(getType('childEntity')).toBe(ChildEntity);
    expect(isEntityClass(getType('parentEntity'))).toBe(true);
  });
  it('Set defaults', function () {
    provider.setDefaultType(ParentEntity);
    expect(getType()).toBe(ParentEntity);
    provider.setDefaultNamespace('defns');
    expect(getType()).toBe(ParentEntity);
    provider.setDefaultType(null);
    expect(function(){
      getType('parentEntity');
    }).toThrow();
    expect(function() {
      provider.register('parentEntity', ParentEntity);
    }).not.toThrow();
    expect(getType('parentEntity')).toBe(ParentEntity);
  });
  it('Register Types in NS', function () {
    provider.register('parentEntityNS', ParentEntity, 'newNS');
    provider.register('childEntityNS', ChildEntity, 'newNS');
    expect(function(){
      getType('parentEntityNS');
    }).toThrow();
    expect(function(){
      getType('childEntityNS');
    }).toThrow();
    expect(getType('parentEntityNS', 'newNS')).toBe(ParentEntity);
    expect(getType(new QNameEntity('childEntityNS', 'newNS'))).toBe(ChildEntity);
  });
});