/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
(function (module) {
  function ApplicationController($scope, $timeout) {
    var application = this;
    application.label = "Hello world!";
    $scope.source1 = 'App Source #1';
    $scope.source2 = [1, 2, 3, 4, 5];
    $timeout(function (a) {
      $scope.source1 = '#2 SRC #2';
    }, 1500);
    $timeout(function (a) {
      $scope.source2 = [5, 4, 3, 2, 1];
    }, 2500);
  }

  module.controller('aw.Application', [
    '$scope',
    '$timeout',
    ApplicationController
  ]);

  module.service('test', [
    'entityService',
    function TestService(entityService){

    }
  ]);
})(angular.module('aw.Application', ['aw.datamapping']));