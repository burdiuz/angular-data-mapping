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
  module.service("service", [
    "entityService",
    /**
     * @namespace Service
     * @param {EntityService} entityService
     * @constructor
     */
    function Service(entityService) {
      /**
       * @function Service#getData
       * @param {Object} data
       * @returns {SimpleEntity}
       */
      this.getData = function (data) {
        // instead of argument can be data received from server
        return entityService.create("simple", data);
      }
    }
  ]);
  module.controller("Application", [
    "service",
    function ApplicationController(service) {
      /**
       * @type {SimpleEntity}
       */
      this.data;
      // lets receive empty object from service
      this.data = service.getData({});
      console.log(this.data);
      // lets receive ordinary object from service
      this.data = service.getData({
        stringParam: "Any String here",
        boolParam: true,
        numberParam: 3.14
      });
      console.log(this.data);
      console.log(this.data instanceof SimpleEntity, this.data instanceof Entity);
      /**
       * @type {EntityService}
       */
      var service;
    }
  ]);
})(angular.module("application", ["aw.datamapping"]));