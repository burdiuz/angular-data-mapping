/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  /**
   * @class SimpleExampleEntity
   */
  function SimpleExampleEntity() {
    /**
     * @type {string}
     */
    this.stringParam = "";
    /**
     * @type {boolean}
     */
    this.boolParam = false;
    /**
     * @type {Number}
     */
    this.numberParam = NaN;

    this.init = function(param){
      // validate myself
    }
  }
  Entity

  module.config([
    "entityServiceProvider",
    function (entityServiceProvider) {
      // register entity
      entityServiceProvider.register("simple", SimpleExampleEntity);
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));