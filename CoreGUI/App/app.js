﻿var coreGuiApp = angular.module('coreGuiApp', ['ngRoute']);
coreGuiApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/TestTool', {
            templateUrl: 'App/Templates/PostTool.html',
            controller: 'testToolController'
        }).
        otherwise({
            redirectTo: '/TestTool'
        });
  }]);

coreGuiApp.controller('testToolController', function ($scope, $http) {
    
    $scope.postUrl = 'http://localhost:88/api/StoredProcedure/get/person';
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

        console.log($scope.paramObject);
        $scope.hasResult = false;
        $http({
            url: $scope.postUrl,
            data: { a: 123 },
            method: 'POST'
        }).
          success(function (data, status, headers, config) {
              $scope.hasResult = true;
              $scope.isException = false;
              $scope.outputJson = data;
          }).
          error(function (data, status, headers, config) {
              $scope.hasResult = true;
              $scope.isException = true;
              $scope.outputJson = data;
          });
    }
});