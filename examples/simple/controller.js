/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  module.controller("Application", [
    "service",
    "entityService",
    function ApplicationController(service, entityService) {
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
      console.log(this.data instanceof entityService.get('simple'), this.data instanceof  entityService.get('Entity'));
    }
  ]);
})(angular.module("application"));