/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('Shared components test', function () {
  function Type1InDefNS() {
    this.paramString = "type1";
    this.paramBool = true;
    this.paramNumber = 0;
  }

  function Type1InNS() {
    this.paramString = "type1ns";
    this.paramBool = true;
    this.paramNumber = 0;
  }

  function Type2InDefNS() {
    this.paramString = "type2";
    this.paramBool = true;
    this.paramNumber = 0;
  }

  function Type2InNS() {
    this.paramString = "type2ns";
    this.paramBool = true;
    this.paramNumber = 0;
  }

  it('Shared variables initialization', function () {
    expect(namespaces instanceof Object).toBe(true);
    expect(typeMaps instanceof EntityMaps).toBe(true);
  });
  it('Add type by string names', function () {
    expect(addType('type1', Type1InDefNS, '')).toBeUndefined();
    expect(addType('type1', Type1InNS, 'ns1')).toBeUndefined();
  });
  it('Add type by QNameEntity', function () {
    expect(addType(new QNameEntity('type2'), Type2InDefNS)).toBeUndefined();
    expect(addType(new QNameEntity('type2', 'ns'), Type2InNS)).toBeUndefined();
  });
  it('Get namespace object', function () {
    expect(getNamespace('') instanceof  EntityNamespace).toBe(true);
    expect(getNamespace('ns') instanceof  EntityNamespace).toBe(true);
    expect(getNamespace('') === getNamespace('ns')).toBe(false);
    expect(getNamespace('not_created_yet_ns') instanceof  EntityNamespace).toBe(true);
  });
  it('Get type by string names', function () {
    expect(getType('type1') instanceof Entity).toBe(true);
    expect(getType('type1', 'ns') instanceof Entity).toBe(true);
    expect(getType('type1') === getType('type1', 'ns')).toBe(false);
    expect(getType('type2') instanceof Entity).toBe(true);
    expect(getType('type1') === getType('type2')).toBe(false);
  });
  it('Get type by QNameEntity', function () {
    expect(getType(new QNameEntity('type1')) instanceof Entity).toBe(true);
    expect(getType(new QNameEntity('type1', 'ns')) instanceof Entity).toBe(true);
    expect(getType(new QNameEntity('type1')) === getType(new QNameEntity('type1', 'ns'))).toBe(false);
    expect(getType(new QNameEntity('type2')) instanceof Entity).toBe(true);
    expect(getType(new QNameEntity('type1')) === getType(new QNameEntity('type2'))).toBe(false);
  });
  it('Create Entity by Class constructor', function () {

  });
  it('Extend Class constructor with Entity', function () {
    var instance = new extend(function () {
    })();
    expect(instance instanceof Entity).toBe(true);
  });
  it('Check if instance is Entity', function () {
    expect(isEntity(new Entity())).toBe(true);
    function EntityClass() {
    }
    expect(isEntity({})).toBe(false);
    expect(isEntity(new EntityClass())).toBe(false);
    extend(EntityClass);
    expect(isEntity(new EntityClass())).toBe(true);
  });
  it('Check if instance is Entity of Type', function () {
    expect(isEntity(new Type1InDefNS(), 'type1')).toBe(true);
    expect(isEntity(new Type1InNS(), 'type1')).toBe(false);
    expect(isEntity(new Type2InDefNS(), new QNameEntity('type2'))).toBe(true);
    expect(isEntity(new Type2InNS(), new QNameEntity('type2', 'ns'))).toBe(true);
  });
  it('Check if Class extends from Entity', function () {
    expect(isEntityClass(Entity)).toBe(true);
    expect(isEntityClass(Type1InDefNS)).toBe(true);
    expect(isEntityClass(Type2InDefNS)).toBe(true);
    expect(isEntityClass(Type1InNS)).toBe(true);
    expect(isEntityClass(Type2InNS)).toBe(true);
    expect(isEntityClass(function () {

    })).toBe(false);
  });
});