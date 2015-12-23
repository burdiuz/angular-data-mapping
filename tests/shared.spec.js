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
    expect(addType('type1', Type1InNS, 'ns')).toBeUndefined();
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
    expect(getType('type1')).toBe(Type1InDefNS);
    expect(getType('type1', 'ns')).toBe(Type1InNS);
    expect(getType('type1') === getType('type1', 'ns')).toBe(false);
    expect(getType('type2')).toBe(Type2InDefNS);
    expect(getType('type1') === getType('type2')).toBe(false);
  });
  it('Get type by QNameEntity', function () {
    expect(getType(new QNameEntity('type1'))).toBe(Type1InDefNS);
    expect(getType(new QNameEntity('type1', 'ns'))).toBe(Type1InNS);
    expect(getType(new QNameEntity('type1')) === getType(new QNameEntity('type1', 'ns'))).toBe(false);
    expect(getType(new QNameEntity('type2'))).toBe(Type2InDefNS);
    expect(getType(new QNameEntity('type1')) === getType(new QNameEntity('type2'))).toBe(false);
  });
  it('Create Entity by Class constructor', function () {
    expect(function(){
      createEntity({
        $$constructor: "some.UnknownClass",
        param1: "value", param2: 15, param3: true
      });
    }).toThrow();
    window.test = {
      TestGlobalClass: function(){}
    };
    var entity = createEntity({
      $$constructor: "test.TestGlobalClass",
      param1: "value", param2: 15, param3: true
    });
    expect(entity instanceof Entity).toBe(true);
    expect(isEntityClass(window.test.TestGlobalClass)).toBe(true);
    entity = new window.test.TestGlobalClass();
    var otherEntity = createEntity(entity);
    expect(entity).not.toBe(otherEntity);
    expect(otherEntity instanceof window.test.TestGlobalClass).toBe(true);
  });
  it('Create Entity string/QNameEntity', function () {
    function Type1(){

    }
    addType('typeCA1', Type1);
    expect(createEntity({
      param1: "value", param2: 15, param3: true
    }, 'typeCA1') instanceof Type1).toBe(true);
    function Type2(){

    }
    addType(new QNameEntity('typeCA2', 'nsa'), Type2);
    expect(createEntity({
      param1: "value", param2: 15, param3: true
    }, new QNameEntity('typeCA2', 'nsa')) instanceof Type2).toBe(true);
  });
  it('Extend Class constructor with Entity', function () {
    var constructor = function () {
    };
    extend(constructor);
    var instance = new constructor();
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
    expect(isEntityClass(getType('type1'))).toBe(true);
    expect(isEntityClass(getType(new QNameEntity('type1', 'ns')))).toBe(true);
  });
});