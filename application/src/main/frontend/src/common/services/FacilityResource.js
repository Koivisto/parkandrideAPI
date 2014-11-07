(function() {
    var m = angular.module('parkandride.FacilityResource', [
        'parkandride.Sequence'
    ]);

    function cleanupCapacities(capacities) {
        for (var capacityType in capacities) {
            if (!(capacities[capacityType] &&  capacities[capacityType].built && capacities[capacityType].built >= 1)) {
                delete capacities[capacityType];
            }
        }
    }

    m.factory('FacilityResource', function($http, $q, Sequence) {

        function assignPortIds(facility) {
            for (var i = 0; i < facility.ports.length; i++) {
                facility.ports[i]._id = Sequence.nextval();
            }
            return facility;
        }
        var api = {};

        api.newFacility = function() {
            return {
                aliases: [],
                capacities: {}
            };
        };

        api.listFacilities = function(search) {
            return $http.get("/api/facilities", {
                params: search
            }).then(function(response) {
                return response.data.results;
            });
        };

        api.getFacility = function(id) {
            return $http.get("/api/facilities/" + id).then(function(response){
                return assignPortIds(response.data);
            });
        };

        api.save = function(facility) {
            cleanupCapacities(facility.capacities);
            if (facility.id) {
                return $http.put("/api/facilities/" + facility.id, facility).then(function(response){
                    return response.data.id;
                });
            } else {
                return $http.post("/api/facilities", facility).then(function(response){
                    return response.data.id;
                });
            }
        };

        api.findFacilitiesAsFeatureCollection = function(search) {
            return $http.get("/api/facilities.geojson", {
                params: search
            }).then(function(response) {
                return response.data;
            });
        };

        api.loadFacilities = function(facilityIds) {
            if (_.isEmpty(facilityIds)){
                var deferred = $q.defer();
                deferred.resolve([]);
                return deferred.promise;
            }
            return api.listFacilities({ ids: facilityIds });
        };

        api.summarizeFacilities = function(facilityIds) {
            if (_.isEmpty(facilityIds)){
                var deferred = $q.defer();
                deferred.resolve({ facilityCount: 0, capacities: {} });
                return deferred.promise;
            }

            return $http.get("/api/facilities", {
                params: { summary: true, ids: facilityIds }
            }).then(function(response) {
                return response.data;
            });
        };

        api.getCapacityTypes = function() {
            return $http.get("/api/capacity-types").then(function(response) {
                capacityTypesCached = response.data.results;
                return capacityTypesCached;
            });
        };

        return api;
    });

})();