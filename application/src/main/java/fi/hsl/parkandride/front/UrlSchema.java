package fi.hsl.parkandride.front;

public class UrlSchema {

    public static final String GEOJSON = "application/vnd.geo+json";


    public static final String API = "/api";

    public static final String FACILITIES = API + "/facilities";

    public static final String FACILITY_ID = "facilityId";

    public static final String FACILITY = FACILITIES + "/{" + FACILITY_ID + "}" ;

    public static final String CAPACITY_TYPES = API + "/capacity-types";


    public static final String HUBS = API + "/hubs";

    public static final String HUB_ID = "hubId";

    public static final String HUB = HUBS + "/{" + HUB_ID + "}" ;

    /**
     * TESTING
     */
    public static final String TEST_API = "/dev-api";

    public static final String TEST_FACILITIES = TEST_API + "/facilities";

    public static final String TEST_HUBS = TEST_API + "/hubs";

}