const REACT_APP_BACKEND_URL = 'http://localhost/api/';

const QUESTION_URL = REACT_APP_BACKEND_URL + "questions/";

const USERS_URL = REACT_APP_BACKEND_URL + "user/"
const LOGIN_URL = USERS_URL + "user_login";
const REGISTER_URL = USERS_URL + "create_account";
const LOGOUT_URL = USERS_URL + "user_logout"
const VALIDATE_LOGIN_URL = USERS_URL + "jwt_validate";

const MATCH_URL = REACT_APP_BACKEND_URL + "match/"
const FIND_MATCH_URL = MATCH_URL + "start_find";
const END_MATCH_URL = MATCH_URL + "end_interview";
const MATCH_GET_INTERVIEW_URL = MATCH_URL + "get_interview"
const TEXT_EDITOR_URL = REACT_APP_BACKEND_URL + "te_socket";

const CHAT_URL = REACT_APP_BACKEND_URL + "chat/"
const CONNECT_MESSENGER_URL = "/chat/create/";
const CHAT_HISTORY_URL = CHAT_URL + "get_messages/"

export { REACT_APP_BACKEND_URL, QUESTION_URL,
    LOGIN_URL, REGISTER_URL, LOGOUT_URL, VALIDATE_LOGIN_URL, FIND_MATCH_URL, END_MATCH_URL,
    MATCH_GET_INTERVIEW_URL, TEXT_EDITOR_URL, CONNECT_MESSENGER_URL, CHAT_URL, CHAT_HISTORY_URL }