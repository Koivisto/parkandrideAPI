'use strict';

var _ = require('lodash');

var po = require('../../pageobjects/pageobjects.js');
var fixtures = require('../../fixtures/fixtures');
var devApi = require('../devApi')();

describe('hub list', function () {
    var indexPage = po.indexPage({});
    var hubListPage = po.hubListPage({});
    var hubEditPage = po.hubEditPage({});
    var facilityEditPage = po.facilityEditPage({});

    var hubFactory = fixtures.hubFactory;
    var facilityFactory = fixtures.facilityFactory;

    it('is the default view', function () {
        indexPage.get();
        expect(hubListPage.isDisplayed()).toBe(true);
    });

    describe('navigation', function () {
        beforeEach(function () {
            hubListPage.get();
        });

        it('to create facility', function () {
            hubListPage.toFacilityCreateView();
            expect(facilityEditPage.isDisplayed()).toBe(true);
        });

        it('to create hub', function () {
            hubListPage.toHubCreateView();
            expect(hubEditPage.isDisplayed()).toBe(true);
        });
    });

    describe('with hubs and facilities', function () {
        var hnames = [ "guX", "NORF"];
        var facilityNameOrder = [ "b@z", "Bar", "bär", "foo", "fov", "fow", "fåå", "föö" ];

        beforeEach(function () {
            var facilitiesFn  = _.partial(facilityFactory.facilitiesFromProto, fixtures.facilitiesFixture.dummies.facFull, facilityNameOrder);

            var hubs = hubFactory.hubsFromProto(fixtures.hubsFixture.westend, hnames);
            _.forEach(hubs, function(hub) {
                var prependHubName = function (f) { f.name = hub.name + '_' + f.name; return f; };
                hub.setFacilities(_.map(facilitiesFn(), prependHubName));
            });

            devApi.resetAll(_.union(facilitiesFn(), hubs[0].facilities, hubs[1].facilities), hubs);
            hubListPage.get();
        });

        it('facilities without hubs are followed by facilities grouped into hubs', function () {
            var expectedOrderHub = function(hubName) { return [hubName].concat(_.map(facilityNameOrder, function(name) { return hubName + "_" + name;  })); };

            expect(hubListPage.getHubAndFacilityNames()).toEqual(
                facilityNameOrder.concat(expectedOrderHub("guX")).concat(expectedOrderHub("NORF"))
            );
        });
    });
});
