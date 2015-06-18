var coreApp = angular.module('coreApp');
coreApp.directive('gridView', function($http, $compile) {
	
	var linker = function(scope, element, attrs, ctrl, transclude) {
		
		
		transclude(scope, function(clone) {
			element.empty();
			element.after(angular.element('<table class="tbl">'));
			element.after(clone);
			element.after(angular.element('</table>'));
		});
		
	};
	
	return {
		transclude: true,
		replace: true,
		restrict: 'E',
		controller: function($scope, $element) {
			$scope.columns = [];
			$scope.models = [
				{
					FirstName: 'Anna',
					LastName: 'Andersson',
					Age: 22
				},
				{
					FirstName: 'Matilda',
					LastName: 'Jenssen',
					Age: 24
				},
				{
					FirstName: 'Matilda',
					LastName: 'Jenssen',
					Age: 24
				},
				{
					FirstName: 'Mats',
					LastName: 'Sundin',
					Age: 53
				},
				{
					FirstName: 'Matilda',
					LastName: 'Jenssen',
					Age: 24
				}
			];
			
			$scope.currentSortColumn = null;
			
			$scope.sortBy = null;
			$scope.sortClick = function(column) {
				column.sortOrderFlag = (column.sortOrderFlag == '-') ? '+' : '-';
				$scope.currentSortColumn = column;
				$scope.sortBy = column.attribute;
			};
			
			
			$scope.links = [];
			$scope.actions = [];
			
			this.addLink = function(attrs) {
				$scope.links.push({
					icon: attrs.icon
				});
			};
			
			
			
			this.addColumn = function(attrs) {
				$scope.columns.push({
					label: attrs.label,
					attribute: attrs.attribute
				});
			};
			/* ACTIONS */
			$scope.actions = [];
			
			this.addAction = function(attrs) {
				$scope.actions.push({
					icon: attrs.icon,
					title: attrs.title
				});
			};
			
			$scope.onActionClick = function(action, model) {
				alert('action!');	
			};
			
			/* DRILLDOWN */
			$scope.drilldowns = [];
			
			this.addDrilldown = function(element, attrs) {
				$scope.drilldowns.push({
					isOpened: false,
					element: element,
					icon: attrs.icon
				});
			};
			
			
			$scope.onDrilldownLinkClick = function(event, drilldown, model) {
				
				if (model._openedDrilldown === drilldown)
				{
					model._openedDrilldown = null;
					var isDrilldownOpen = false;
				} else {
					model._openedDrilldown = drilldown;
					var isDrilldownOpen = true;
				}
				var closest = angular.element(event.target.closest('tr'));
				
				var next = closest.next().find('td');
				var isHidden = next.css('display') === 'none';

				if (isDrilldownOpen) {
					next.show();
					$scope.model = model;
					var newElement = angular.element(
						'<div>' + drilldown.element.html() + '</div>' );
					
					$compile(newElement.contents())($scope);
					next.empty();
					next.append(newElement);
				} else {
					next.hide();
				}
			};
			
		},
		templateUrl: 'App/Directives/Templates/GridTemplate.html'
	};
	
});

coreApp.directive('gridColumn', function($http) {	
	return {
		scope: {
			label: '@',
			attribute: '@'
		},
		transclude: true,
		replace: true,
		restrict: 'E',
		require: '^gridView',
		link: function(scope, element, attrs, ctrl) {
			ctrl.addColumn(attrs);
		}
	};
});

coreApp.directive('gridLink', function($http) {	
	return {
		transclude: false,
		replace: true,
		restrict: 'E',
		require: '^gridView',
		link: function(scope, element, attrs, ctrl) {
			ctrl.addLink(attrs);
		}
	};
});

coreApp.directive('gridAction', function($http) {	
	return {
		transclude: false,
		replace: true,
		restrict: 'E',
		require: '^gridView',
		link: function(scope, element, attrs, ctrl) {
			ctrl.addAction(attrs);
		}
	};
});

coreApp.directive('gridDrilldown', function($http) {	
	return {
		transclude: false,
		replace: false,
		restrict: 'E',
		require: '^gridView',
		link: function(scope, element, attrs, ctrl) {	
			ctrl.addDrilldown(element.clone(), attrs);
			element.empty();
		}
	};
});