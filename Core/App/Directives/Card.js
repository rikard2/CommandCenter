var coreApp = angular.module('coreApp');

coreApp.directive('cardHeader', function() {
	return {
		scope: {
			title: '@'
		},
		transclude: true,
		template:
			'<div style="background:#fefefe;"><div class="pull-left" style="padding:10px;">'
			+ '<h5 style="color:#41557d;font-size: 15px;margin:0px;font-weight:bold;">{{title}}</h5>'
			+ '</div><div class="pull-right" style="padding:7px;" ng-transclude></div>'
			+ '<div style="clear:both"></div></div><hr style="margin:0px;">'
			/*
			'<div class="box-header">'
			
			// title
			+ '<div class="pull-left">{{title}}</div>'
			
			// right icons
			+ '<div class="pull-right">'
			+ '<div ng-transclude></div>'
			+ '</div>'
			
			// end element
			+ '<div style="clear:both"></div></div>'
			*/
	};
});


coreApp.directive('cardNavLink', function() {
	return {
		transclude: true,
		scope: {
			'title': '@'
		},
		template: ' <div class="nav-link">'
		+ '&nbsp;{{title}}'
    	+ '<div style="float:right;">'
        //+ '<span class="typcn typcn-chevron-right"><span>'
		+ '<xicon icon="right" />'
		//+ '<span class="glyphicon glyphicon-menu-right"></span>'
    	+ '</div></div><div ng-transclude></div>'
		//<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
	};
});

coreApp.directive('cardNavSubLink', function() {
	return {
		transclude: true,
		scope: {
			'title': '@'	
		},
		template: ' <div class="nav-link" style="font-size:13px;font-weight:normal;">'
		+ '&nbsp;{{title}}'
    	+ '</div>'
		//<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
	};
});

coreApp.directive('cardFooter', function() {
	return {
		transclude: true,
		template: '<div class="footer" ng-transclude></div>'
	};
});

coreApp.directive('cardButton', function() {
	return {
		scope: {
			title: '@',
			type: '@'
		},
		transclude: true,
		controller: function($scope) {
			var _this  = this;
			
			this.onClick = function() {
			};
			
			$scope.onClick = function() {
				_this.onClick();
			};
			
			$scope.class = 'btn-default';
			
			if ($scope.type === 'save')
				$scope.class = 'btn-success';
				
			if ($scope.type === 'cancel')
				$scope.class = 'btn-danger';	
			
		},
		restrict: 'E',
		template: '<button class="btn {{class}}" ng-click="onClick()"><span ng-transclude/></button>'
	};
});

coreApp.directive('card', function() {
	return {
		transclude: true,
		replace: true,
		controller: function($scope) {
			this.hello = function() {
				alert('this is a card!');
			}	
		},
		restrict: 'E',
		template: '<div class="box ng-scope" ng-transclude></div>'
	};
});

coreApp.directive('cardContent', function() {
	return {
		transclude: true,
		replace: true,
		restrict: 'E',
		require: '^edit',
		template: '<div class="content" ng-transclude></div>'
	};
});

coreApp.directive('cardHeaderLink', function() {
	return {
		transclude: true,
		replace: true,
		restrict: 'E',
		require: '^edit',
		controller: function($scope) {
			var _this  = this;
			
			this.onClick = function() {
				console.log('default click');
			};
			
			$scope.onClick = function() {
				_this.onClick();
			};
		},
		template: '<div><subtle-button icon="\'edit\'" ng-click="onClick()"></subtle-button></div>' /*'<div class="btn btn-round-sm ng-scope btn-nav" ng-click="onClick()" bs-tooltip=""'
		+ ' title="Upload media"><span class="typcn typcn-edit" style="font-size:20px;"><span></div>'*/
	};
});