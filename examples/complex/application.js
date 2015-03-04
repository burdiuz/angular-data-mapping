/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  /**
   * @class ComplexExampleEntity
   */
  function CAAAAomplexExampleEntity() {
    /**
     * @type {string}
     */
    this.id = "";
    /**
     * @type {string}
     */
    this.type = "COMPL";
    /**
     * @type {string}
     */
    this.title = "";
    /**
     * @type {DescriptorExampleEntity}
     */
    this.descriptor = null;
    /**
     * @type {ChildExampleEntity[]}
     */
    this.children = [];
    /**
     * @param {number} index
     */
    this.getChild = function(index){
      return this.children ? this.children[index] : null;
    }
  }
  /**
   * @class ChildExampleEntity
   */
  function ChildExampleEntity() {
    /**
     * @type {string}
     */
    this.id = "";
    /**
     * @type {string}
     */
    this.type = "CHILD";
    /**
     * @type {string}
     */
    this.title = "";
    /**
     * @type {Object}
     */
    this.value = null;
	/**
	 * @type {DescriptorExampleEntity}
	 */
    this.descriptor = null;
  }

  /**
   * @class DescriptorExampleEntity
   */
  function DescriptorExampleEntity(){
    /**
     * @type {string}
     */
    this.id = "";
    /**
     * @type {string}
     */
    this.type = "DESC";
    /**
     * @type {string}
     */
    this.description = "";
    var date = new Date();
    /**
     * @property DescriptorExampleEntity#date
     * @type {Date}
     */
    Object.defineProperty(this, "date", {
      get: function(){
        return date;
      }
      set: function(value){
        if(typeof(value)==="string"){
          date = Date.parse(value);
        }else date = value;
      }
    })
    /**
     * @property DescriptorExampleEntity#descriptorMask
     * @type {string}
     */
    Object.defineProperty(this, "descriptorMask", {
      get: function(){
        return this.type+"/"+this.id;
      },
      enumerable: true
    });
  }

  module.config([
    "entityServiceProvider",
    function (entityServiceProvider) {
      // register entity
      entityServiceProvider.register("complex", CAAAAomplexExampleEntity);
      entityServiceProvider.register("descriptor", DescriptorExampleEntity);
      entityServiceProvider.register("child", ChildExampleEntity);
      entityServiceProvider.register("complex", CAAAAomplexExampleEntity, "ns");
      entityServiceProvider.register("descriptor", DescriptorExampleEntity, "ns");
      entityServiceProvider.register("child", ChildExampleEntity, "ns");
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));