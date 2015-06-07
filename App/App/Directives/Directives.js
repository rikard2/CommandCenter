var coreApp = angular.module('coreApp');

coreApp.controller('EditController', function($scope) {
	console.log('editController');
	
	$scope.state = {
		isEditMode: false
	};
	
	this.scope = $scope;
	
	this.test = function() {
		console.log('TEST!');
	};
	
	this.save = function() {
		alert('save!');
	};
	
	this.cancel = function() {
		$scope.state.isEditMode = false;
	};
	
	this.edit = function() {
		console.log('edit');
		$scope.state.isEditMode = true;
	};
		
});

coreApp.directive('edit', function($http) {
	
	var linker = function(scope, element, attrs, ctrl, transclude) {
		
		scope.model = {
			name: 'Jeff',
			origin: 'Edit',
			FirstName: 'Jeff',
			LastName: 'Brown'
		};
		
		scope.isEditMode = false;
		
		
		transclude(scope, function(clone) {
			element.after(clone);
		});
		
	};
	
	return {
		transclude: 'element',
		replace: true,
		link: linker,
		restrict: 'E',
		controller: 'EditController'
	};
	
});

coreApp.directive('cardHeader', function() {
	return {
		scope: {
			title: '@'
		},
		transclude: true,
		template:
			'<div class="box-header">'
			
			// title
			+ '<div class="pull-left">{{title}}</div>'
			
			// right icons
			+ '<div class="pull-right">'
			+ '<div ng-transclude></div>'
			+ '</div>'
			
			// end element
			+ '<div style="clear:both"></div></div>'
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
			title: '@'
		},
		transclude: true,
		controller: function($scope) {
			var _this  = this;
			
			this.onClick = function() {
			};
			
			$scope.onClick = function() {
				_this.onClick();
			};
		},
		restrict: 'E',
		template: '<button class="btn btn-success" ng-click="onClick()" ng-transclude></button>'
	};
});

coreApp.directive('editAction', function() {
	return {
		require: ['^edit', '^?cardButton', '^?cardHeaderLink'],
		restrict: 'A',
		link: function(scope, element, attrs, ctrl) {
			var _edit = ctrl[0];
			var _button = ctrl[1] || ctrl[2];
			
			if (attrs.type === "save") {
				_button.onClick = _edit.save;
			} else if (attrs.type === "cancel") {
				_button.onClick = _edit.cancel;
			} else if (attrs.type === "edit") {
				_button.onClick = _edit.edit;
			}
			console.log('ctrl!', ctrl, _button);
		}
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
		template: '<div ng-transclude></div>'
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
		template: '<div class="btn btn-round-sm ng-scope btn-nav" ng-click="onClick()" bs-tooltip="" title="Upload media"><i class="fa fa-trash-o"></i></div>'
	};
});

coreApp.directive('editTextbox', function() {
	return {
		require: '^edit',
		scope: {
			label: '@',
			attribute: '@'
		},
		restrict: 'E',
		replace: true,
		template: '<div>'
			+ '<div ng-show="!state.isEditMode">{{model[attribute]}}</div>'
			+ '<div class="form-group" ng-show="state.isEditMode"><label>{{label}}</label>'
			+ '<input type="textbox" class="form-control" ng-model="model[attribute]"/></div>',
		link: function(scope, element, attrs, ctrl) {
			scope.model = ctrl.scope.model;
			scope.state = ctrl.scope.state;
			ctrl.test();
		}
	};
});