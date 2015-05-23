var coreGuiApp = angular.module('coreGuiApp', ['ngRoute', 'ui.bootstrap']);
coreGuiApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/TestTool', {
            templateUrl: 'App/Templates/PostTool.html',
            controller: 'testToolController'
        }).
          when('/EditableTest', {
              templateUrl: 'App/Templates/EditableTest.html',
              controller: 'editableTestController'
          }).
        otherwise({
            redirectTo: '/TestTool'
        });
  }]);

coreGuiApp.controller('editableTestController', function ($scope, $http) {
    $scope.value = 123;
    $scope.personModel = {
        test: 132,
        description: 'hello world'
    };
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    console.log('states', $scope.states);
    $scope.userModel = { };
});
coreGuiApp.controller('testToolController', function ($scope, $http) {
    
    // Any function re

    $scope.postUrl = 'http://localhost:88/api/service/get/' + scope.entity;
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
        $http.post($scope.postUrl, JSON.stringify($scope.paramObject)).
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