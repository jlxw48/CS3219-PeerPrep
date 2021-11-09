const MISSING_REQUEST_BODY = "Missing some required fields in request body";
const MAX_INTERVIEW_REACHED = "The total number of interviews supported by the application has been reached, please try again later";
const INVALID_DIFFICULTY = "Difficulty should only be one of easy, medium or hard";
const DUPLICATE_FIND = "Duplicate request to find match";
const CANCELLED_FIND_MATCH = "You have cancelled finding a match in another browser.";
const TIMEOUT_30_SECONDS = "Failed to find a match after 30s, please try again later.";
const RETRIEVE_QUESTION_FAILED = "Failed to retrieve question for interview";
const NO_QUESTION = "No question allocated for interview";
const NO_PARTNER = "Failed to retrieve partner details";
const INCONSISTENT_PARTNERS = "Inconsistent partners detected";
const NO_INTERVIEW = "Failed to retrieve interview details";
const DELETE_INTERVIEW_FAILED = "Failed to end interview for user";
const INVALID_API_ENDPOINT = "Invalid API endpoint";
const JWT_AUTH_FAILED = "You are not authorised!";

module.exports = {
    MISSING_REQUEST_BODY,
    MAX_INTERVIEW_REACHED,
    INVALID_DIFFICULTY,
    DUPLICATE_FIND,
    CANCELLED_FIND_MATCH,
    TIMEOUT_30_SECONDS,
    RETRIEVE_QUESTION_FAILED,
    NO_QUESTION,
    NO_PARTNER,
    INCONSISTENT_PARTNERS,
    NO_INTERVIEW,
    DELETE_INTERVIEW_FAILED,
    INVALID_API_ENDPOINT,
    JWT_AUTH_FAILED
};