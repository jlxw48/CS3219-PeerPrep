const REACT_APP_BACKEND_URL = 'http://localhost:3002/';

const QUESTION_URL = REACT_APP_BACKEND_URL + "questions";
const USERS_URL = REACT_APP_BACKEND_URL + "users/"
const LOGIN_URL = USERS_URL + "login";
const REGISTER_URL = USERS_URL + "register";
const LOGOUT_URL = REACT_APP_BACKEND_URL + "logout"

const MATCH_URL = REACT_APP_BACKEND_URL + "match/"
const FIND_MATCH_URL = MATCH_URL + "start_find";
const END_MATCH_URL = MATCH_URL + "end_interview";
const MATCH_QUESTION_URL = MATCH_URL + "fetch_match_question";
const TEXT_EDITOR_URL = REACT_APP_BACKEND_URL + "te_socket";

const CHAT_URL = REACT_APP_BACKEND_URL + "chat/"
// const CONNECT_MESSENGER_URL = CHAT_URL + "create/";
const CONNECT_MESSENGER_URL = "http://localhost:3003/chat/create"
const CHAT_HISTORY_URL = CHAT_URL + "get_messages/"

export { REACT_APP_BACKEND_URL, QUESTION_URL,
    LOGIN_URL, REGISTER_URL, LOGOUT_URL, FIND_MATCH_URL, END_MATCH_URL,
    MATCH_QUESTION_URL, TEXT_EDITOR_URL, CONNECT_MESSENGER_URL, CHAT_HISTORY_URL }