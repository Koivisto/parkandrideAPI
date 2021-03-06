// Copyright © 2015 HSL

package fi.hsl.parkandride.core.service;

import static fi.hsl.parkandride.core.domain.Permission.FACILITY_CREATE;
import static fi.hsl.parkandride.core.domain.Permission.FACILITY_UPDATE;
import static fi.hsl.parkandride.core.domain.Permission.FACILITY_UTILIZATION_UPDATE;
import static fi.hsl.parkandride.core.service.AuthenticationService.authorize;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import fi.hsl.parkandride.core.back.ContactRepository;
import fi.hsl.parkandride.core.back.FacilityRepository;
import fi.hsl.parkandride.core.domain.*;

public class FacilityService {

    private final FacilityRepository repository;

    private final ValidationService validationService;

    private final ContactRepository contactRepository;

    public FacilityService(FacilityRepository repository, ContactRepository contactRepository, ValidationService validationService) {
        this.repository = repository;
        this.contactRepository = contactRepository;
        this.validationService = validationService;
    }

    @TransactionalWrite
    public Facility createFacility(Facility facility, User currentUser) {
        authorize(currentUser, facility, FACILITY_CREATE);
        validate(facility);

        return getFacility(repository.insertFacility(facility));
    }

    @TransactionalWrite
    public Facility updateFacility(long facilityId, Facility facility, User currentUser) {
        // User has update right to the input data...
        authorize(currentUser, facility, FACILITY_UPDATE);
        // ...and to the facility being updated
        Facility oldFacility = repository.getFacilityForUpdate(facilityId);
        authorize(currentUser, oldFacility, FACILITY_UPDATE);

        validate(facility);

        repository.updateFacility(facilityId, facility, oldFacility);
        return getFacility(facilityId);
    }

    private void validate(Facility facility) {
        Collection<Violation> violations = new ArrayList<>();
        validationService.validate(facility, violations);
        CapacityPricingValidator.validateAndNormalize(facility, violations);
        validateContact(facility.operatorId, facility.contacts.emergency, "emergency", violations);
        validateContact(facility.operatorId, facility.contacts.operator, "operator", violations);
        validateContact(facility.operatorId, facility.contacts.service, "service", violations);
        if (!violations.isEmpty()) {
            throw new ValidationException(violations);
        }
    }

    private void validateContact(Long facilityOperatorId, Long contactId, String contactType, Collection<Violation> violations) {
        if (contactId != null) {
            Contact contact = contactRepository.getContact(contactId);
            if (contact == null) {
                violations.add(new Violation("NotFound", "contacts." + contactType, "contact not found"));
            }
            else if (contact.operatorId != null && !contact.operatorId.equals(facilityOperatorId)) {
                violations.add(new Violation("OperatorMismatch", "contacts." + contactType, "operator should match facility operator"));
            }
        }
    }

    @TransactionalRead
    public Facility getFacility(long id) {
        return repository.getFacility(id);
    }

    @TransactionalRead
    public SearchResults<FacilityInfo> search(PageableFacilitySearch search) {
        return repository.findFacilities(search);
    }

    @TransactionalRead
    public FacilitySummary summarize(FacilitySearch search) {
        return repository.summarizeFacilities(search);
    }

    @TransactionalWrite
    public void registerUtilization(long facilityId, List<Utilization> utilization, User currentUser) {
        authorize(currentUser, repository.getFacilityInfo(facilityId), FACILITY_UTILIZATION_UPDATE);

        utilization.forEach((status) -> validationService.validate(status));
        repository.insertUtilization(facilityId, utilization);
    }

    @TransactionalRead
    public List<Utilization> getStatuses(long facilityId) {
        return repository.getStatuses(facilityId);
    }
}
