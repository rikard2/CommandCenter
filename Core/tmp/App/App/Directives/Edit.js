var coreApp = angular.module('coreApp');

coreApp.controller('EditController', function($scope, $element, httpService) {
	console.log('editController', $element);
	$scope.state = {
		isEditMode: $scope.editMode
	};
	
	httpService.get('Person', {},
		function(data) {
			// success
		}
	);
	
	$scope.model = {
		name: 'Jeff',
		origin: 'Edit',
		FirstName: 'Jeff',
		LastName: 'Brown'
	};
	
	if ($scope.bindModel) {
		$scope.model = $scope.bindModel;
	}
	
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

coreApp.directive('editMode', function($http) {	
	return {
		transclude: true,
		replace: true,
		restrict: 'E',
		require: '^edit',
		template: '<div ng-show="state.isEditMode" ng-transclude></div>'
	};
});

coreApp.directive('displayMode', function($http) {	
	return {
		transclude: true,
		replace: true,
		restrict: 'E',
		require: '^edit',
		template: '<div ng-show="!state.isEditMode" ng-transclude></div>'
	};
});

coreApp.directive('edit', function($http) {
	
	var linker = function(scope, element, attrs, ctrl, transclude) {
		
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
		scope: {
			editMode: '=',
			bindModel: '='
		},
		controller: 'EditController'
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

coreApp.directive('editTextbox', function() {
	return {
		require: '^edit',
		scope: {
			label: '@',
			attribute: '@'
		},
		restrict: 'E',
		controller: function($scope) {
			console.log('controller...');
			$scope.attribute = 'wee';	
		},
		/*
		template: '<div class="input-group" style="margin-bottom:5px;">'
          + '<div class="input-group-addon">{{label}}</div>'
          + '<input type="text" ng-model="model[attribute]" class="form-control" id="exampleInputAmount" placeholder="Amount">'
		  + '</div>',
         */
        template: '<div>'
			+ '<div ng-show="!state.isEditMode">{{model[attribute]}}</div>'
			+ '<div class="form-group" ng-show="state.isEditMode"><label>{{label}}</label>'
			+ '<input type="textbox" class="form-control" ng-model="model[attribute]"/></div>',
			
		link: function(scope, element, attrs, ctrl) {
			scope.model = ctrl.scope.model;
			scope.state = ctrl.scope.state;
		}
	};
});