var coreApp = angular.module('coreApp');

coreApp.directive('emptyToNull', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                if(viewValue === "") {
                    return null;
                }
                return viewValue;
            });
        }
    };
});

coreApp.directive('xicon', function() {
	return {
		scope: {
			icon: '@',
			size: '@'
		},
		controller: function($scope) {
			$scope.icons = {
				'edit': { 'glyphicon': 'glyphicon-pencil' },
				'up': { 'glyphicon': 'glyphicon-chevron-up' },
				'down': { 'glyphicon': 'glyphicon-menu-down' },
				'right': { 'glyphicon': 'glyphicon-menu-right' },
				'new': { 'glyphicon': 'glyphicon-plus' },
				'user': { 'glyphicon': 'glyphicon-user' },
				'details': { 'glyphicon': 'glyphicon-search' },
				'delete': { 'glyphicon': 'glyphicon-minus-sign' }
			};
			
			$scope.size = $scope.size || 'medium';
			
			$scope.sizePixels = '14';
			
			if ($scope.size === 'small')
				$scope.sizePixels = '11';
		},
		template: '<span class="glyphicon {{icons[icon].glyphicon}}" style="font-size:{{sizePixels}}px"><span>'
	};
});

coreApp.directive('subtleButton', function() {
	return {
		restrict: 'E',
		scope: {
			icon: '='	
		},
		template: '<div class="subtle-button" ng-click="ngClick" bs-tooltip=""'
		+ ' title="Upload media">'
		+ '<xicon icon="{{icon}}" />'
		+ '</div>'
	};
});

coreApp.directive('checkbox', function() {
	return {
		restrict: 'E',
		template: '<input type="checkbox" ng-model="ngModel" />'
	};
});