(function() {
    var m = angular.module('parkandride.auth', []);

    m.factory('Session', function() {
        var storageKey = "login";
        var loginCache;
        return {
            set: function(user) {
                if (_.isArray(user.permissions)) {
                    user.permissions = _.reduce(
                        user.permissions,
                        function(obj, perm) {
                            obj[perm] = true;
                            return obj;
                        },
                        {}
                    );
                }
                loginCache = user;
                sessionStorage.setItem(storageKey, angular.toJson(user));
            },
            remove: function() {
                loginCache = null;
                sessionStorage.clear();
            },
            get: function() {
                if (loginCache) {
                    return loginCache;
                }
                var loginData = sessionStorage.getItem(storageKey);
                if (loginData) {
                    loginCache = angular.fromJson(loginData);
                }
                return loginCache;
            }
        };
    });

    m.value('Permission', {
        FACILITY_CREATE: 'FACILITY_CREATE',
        FACILITY_UPDATE: 'FACILITY_UPDATE',
        OPERATOR_CREATE: 'OPERATOR_CREATE',
        OPERATOR_UPDATE: 'OPERATOR_UPDATE',
        CONTACT_CREATE: 'CONTACT_CREATE',
        CONTACT_UPDATE: 'CONTACT_UPDATE',
        USER_CREATE: 'USER_CREATE',
        USER_UPDATE: 'USER_UPDATE',
        USER_VIEW: 'USER_VIEW',
        FACILITY_STATUS_UPDATE: 'FACILITY_STATUS_UPDATE',
        HUB_CREATE: 'HUB_CREATE',
        HUB_UPDATE: 'HUB_UPDATE'
    });

    m.factory('permit', function(Session, Permission) {
       return function(permission, operatorId) {
           if (!Permission[permission]) {
               throw "Unknown permission: " + permission;
           }

           var user = Session.get();
           if (user) {
               if (!user.permissions[permission]) {
                   return false;
               }
               if (typeof operatorId !== 'undefined' && user.role !== 'ADMIN') {
                   return operatorId === user.operatorId;
               }
               return true;
           }
           return false;
       };
    });

    m.controller('LoginController', function($scope, $modalInstance, $http, Session) {
        $scope.credentials = {
            username: "",
            password: ""
        };
        $scope.login = function(credentials) {
            $scope.loginError = false;
            $http.post("internal/login", credentials, {"skipDefaultViolationsHandling": true}).then(
                function(result) {
                    Session.set(result.data);
                    $modalInstance.close(result.data);
                },
                function(rejection) {
                    $scope.loginError = true;
                }
            );
        };
    });

    m.factory("loginPrompt", function($modal) {
        return function() {
            var modalInstance = $modal.open({
                templateUrl: 'auth/login.tpl.html',
                controller: 'LoginController'
            });
            return modalInstance.result;
        };
    });

})();
