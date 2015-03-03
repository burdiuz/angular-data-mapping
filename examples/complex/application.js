/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  /**
   * @class ComplexExampleEntity
   */
  function ComplexExampleEntity() {
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
      entityServiceProvider.register("complex", ComplexExampleEntity);
      entityServiceProvider.register("descriptor", DescriptorExampleEntity);
      entityServiceProvider.register("child", ChildExampleEntity);
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));