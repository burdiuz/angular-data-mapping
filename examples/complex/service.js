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
     * @param {EntityService} entityService
     * @constructor
     */
    function Service($http, entityService) {
      /**
       * @function Service#getData
       */
      this.getData = function (data) {
        return $http.get("data.json").then(
          function(response){
            // passing type map to entityService.create allows to tell entitryService which types have nested objects
            return entityService.create("complex", response.data, {
              descriptor: "descriptor",
              children: {
                constructor: "child",
                descriptor: "descriptor"
              }
            });
          }
        );
      }
    }
  ]);
})(angular.module("application"));