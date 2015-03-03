/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  /**
   * @class ChildPropExampleEntity
   */
  function ChildPropExampleEntity(){

  }
  /**
   * @namespace PropertiesExampleEntity
   */
  function PropertiesExampleEntity() {
    /**
     * @property PropertiesExampleEntity#stringParam
     * @type {string}
     */
    this.property("stringParam", "default");
    /**
     * @property PropertiesExampleEntity#boolParam
     * @type {boolean}
     */
    this.property("boolParam", false);
    /**
     * @property PropertiesExampleEntity#numberParam
     * @type {number}
     */
    this.property("numberParam", NaN);
    /**
     * @property PropertiesExampleEntity#childPropParam
     * @type {ChildPropExampleEntity}
     */
    this.property("childPropParam", null, false, ChildPropExampleEntity);
    /**
     * @property PropertiesExampleEntity#entityParam
     * @type {Entity}
     */
    this.property("entityParam", null, false, Entity);
    /**
     * @property PropertiesExampleEntity#readOnlyParam
     * @type {string}
     * @readonly
     */
    this.property("readOnlyParam", "CONST", true);
  }

  module.config([
    "entityServiceProvider",
    function (entityServiceProvider) {
      // register entity
      entityServiceProvider.register("Props", PropertiesExampleEntity);
      entityServiceProvider.register("ChildProp", ChildPropExampleEntity);
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));