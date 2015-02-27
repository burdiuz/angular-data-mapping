/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  function ApplicationController($scope) {
    var application = this;
    application.label = "Hello world!";
  }

  module.controller('aw.Application', [
    '$scope',
    ApplicationController
  ]);

  module.service('test', [
    'entityService',
    function TestService(entityService){
      
    }
  ]);
})(angular.module('aw.Application', ['aw.datamapping']));