coreGuiApp.directive('edit', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/edit.html',
        scope: {
            datamodel: '=datamodel',
            method: '@method',
            target: '@target',
            postdata: '@postdata'
        },
        transclude: true,

        link: function (scope, element, attr) {
            console.log('datamodel', scope.postdata);
            scope.setEditMode = function (b) {
                console.log('datamodel', scope.datamodel);
                scope.datamodel.$isEditMode = b;
            }
            scope.isSuccess = false;
            scope.isSaved = false;
            scope.loading = true;
            scope.errorMessage = null;
            scope.submit = function () {
                

                var pd = scope.datamodel; //angular.extend(scope.datamodel, { UserId: null });
                console.log('submitting', pd);
                $http.post('http://localhost:88/api/service/set/' + scope.target, pd).
                
                
                success(function (data, status, headers, config) {
                    scope.isSaved = true;
                    scope.isSuccess = data.Success;
                    scope.setEditMode(false);
                    scope.errorMessage = data.ErrorMessage;
                    console.log('success', data);
                }).
                error(function (data, status, headers, config) {
                    scope.isSaved = true;
                    scope.isSuccess = false;
                    console.log('error', data);
                });
            }
            
            $http.post('http://localhost:88/api/service/get/' + scope.target, scope.postdata).
                success(function (data, status, headers, config) {
                    scope.loading = false;
                    scope.datamodel = data.Data;
                    console.log('scope.datamodel', scope.datamodel);
                }).
                error(function (data, status, headers, config) {
                  
                });


        }
    };
});

coreGuiApp.directive('editabletext', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            'text': '=text',
            'datamodel': '=datamodel'
        },
        templateUrl: 'app/directives/editableText.html',
        link: function (scope, element, attr, transclude) {
            
            console.log('datamodel2', scope.datamodel);
        }
    };
});

coreGuiApp.directive('dropdown', function ($http) {
    return {
        restrict: 'E',
        scope: {
            'value': '=value',
            'entity': '@entity',
            'showInactivated': '@'
        },
        templateUrl: 'app/directives/dropdown.html',
        link: function (scope, element, attr, transclude) {
            console.log('showInactivated', scope.showInactivated);
            var extendData = {
                '_showInactivated': scope.showInactivated
            };
            $http.post('http://localhost:88/api/service/select/' + scope.entity, extendData).
            success(function (data, status, headers, config) {
                
                scope.dropdownData = data.Data;
            }).
            error(function (data, status, headers, config) {

            });
        }
    };
});

