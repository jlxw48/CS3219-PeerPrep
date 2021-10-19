const REACT_APP_BACKEND_URL = 'http://localhost:3002/';

const QUESTION_URL = REACT_APP_BACKEND_URL + "questions";
const USERS_URL = REACT_APP_BACKEND_URL + "users/"
const LOGIN_URL = USERS_URL + "login";
const REGISTER_URL = USERS_URL + "register";
const LOGOUT_URL = REACT_APP_BACKEND_URL + "logout"

const MATCH_URL = REACT_APP_BACKEND_URL + "match/"
const FIND_MATCH_URL = MATCH_URL + "start_find";
const END_MATCH_URL = MATCH_URL + "end_interview";
const MATCH_QUESTION_URL = REACT_APP_BACKEND_URL + "fetch_match_question";
const TEXT_EDITOR_URL = REACT_APP_BACKEND_URL + "te_socket";
const MESSENGER_URL = REACT_APP_BACKEND_URL + "im_socket";

export { REACT_APP_BACKEND_URL, QUESTION_URL,
    LOGIN_URL, REGISTER_URL, LOGOUT_URL, FIND_MATCH_URL, END_MATCH_URL,
    MATCH_QUESTION_URL, TEXT_EDITOR_URL, MESSENGER_URL }