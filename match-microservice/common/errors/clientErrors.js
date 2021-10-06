const MISSING_REQUEST_BODY = "missing some required fields in request body";
const MAX_INTERVIEW_REACHED = "total interviews has been reached";
const INVALID_DIFFICULTY = "difficulty should only be one of easy, medium or hard";
const TIMEOUT_30_SECONDS = "failed to find a match after 30s";
const NO_PARTNER = "failed to retrieve partner details";
const INCONSISTENT_PARTNERS = "Inconsistent partners detected"
const INVALID_INTERVIEW_ID = "interview id does not exist";
const MISSING_SECOND_USER_FOR_INTERVIEW_ID = "interviewId does not exist for second user";

module.exports = {
    MISSING_REQUEST_BODY,
    MAX_INTERVIEW_REACHED,
    INVALID_DIFFICULTY,
    TIMEOUT_30_SECONDS,
    NO_PARTNER,
    INCONSISTENT_PARTNERS,
    INVALID_INTERVIEW_ID,
    MISSING_SECOND_USER_FOR_INTERVIEW_ID
};