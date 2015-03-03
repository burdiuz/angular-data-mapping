/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.service("service", [
    "$http",
    "entityService",
    /**
     * @namespace Service
     * @param $http
     * @param {Function} entityService
     * @constructor
     */
      function Service($http, entityService) {
      var complexEntityFactory = entityService.factory("complex", {
        descriptor: "descriptor",
        children: {
          constructor: "child",
          descriptor: "descriptor"
        }
      });
      /**
       * @function Service#getData
       */
      this.getData = function (data) {
        return $http.get("data.json").then(
          function (response) {
            // passing type map to entityService.create allows to tell entitryService which types have nested objects
            return complexEntityFactory(response.data);
          }
        );
      }
    }
  ]);
})(angular.module("application"));