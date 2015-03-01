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
    map.add(new SimpleEntity());
    map.add(new ComplexEntity());
  });
  it('Check created maps', function () {

  });
  it('Request created maps', function () {

  });
  it('Verify instances by maps', function () {

  });
});