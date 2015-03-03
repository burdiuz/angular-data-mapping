/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.service("service", [
    "$http",
    "entityService",
    /**
     * @class Service
     * @param $http
     * @param {EntityService} entityService
     */
      function Service($http, entityService) {
      /**
       * @function Service#getData
       */
      this.getEmptyData = function () {
        return $http.get("empty.json").then(
          function (response) {
            return entityService.create("simple", response.data);
          }
        );
      };
      /**
       * @function Service#getData
       */
      this.getData = function () {
        return $http.get("data.json").then(
          function (response) {
            return entityService.create("simple", response.data);
          }
        );
      };
    }
  ]);
})(angular.module("application"));