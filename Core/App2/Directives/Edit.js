coreGuiApp.directive('edit', function ($http) {
    return {
        restrict: 'E',
        templateUrl: 'app/directives/edit.html',
        scope: {
            entity: '@entity',
            postdata: '@postdata'
        },
        transclude: true,
        controller: function ($scope) {
            $scope.itemScopes = [];

            $scope.isEditMode = false;
            console.log('EDIT', $scope.isEditMode);
            $scope.setEditMode = function (b) {
                $scope.isEditMode = b;
                angular.forEach($scope.itemScopes, function (is) {
                    is.isEditMode = $scope.isEditMode;
                });
                $scope.isSuccess = null;
            }

            $scope.submit = function () {
                console.log('$scope.model', $scope.model);
                $http.post('http://localhost:88/api/service/set/user', $scope.model).
                success(function (data, status, headers, config) {
                    $scope.setEditMode(false);
                    $scope.isSuccess = data.Success;
                }).
                error(function (data, status, headers, config) {
                    $scope.isSuccess = false;
                });
            }

            $scope.model = {};
            $http.post('http://localhost:88/api/service/get/' + $scope.entity, $scope.postdata).
                success(function (data, status, headers, config) {
                    angular.forEach($scope.itemScopes, function (is) {
                        is.model = data.Data;
                    });
                }).
                error(function (data, status, headers, config) {

                });

            this.addControl = function (itemScope) {
                itemScope.model = $scope.model
                console.log('itemScope', $scope.model);
                itemScope.isEditMode = $scope.isEditMode;

                $scope.itemScopes.push(itemScope);

                itemScope.$watch('model', function (v) {
                    console.log('modelchange', v);
                    $scope.model = v;
                });
            }
        },
        link: function (scope, element, attr) {
        }
    };
});

coreGuiApp.directive('editrow', function ($compile) {
    return {
        require: '^edit',
        restrict: 'E',
        scope: {
            'label': '@'  
        },
        transclude: true,
        template: '<div class="editrow">'
            + '<div class="editrow-label">{{label}}</div>'
            + '<div class="editrow-content" ng-transclude></div>'
            + '<div style="clear:both"></div></div>'
    };
});

coreGuiApp.directive('editabletext', function ($compile) {
    return {
        require: '^edit',
        restrict: 'E',
        scope: {
            'property': '@'
        },
        templateUrl: 'app/directives/editableText.html',
        link: function (scope, element, attr, editControl) {
            editControl.addControl(scope);
            scope.value = scope.model[scope.property];
        }
    };
});

coreGuiApp.directive('photo', function ($compile) {
    return {
        require: '^edit',
        restrict: 'E',
        scope: {
            'property': '@',
            'maxWidth': '@',
            'maxHeight': '@'
        },
        templateUrl: 'app/directives/photo.html',
        link: function (scope, element, attr, editControl) {
            editControl.addControl(scope);

            scope.value = scope.model[scope.property];
            console.log('model', scope.model);
        }
    };
});

coreGuiApp.directive('dropdown', function ($http) {
    return {
        require: '^edit',
        restrict: 'E',
        scope: {
            'property': '@',
            'entity': '@'
        },
        templateUrl: 'app/directives/dropdown.html',
        link: function (scope, element, attr, editControl) {
            editControl.addControl(scope);
            scope.value = scope.model[scope.property];
        },
        controller: function ($scope) {
            $http.post('http://localhost:88/api/service/select/' + $scope.entity, {}).
            success(function (data, status, headers, config) {
                $scope.dropdownItems = data.Data;
            }).
            error(function (data, status, headers, config) {

            });
        }
    };
});



coreGuiApp.directive('autocomplete', function ($http) {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'app/directives/autocomplete.html',
        link: function (scope, element, attr)
        {
            var input = element.find('.autocomplete-input');
            var content = element.find('.autocomplete-content');
            content.hide();
            
            var selectedIndex = -1;
            var deselect = function () {
                element.find('div.autocomplete-item').removeClass('autocomplete-selected');
                selectedIndex = -1;
            }
            var selectItem = function () {
                var obj = scope.matchedIems[selectedIndex];
                element.find('div.autocomplete-item').empty();
                setText(obj.Name);
            }

            var setText = function (text) {
                input.val(text);
            }
            var markItem = function (offset) {

                selectedIndex += offset;

                if (selectedIndex < 0)
                    selectedIndex = 0;

                var count = element.find('div.autocomplete-item').length;
                if (selectedIndex >= count)
                    selectedIndex = count - 1;

                element.find('div.autocomplete-item').removeClass('autocomplete-selected');
                element.find('div.autocomplete-item:eq(' + selectedIndex + ')').addClass('autocomplete-selected');
            }

            input.on('blur', function (e) {
                content.hide();
            });
            input.bind('keydown', function (e) {
                /*
                left = 37
                up = 38
                right = 39
                down = 40
                */

                if (e.keyCode == 40) {
                    markItem(1);
                } else if (e.keyCode == 38) {
                    markItem(-1);
                } else if (e.keyCode == 13) {
                    selectItem();
                } else if (e.keyCode == 8) {
                    keyPress('');
                }
            });

            var keyPress = function (c) {
                var value = input.val() + c;

                if (c == '')
                    value = value.substring(0, value.length - 1);

                content.empty();
                scope.matchedIems = [];
                for (var i = 0; i < scope.data.length; i++) {
                    var x = scope.data[i].Name.toLowerCase();

                    console.log('compare', x, value.toLowerCase());

                    if (x.indexOf(value.toLowerCase()) < 0) {
                        continue;
                    }

                    scope.matchedIems.push(scope.data[i]);

                    x = x.replace(value, '<b>' + value + '</b>');

                    var itemContent = '<div class="autocomplete-item">' + x + '</div>';
                    content.append(itemContent)
                }

                if (scope.matchedIems.length > 0)
                    element.find('.autocomplete-content').show();
                else
                    element.find('.autocomplete-content').hide();

                deselect();
            }

            input.bind('keypress', function (e) {
                var c = String.fromCharCode(e.keyCode);
                keyPress(c);
            });
        },
        controller: function ($scope) {
            $scope.data = [
                { Name: 'Jeff' },
                { Name: 'Monica' },
                { Name: 'Jeff' },
                { Name: 'Monica' },
                { Name: 'Jeff' },
                { Name: 'Monica' },
                { Name: 'Jeff' },
                { Name: 'Monica' },
                { Name: 'Jeff' },
                { Name: 'Monica' }
            ];
        }
    };
});
