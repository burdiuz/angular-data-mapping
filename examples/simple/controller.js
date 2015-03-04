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
      // lets receive empty object from service
      service.getEmptyData().then(
        /**
         * @param {SimpleExampleEntity} entity
         */
        function(entity){
          /*
          You can see that default property values are still there
           */
          console.log("Empty Entity loaded", entity);
          console.log("boolParam:", entity.boolParam);
          console.log("numberParam:", entity.numberParam);
          console.log("stringParam:", entity.stringParam);
          console.log("Using \"entityService\" you can check entity type:");
          console.log("entity instanceof entityService.get(\"simple\"); - ", entity instanceof entityService.get("simple"));
          console.log("entity instanceof entityService.get(\"Entity\"); - ", entity instanceof entityService.get('Entity'));
          console.log("Or use shortcuts:");
          console.log("entityService.isEntity(entity); - ", entityService.isEntity(entity));
          console.log("entityService.isEntity(entity, \"simple\"); - ", entityService.isEntity(entity, "simple"));
        }
      );
      // lets receive ordinary object from service
      this.data = service.getData().then(
        /**
         * @param {SimpleExampleEntity} entity
         */
        function(entity){
          /*
           Even if you didn't describe properties they are will be added anyway.
           */
          console.log("Entity with more data loaded", entity);
          console.log(" -- defined properties");
          console.log("boolParam:", entity.boolParam);
          console.log("numberParam:", entity.numberParam);
          console.log("stringParam:", entity.stringParam);
          console.log(" -- not defined properties");
          console.log("id:", entity.id);
          console.log("dynamicParam:", entity.dynamicParam);
          console.log("otherParam:", entity.otherParam);
          app.jsonData = JSON.stringify(entity.valueOf(), null, 2);

          entity.apply({stringParam: "Hello!"});
          console.log(entity);

        }
      );
    }
  ]);
})(angular.module("application"));