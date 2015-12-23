/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('Entity Maps tests', function () {
  /**
   * @type {EntityMaps}
   */
  var map;

  function SimpleEntity() {
    this.stringProperty = "";
    this.booleanProperty = true;
    this.numberProperty = 3.14;
    this.nanProperty = NaN;
    this.nullProperty = null;
    this.undefinedProperty = undefined;
  }

  function ComplexEntity() {
    this.objectProperty = {};
    this.entityProperty = new SimpleEntity();
    this.funcProperty = function () {
    };
  }

  function NullableEntity() {
    this.property1 = null;
    this.property2 = null;
    this.property3 = null;
    this.property4 = null;
    this.property5 = null;
  }

  it('Create Maps', function () {
    map = new EntityMaps();
    map.create(new SimpleEntity());
    map.create(new ComplexEntity());
    map.create(new NullableEntity(), {
      property1: "number",
      property2: Boolean,
      property3: "string",
      property4: SimpleEntity,
      property5: ComplexEntity
    });
  });
  it('Check if maps created', function () {
    expect(map.has(new SimpleEntity())).toBe(true);
    expect(map.has(new ComplexEntity())).toBe(true);
    expect(map.hasDefinition(SimpleEntity)).toBe(true);
    expect(map.hasDefinition(ComplexEntity)).toBe(true);
    expect(map.has(new (function () {
    })())).toBe(false);
    expect(map.hasDefinition(function () {
    })).toBe(false);
  });
  it('Verify unknown', function () {
    expect(map.verify(new (function(){})())).toBe(undefined);
  });
  it('Verify simple by maps', function () {
    var simple = new SimpleEntity();
    expect(map.verify(simple)).toBe(true);
    simple.nullProperty = 14;
    simple.undefinedProperty = function(){};
    expect(map.verify(simple)).toBe(true);
    simple.booleanProperty = "string";
    expect(map.verify(simple)).toBe(false);
    simple.booleanProperty = true;
    simple.stringProperty = 15;
    expect(map.verify(simple)).toBe(false);
    simple.stringProperty = "food";
    simple.nanProperty = true;
    expect(map.verify(simple)).toBe(false);
  });
  it('Verify passed map', function () {
    var nullable = new NullableEntity();
    expect(map.verify(nullable)).toBe(false);
    nullable.property1 = 15;
    expect(map.verify(nullable)).toBe(false);
    nullable.property2 = false;
    expect(map.verify(nullable)).toBe(false);
    nullable.property3 = "dog";
    expect(map.verify(nullable)).toBe(false);
    nullable.property4 = new SimpleEntity();
    expect(map.verify(nullable)).toBe(false);
    nullable.property5 = new ComplexEntity();
    expect(map.verify(nullable)).toBe(true);
  });
  it('Verify complex by maps', function () {
    var complex = new ComplexEntity();
    expect(map.verify(complex)).toBe(true);
    complex.funcProperty = 15;
    expect(map.verify(complex)).toBe(true);
    complex.entityProperty = new Entity();
    expect(map.verify(complex)).toBe(false);
    complex.entityProperty = null;
    expect(map.verify(complex)).toBe(false);
  });
});