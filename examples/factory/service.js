/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.service("service", [
    "entityService",
    /**
     * @namespace Service
     * @param {EntityService} entityService
     * @constructor
     */
    function Service(entityService) {
      /**
       * @type {Function}
       */
      var dataFactory = entityService.factory("simple", {children: "simple"});
      /**
       * @function Service#getData
       * @param {Object} data
       * @returns {SimpleEntity}
       */
      this.getData = function (data) {
        // instead of argument can be data received from server
        return dataFactory(data)
      }
    }
  ]);
})(angular.module("application"));