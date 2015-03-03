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
         * @param {PropertiesExampleEntity} entity
         */
        function(entity){
          /*
           Even if you didn't describe properties they are will be added anyway.
           */
          console.log("Entity data loaded", entity);
          console.log("Apply boolean value to stringParam:", entity.stringParam, "to true");
          try{
            entity.stringParam = true;
          }catch(error){
            console.log(error);
          }
          console.log("Apply any value to read only param:", entity.readOnlyParam, "to NEW VALUE");
          try{
            entity.readOnlyParam = "NEW VALUE";
          }catch(error){
            console.log(error);
          }
          var baseEntity = entityService.createNew("Entity");
          console.log("Apply base Entity instance to param of child type:", entity.childPropParam, "to", baseEntity);
          try{
            entity.childPropParam = baseEntity;
          }catch(error){
            console.log(error);
          }
          console.log("Apply ChildPropExampleEntity instance to param of base Entity type:", entity.entityParam, "to", entity.childPropParam);
          try{
            entity.entityParam = entity.childPropParam;
          }catch(error){
            console.log(error);
          }
          console.log("Note: It works because ChildPropExampleEntity extends Entity");
          app.jsonData = JSON.stringify(entity.valueOf(), null, 2);
        }
      );
    }
  ]);
})(angular.module("application"));