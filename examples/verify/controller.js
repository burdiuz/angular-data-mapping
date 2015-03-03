/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.controller("Application", [
    "service",
    "entityService",
    function ApplicationController(service, entityService) {
      var app = this;
      /**
       * @type {string}
       */
      app.jsonData = "";
      // lets receive ordinary object from service
      this.data = service.getData().then(
        /**
         * @param {SimpleExampleEntity} entity
         */
        function(entity){
          app.jsonData = JSON.stringify(entity.valueOf(), null, 2);
          /*
            Lets change parameter types and verify them
           */
          console.log("Received Simple Entity:", entity);
          console.log("Does data has correct types:", entityService.verify(entity));
          entity.stringParam = 15;
          console.log("Changed Simple Entity:", entity);
          console.log("Does data has correct types:", entityService.verify(entity));
          entity.stringParam = "back string";
          entity.boolParam = "string too";
          console.log("Changed Simple Entity:", entity);
          console.log("Does data has correct types:", entityService.verify(entity));
          entity.boolParam = true;
          entity.dynamicParam = "more string";
          console.log("Simple Entity w. changed dynamic field:", entity);
          console.log("Does data has correct types:", entityService.verify(entity));
        }
      );
    }
  ]);
})(angular.module("application"));