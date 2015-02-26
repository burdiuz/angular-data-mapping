/**
 * Created by Oleg Galaburda on 20.02.2015.
 */
//FIXME, try put insights instead of module.config into module.provider, all of these will be available in config state!
//FIXME directive component will use scope:{param:"=@"} parameter of directive to make all facade properties be availablre to upper level
//FIXME use prelink function with passed controller, if not possible create instance of facade with try{}catch and in case of error tell that facade must not require anything oncreation phase
//FIXME directive facade may have directiveArguments property with list of properties being exposed to upper level
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