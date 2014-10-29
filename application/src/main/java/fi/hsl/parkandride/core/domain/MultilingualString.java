package fi.hsl.parkandride.core.domain;

import static java.util.Objects.equals;

import java.util.Objects;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import com.google.common.base.MoreObjects;

public class MultilingualString {

    @NotBlank
    @Length(min=0, max=255)
    public String fi;

    @NotBlank
    @Length(min=0, max=255)
    public String sv;

    @NotBlank
    @Length(min=0, max=255)
    public String en;

    public MultilingualString() {}

    public MultilingualString(String all) {
        this(all, all, all);
    }
    public MultilingualString(String fi, String sv, String en) {
        this.fi = fi;
        this.sv = sv;
        this.en = en;
    }

    public String getFi() {
        return fi;
    }

    public String getSv() {
        return sv;
    }

    public String getEn() {
        return en;
    }

    @Override
    public int hashCode() {
        int hashCode = fi==null ? 1 : fi.hashCode();
        hashCode = 31*hashCode + (sv==null ? 0 : sv.hashCode());
        return 31*hashCode + (en==null ? 0 : en.hashCode());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        } else if (obj instanceof MultilingualString) {
            MultilingualString other = (MultilingualString) obj;
            return Objects.equals(this.fi, other.fi) && Objects.equals(this.sv, other.sv) && Objects.equals(this.en, other.en);
        } else {
            return false;
        }
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(MultilingualString.class)
                .add("fi", fi)
                .add("sv", sv)
                .add("en", en)
                .toString();
    }
}