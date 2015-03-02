/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  /**
   * @namespace SimpleEntity
   * @constructor
   */
  function SimpleEntity() {
    /**
     * @property SimpleEntity#stringParam
     * @type {string}
     */
    this.stringParam = "";
    /**
     * @property SimpleEntity#boolParam
     * @type {boolean}
     */
    this.boolParam = false;
    /**
     * @property SimpleEntity#numberParam
     * @type {Number}
     */
    this.numberParam = NaN;
  }

  module.config([
    "entityServiceProvider",
    function (entityServiceProvider) {
      // register entity
      entityServiceProvider.register("simple", SimpleEntity);
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));