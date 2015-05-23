coreGuiApp.directive('choose', function ($compile) {
    return {
        restrict: 'E',
        scope: {
        },
        transclude: true,
        templateUrl: 'app/directives/choose.html',
        link: function (scope, element, attr) {
            
            var p = element.find('div');
            console.log('=======>', p, element);
            p.on('click', function () {
                element.find('input').focus();
            });

        },
        /*
        compile: function chooseCompile($element, $attr) {
            alert('compile');
            return function chooseLink($scope, $element, $attr, ctrl, $transclude) {
                $transclude(function ngRepeatTransclude(clone, scope) {
                    //scope["hello"] = 'maaan';
                    $compile(clone)(scope);
                });

            }
        },
        */
        controller: function ($scope, $transclude) {
            console.log('TRANSCLUDE', $transclude);
            $scope.isSelected = true;
            $scope.item = { Name: 'Hanna Montans' };

            $scope.inputBlur = function () {
                $scope.isSelected = true;
            };

            $scope.select = function () {
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
        }
    };
});
