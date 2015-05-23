var app = angular.module('CoreApp', ['ngMaterial']);

app.controller('CoreController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {

    $scope.getMatches = function (searchText) {
        return [
            { Name: 'Jeff' }
        ];
    }

}]);

