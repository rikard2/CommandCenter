/* global coreGuiApp */
coreGuiApp.directive('choose', function ($compile, $document) {
    return {
        restrict: 'E',
        scope: {
            'searchable': '@',
            'mode': '@'
        },
        transclude: true,
        templateUrl: 'app/directives/choose.html',
        link: function (scope, element, attr) {
            scope.isSearchable = scope.searchable === 'true';
            scope.isSingle = scope.mode == 'single';
            scope.isMulti = scope.mode == 'multi';
            scope.showChoosePanel = false;
            
            var selectedPanel = element.find('.choose-selected-panel');
            var choosePanel = element.find('.choose-panel');
            var input = element.find('.choose-input');
            var add = element.find('.choose-tags li.choose-add');
            
            choosePanel.hide();
            scope.markedItem = null;
            // MARKING
            scope.markItem = function(offset) {
                scope.markedIndex = scope.markedIndex || 0;
                scope.markedIndex = scope.markedIndex + offset;
                var y = element.find('.choose-item');
                var x = 0;
                
                if (scope.markedIndex < 0) {
                    scope.markedIndex = 0;
                }
                
                if (scope.markedIndex >= y.length) {
                    scope.markedIndex = y.length - 1;
                }
                
                scope.markedItem = scope.items[scope.markedIndex];
                angular.forEach(y, function(i) {
                    if (x !== scope.markedIndex) {
                        element.find(i).css('background', 'transparent');
                    } else {
                        element.find(i).css('background', 'red');
                    }
                    x++;
                });
                console.log('scope.markedIndex', scope.markedIndex);
            };
            
            scope.markItem(0);
            
            input.bind('keydown', function (e) {
                if (e.keyCode == 40) {
                    scope.markItem(1);
                } else if (e.keyCode == 38) {
                    scope.markItem(-1);
                } else if (e.keyCode == 13) {
                    scope.itemClick(scope.markedItem);
                } else {
                    scope.markItem(0);
                }
            });
            
            add.on('click', function (e) {
                choosePanel.show();
                if (scope.isSearchable) {
                    input.focus();
                }
                
                e.stopPropagation();
            });
            
            selectedPanel.on('click', function (e) {
                if (scope.isSingle) {
                    choosePanel.show();
                    
                    if (scope.isSearchable) {
                        input.focus();
                    }
                }
                
                e.stopPropagation();
            });
            
            scope.itemClick = function(item) {
                if (scope.isSingle) {
                    scope.item = item;
                } else {
                    if (scope.selectedItems.indexOf(item) === -1)
                        scope.selectedItems.push(item);
                }
                choosePanel.hide();
            };
            
            $document.on('click', function(e) {
               
               if (!choosePanel.is(e.target) && choosePanel.has(e.target).length === 0)
               {
                   console.log('outside!!!');
                  // selectedPanel.show();
                   choosePanel.hide();
               }
               
            });

        },
        controller: function ($scope, $transclude) {
            console.log('TRANSCLUDE', $transclude);
            $scope.selectedItems = [];
            
            $scope.isSelected = true;
            $scope.item = { Name: 'Hanna Montans' };

            $scope.inputBlur = function () {
                console.log('inputBlur');
                $scope.isSelected = true;
            };

            $scope.select = function () {
                console.log('select');
                $scope.isSelected = false;
            };

            $scope.items = [
                { Name: 'Jeff Brown' },
                { Name: 'Martin Brown' },
                { Name: 'Hanna Montans' },
                { Name: 'Maria Carey' },
                { Name: 'Dietrich Schaffer' },
                { Name: 'Marco Reus' },
                { Name: 'Mark Ahl' }
            ];
            
            $scope.removeItem = function(item) {
                var io = $scope.selectedItems.indexOf(item);
                if (io >= 0) {
                    $scope.selectedItems.splice(io, 1);
                }
            }
            
        }
    };
});
