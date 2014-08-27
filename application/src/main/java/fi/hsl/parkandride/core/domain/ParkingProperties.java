package fi.hsl.parkandride.core.domain;

public class ParkingProperties {
    private final MultiLingualString alias;

    public ParkingProperties(MultiLingualString alias) {
        this.alias = alias;
    }

    public MultiLingualString getAlias() {
        return alias;
    }
}