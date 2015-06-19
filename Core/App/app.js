var coreApp = angular.module('coreApp', ['ngRoute', 'ui.bootstrap']);
coreApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
          when('/EditableTest', {
              templateUrl: 'App/Views/EditableTest.html',
              controller: 'globalController'
          }).
          when('/TestTool', {
              templateUrl: 'App/Views/TestTool.html',
              controller: 'testToolController'
          }).
        otherwise({
            redirectTo: '/EditableTest'
        });
  }]);

coreApp.controller('globalController', function ($scope)
{
    $scope.global = {};
});

coreApp.controller('debugController', function ($scope, logService)
{
    $scope.selectLogRow = function(logRow) {
        $scope.activeLogRow = logRow;
    };
    
    $scope.logRows = [];
    
    $scope.activeLogRow = {};
    
    $scope.logRows = logService.logRows;
    
});

coreApp.controller('testToolController', function ($scope, $http, httpService) {
    
    // Any function re

    $scope.postUrl = 'http://localhost:88/api/service/get/' + $scope.entity;
    $scope.params = [{
        name: null,
        value: null
    }];
    $scope.isException = false;
    $scope.hasResult = false;

    $scope.newRow = function () {
        $scope.params.push({
            name: null,
            value: null
        });
    }

    $scope.paramObject = {};

    $scope.doPost = function () {
        $scope.paramObject = {};
        for (var i = 0; i < $scope.params.length; i++)
        {
            if ($scope.params[i].name == null) {
                continue;
            }
            if ($scope.params[i].name.length > 0)
            {
                if ($scope.params[i].value == '') {
                    $scope.params[i].value = null;
                }

                $scope.paramObject[$scope.params[i].name] = $scope.params[i].value;
            }
        }


        $scope.hasResult = false;
        var func = httpService.get;

        if ($scope.method === 'set')
            func = httpService.set;

        if ($scope.method === 'feed')
            func = httpService.feed;

        func($scope.entity, $scope.paramObject,
            function (response) { // success
                $scope.success = true;
                console.log('success', response);
                $scope.hasResult = true;
                $scope.isException = false;
                $scope.outputJson = response;
            },
            function (response) { // fail
                console.log('fail', response);
                $scope.success = false;
                $scope.hasResult = true;
                $scope.isException = true;
                $scope.outputJson = response.data;
            },
            $scope.rollback
        );
    }
});


var createCard = function(name, settings, scope) {
    
};