// Copyright © 2015 HSL

(function() {
    var m = angular.module('parkandride.multilingual', []);

    function MultilingualEditLink(scope, element, attrs, ctrl) {
        function toNullIfAllEmpty() {
            if (scope.string && !scope.string.fi && !scope.string.sv && !scope.string.en) {
                scope.string = null;
            }
        }
        scope.$watch("string.fi", toNullIfAllEmpty);
        scope.$watch("string.sv", toNullIfAllEmpty);
        scope.$watch("string.en", toNullIfAllEmpty);
    }

    m.directive('multilingualEdit', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                string: '=ngModel',
                mandatory: '=',
                name: '@'
            },
            templateUrl: 'directives/multilingualEdit.tpl.html',
            transclude: false,
            link: MultilingualEditLink
        };
    });

    m.directive('longMultilingualEdit', function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope: {
                string: '=ngModel',
                mandatory: '=',
                name: '@'
            },
            templateUrl: 'directives/longMultilingualEdit.tpl.html',
            transclude: false,
            link: MultilingualEditLink
        };
    });

    m.directive('multilingualView', function () {
        return {
            restrict: 'E',
            scope: {
                value: '=value'
            },
            templateUrl: 'directives/multilingualView.tpl.html',
            transclude: false
        };
    });
})();
