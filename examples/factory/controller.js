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
      this.data = service.getData({// lets receive ordinary object from service
        stringParam: "Any String here",
        boolParam: true,
        numberParam: 3.14,
        children: [
          {stringParam: "First Child"},
          {stringParam: "Second Child"},
          {stringParam: "Third Child"},
          {stringParam: "Fourth Child"},
          {stringParam: "Fifth Child"}
        ]
      });
      // Every nested object from data.children will be instance of SimpleEntity
      console.log(this.data);
    }
  ]);
})(angular.module("application"));