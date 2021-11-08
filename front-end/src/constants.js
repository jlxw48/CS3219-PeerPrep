// const REACT_APP_BACKEND_URL = 'http://localhost:8010/proxy/api/';
// const BACKEND_DOMAIN = "http://localhost:8010"

const REACT_APP_BACKEND_URL = 'http://localhost/api/';
// const BACKEND_DOMAIN = "http://localhost"
const BACKEND_DOMAIN = "https://peerprep-g5.tk/";

// const QUESTION_URL = REACT_APP_BACKEND_URL + "questions/";
const QUESTION_URL = "https://peerprep-g5.tk/api/questions";

// const USERS_URL = "https://peerprep.ml/api/user/"
const USERS_URL = REACT_APP_BACKEND_URL + "user/"
const LOGIN_URL = USERS_URL + "user_login";
const REGISTER_URL = USERS_URL + "create_account";
const LOGOUT_URL = USERS_URL + "user_logout"
const VALIDATE_LOGIN_URL = USERS_URL + "jwt_validate";
const VALIDATE_ADMIN_URL = USERS_URL + "validate_admin";

const MATCH_URL = "https://peerprep-g5.tk/api/match/";
// const MATCH_URL = REACT_APP_BACKEND_URL + "match/"
const FIND_MATCH_URL = MATCH_URL + "start_find";
const STOP_FIND_MATCH_URL = MATCH_URL + "stop_find";
const END_MATCH_URL = MATCH_URL + "end_interview";
const MATCH_GET_INTERVIEW_URL = MATCH_URL + "get_interview"

const CHAT_URL = "https://peerprep-g5.tk/api/chat/";
const CHAT_BACKEND_DOMAIN = "https://peerprep-g5.tk";
// const CHAT_URL = REACT_APP_BACKEND_URL + "chat/"
const CONNECT_MESSENGER_URL = "/chat/create/";
const CHAT_HISTORY_URL = CHAT_URL + "get_messages/"
const CHAT_SOCKET_PATH = "/api/chat/create"
// const CHAT_SOCKET_PATH = "/proxy/api/chat/create"

const EDITOR_URL = "https://peerprep-g5.tk/api/editor/";
const EDITOR_BACKEND_DOMAIN = "https://peerprep-g5.tk";
// const EDITOR_URL = REACT_APP_BACKEND_URL + "editor/";
const EDITOR_HISTORY_URL = EDITOR_URL + "get_text";
const EDITOR_SOCKET_PATH = "/api/editor/create"
// const EDITOR_SOCKET_PATH = "/proxy/api/editor/create"

const JWT_TOKEN_NAME = "cs3219-jwt-auth";

export { BACKEND_DOMAIN, REACT_APP_BACKEND_URL, QUESTION_URL,
    LOGIN_URL, REGISTER_URL, LOGOUT_URL, VALIDATE_LOGIN_URL, VALIDATE_ADMIN_URL,
    FIND_MATCH_URL, STOP_FIND_MATCH_URL, END_MATCH_URL, MATCH_GET_INTERVIEW_URL,
    CONNECT_MESSENGER_URL, CHAT_URL, CHAT_HISTORY_URL, CHAT_SOCKET_PATH,
    EDITOR_URL, EDITOR_HISTORY_URL,EDITOR_SOCKET_PATH, JWT_TOKEN_NAME 
}