/**
 * Created by Oleg Galaburda on 01.03.2015.
 */
describe('Entity tests', function () {
  it('Entity#apply()', function () {
    var entity = new Entity();
    entity.apply({
      property1: 15,
      property2: false,
      property3: "value",
      property4: {
        number: 123,
        boolean: true,
        string: "other value"
      }
    });
    expect(entity.property1).toBe(15);
    expect(entity.property2).toBe(false);
    expect(entity.property3).toBe("value");
    expect(entity.property4 instanceof Entity).toBe(true);
    expect(entity.property4.number).toBe(123);
    expect(entity.property4.boolean).toBe(true);
    expect(entity.property4.string).toBe("other value");
  });
  it('Entity#apply() with Type Map', function () {
    function FirstEntity() {
    }

    function SecondEntity() {
    }

    function ThirdEntity() {
    }

    var entity = new Entity();
    entity.apply({
        first: {
          property: 1,
          third: [
            {
              property: 3
            },
            {
              property: 4
            },
            {
              property: 5
            }
          ]
        },
        second: {
          property: 2
        }
      },
      {
        first: {
          constructor: FirstEntity,
          third: ThirdEntity
        },
        second: SecondEntity
      }
    );
    expect(entity.first instanceof FirstEntity).toBe(true);
    expect(entity.second instanceof SecondEntity).toBe(true);
    var list = entity.first.third;
    expect(list instanceof Array).toBe(true);
    expect(list.length).toBe(3);
    expect(list[0] instanceof ThirdEntity).toBe(true);
    expect(list[1] instanceof ThirdEntity).toBe(true);
    expect(list[2] instanceof ThirdEntity).toBe(true);
    expect(entity.first.third[0].property).toBe(3);
    expect(entity.first.third[1].property).toBe(4);
    expect(entity.first.third[2].property).toBe(5);
  });
  it('Entity#property()', function () {
    /**
     * @extends Entity
     * @constructor
     */
    function NewEntity(){
      this.property("propertyWDef", true);
      this.property("propertyRO", "constant", true);
      this.property("propertyString", "value");
      this.property("propertyEntity", new Entity());
      this.property("propertyNull", null, false, Entity);
    }
    extend(NewEntity);
    var entity = new NewEntity();
    expect(function(){
      entity.property("property");
    }).toThrow();
    expect(entity.propertyWDef).toBe(true);
    entity.propertyWDef = false;
    expect(entity.propertyWDef).toBe(false);
    expect(function(){
      entity.propertyWDef = 1;
    }).toThrow();
    expect(entity.propertyRO).toBe("constant");
    expect(function(){
      entity.propertyRO = "value";
    }).toThrow();
    expect(entity.propertyString).toBe("value");
    expect(function(){
      entity.propertyString = {};
    }).toThrow();
    expect(entity.propertyEntity instanceof Entity).toBe(true);
    expect(function(){
      entity.propertyEntity = {};
    }).toThrow();
    expect(function(){
      entity.propertyEntity = new NewEntity();
    }).not.toThrow();
    expect(entity.propertyEntity instanceof NewEntity).toBe(true);
    expect(entity.propertyNull).toBe(null);
    expect(function(){
      entity.propertyNull = new Entity();
    }).not.toThrow();
    expect(function(){
      entity.propertyNull = new NewEntity();
    }).not.toThrow();
  });
  it('Entity#copy()', function () {
    /**
     * @extends Entity
     * @constructor
     */
    function CopyEntity(){
      this.propertyEntity = new ChildEntity();
      this.propertyList = [
        new ChildEntity(),
        new ChildEntity(),
        new ChildEntity()
      ];
      this.propertyObject = {
        param1: 1,
        param2: 2,
        param3: 3
      };
    }
    function ChildEntity(){
      this.propertyString = "string";
      this.propertyNumber = 14;
      this.propertyBoolean = false;
    }
    extend(CopyEntity);
    extend(ChildEntity);
    var entity = new CopyEntity();
    var copy = entity.copy();
    expect(copy).not.toBe(entity);
    expect(copy instanceof CopyEntity).toBe(true);
    expect(copy.propertyEntity instanceof ChildEntity).toBe(true);
    expect(copy.propertyList instanceof Array).toBe(true);
    var list = copy.propertyList;
    expect(list.length).toBe(3);
    expect(list[0] instanceof ChildEntity).toBe(true);
    expect(list[0].propertyString).toBe("string");
    expect(list[0].propertyNumber).toBe(14);
    expect(list[0].propertyBoolean).toBe(false);
    expect(typeof(copy.propertyObject)).toBe("object");
    expect(copy.propertyObject.param1).toBe(1);
  });
  it('Entity#valueOf()', function () {
    /**
     * @extends Entity
     * @constructor
     */
    function CopyEntity(){
      this.propertyEntity = new ChildEntity();
      this.propertyList = [
        new ChildEntity(),
        new ChildEntity(),
        new ChildEntity()
      ];
      this.propertyObject = {
        param1: 1,
        param2: 2,
        param3: 3
      };
    }
    function ChildEntity(){
      this.propertyString = "string";
      this.propertyNumber = 14;
      this.propertyBoolean = false;
    }
    extend(CopyEntity);
    extend(ChildEntity);
    var entity = new CopyEntity();
    var object = entity.valueOf();
    expect(object instanceof Entity).toBe(false);
    expect(object.propertyList.length).toBe(3);
    expect(object.propertyList[0] instanceof Entity).toBe(false);
    expect(typeof(object.propertyObject)).toBe("object");
    expect(object.propertyObject.param1).toBe(1);
  });
});