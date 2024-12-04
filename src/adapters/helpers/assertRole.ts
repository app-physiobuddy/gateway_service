import ErrorTypes from "../../utils/errors/ErrorTypes.js";
function assertRole(role: string) {
    if (!role) throw ErrorTypes.ValidationError("No role was provided")
    const isTherapistOrTherapistAdmin = () => {
        if (role !== 'therapist' && role !== 'therapistAdmin') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only therapist');
        }
    };
    const isTherapist = () => {
        if (role !== 'therapist') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only therapist');
        }
    };


    const isTherapistAdmin = () => {
        if (role !== 'therapistAdmin') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only Company or TherapistAdmin');
        }
    };

    const isTherapistOrCompany = () => {
        if (role !== 'therapist' && role !== 'company' && role !== 'therapistAdmin') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only therapist');
        }
    };


    const isTherapistAdminOrCompany = () => {
        if (role !== 'company' && role !== 'therapistAdmin') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only therapistAdmin or Company');
        }
    };

    const isCompany = () => {
        if (role !== 'company') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only Company');
        }
    };

    const isPatient = () => {
        if (role !== 'patient') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only Patient');
        }
    };
    const isPatientOrTherapist = () => {
        if (role !== 'patient' && role !== 'therapist') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only Patient or Therapist');
        }
    };

    const isAdmin = () => {
        if (role !== 'admin') {
            throw ErrorTypes.UnauthorizedAccess('Acess denied, only Admin');
        }
    };


    return {
        isTherapist,
        isTherapistAdmin,
        isCompany,
        isAdmin,
        isPatientOrTherapist,
        isPatient,
        isTherapistOrTherapistAdmin,
        isTherapistOrCompany,
        isTherapistAdminOrCompany
    };
}

export default assertRole