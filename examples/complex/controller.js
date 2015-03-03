/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.controller("Application", [
    "service",
    "entityService",
    function ApplicationController(service, entityService) {
      var app = this;
      app.jsonData = "";
        service.getData().then(
        /**
         * @param {ComplexExampleEntity} entity
         */
        function (entity){
          // Every nested object from data.children will be instance of ChildExampleEntity
          console.log('Complex Entity:');
          console.log(entity);
          console.log('Second child Entity:');
          console.log(entity.getChild(1));
          console.log('Fifth child Entity:');
          console.log(entity.getChild(4));
          console.log('Descriptor Mask of Third child Entity:');
          console.log(entity.getChild(2).descriptor.descriptorMask);
          app.jsonData = JSON.stringify(entity.valueOf(), null, 2);
        }
      );
    }
  ]);
})(angular.module("application"));