/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('AngularJS Service tests', function () {
  var injector = angular.injector(['ng', 'aw.datamapping']);
  /**
   * @type {EntityService}
   */
  var service = injector.get('entityService');
  namespaces = {};
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
  it('Config Entity Types', function () {
    addType('parent', ParentEntity);
    addType('child', ChildEntity, 'cns');
  });
  it('Create New Entity', function () {
    expect(service.create('parent') instanceof ParentEntity).toBe(true);
    expect(service.create('child', 'cns') instanceof ChildEntity).toBe(true);
    expect(service.create(new QNameEntity('child', 'cns')) instanceof ChildEntity).toBe(true);
  });
  it('Test service Utils', function () {
    expect(service.isEntity(new ParentEntity())).toBe(true);
    expect(service.isEntityClass(ParentEntity)).toBe(true);
    expect(service.isEntityClass(service.extend(function(){}))).toBe(true);
    expect(service.getNamespace() instanceof EntityNamespace).toBe(true);
    expect(service.get(new QNameEntity('child', 'cns'))).toBe(ChildEntity);
  });
  it('Apply Entity Types to Data', function () {
    var data = service.apply('parent',
      {
        children: [
          {param: 1},
          {param: 2},
          {param: 3}
        ]
      },
      {
        children: new QNameEntity('child', 'cns')
      }
    );
    expect(data instanceof ParentEntity).toBe(true);
    expect(data.children.length).toBe(3);
    expect(data.children[0] instanceof ChildEntity).toBe(true);
    expect(data.children[0].param).toBe(1);
    expect(data.children[1].param).toBe(2);
    expect(data.children[2].param).toBe(3);
  });
  it('Create Factory function', function () {
    var factory = service.factory('parent', {
        children: new QNameEntity('child', 'cns')
      });
    var data = factory({
      children: [
        {param: 1},
        {param: 2},
        {param: 3}
      ]
    });
    expect(data instanceof ParentEntity).toBe(true);
    expect(data.children.length).toBe(3);
    expect(data.children[0] instanceof ChildEntity).toBe(true);
    expect(data.children[0].param).toBe(1);
    expect(data.children[1].param).toBe(2);
    expect(data.children[2].param).toBe(3);
  });
});