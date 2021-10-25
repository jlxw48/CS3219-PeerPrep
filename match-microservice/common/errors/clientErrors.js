const MISSING_REQUEST_BODY = "missing some required fields in request body";
const MAX_INTERVIEW_REACHED = "total interviews has been reached";
const INVALID_DIFFICULTY = "difficulty should only be one of easy, medium or hard";
const TIMEOUT_30_SECONDS = "failed to find a match after 30s";
const RETRIEVE_QUESTION_FAILED = "failed to retrieve question for interview";
const NO_QUESTION = "no question allocated for interview";
const NO_PARTNER = "failed to retrieve partner details";
const INCONSISTENT_PARTNERS = "Inconsistent partners detected"
const NO_INTERVIEW = "failed to retrieve interview details";
const DELETE_INTERVIEW_FAILED = "failed to end interview for user";

module.exports = {
    MISSING_REQUEST_BODY,
    MAX_INTERVIEW_REACHED,
    INVALID_DIFFICULTY,
    TIMEOUT_30_SECONDS,
    RETRIEVE_QUESTION_FAILED,
    NO_QUESTION,
    NO_PARTNER,
    INCONSISTENT_PARTNERS,
    NO_INTERVIEW,
    DELETE_INTERVIEW_FAILED
};