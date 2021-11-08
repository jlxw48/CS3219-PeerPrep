import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/mode-python";
import "ace-builds/src-min-noconflict/mode-java";
import "ace-builds/src-min-noconflict/mode-c_cpp";
import "ace-builds/src-min-noconflict/ext-language_tools"
import { BACKEND_DOMAIN, EDITOR_HISTORY_URL, EDITOR_SOCKET_PATH, EDITOR_BACKEND_DOMAIN } from "../../constants.js";
import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../App.js";
import { useAppStateHelper } from "../../common/state_handlers/AppState.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import useState from "react-usestateref";
import { Col } from "react-bootstrap";
const io = window.io;

function Editor() {
    let { matchRef, userRef } = useContext(AppContext);
    let { endMatch } = useAppStateHelper();
    const history = useHistory();
    var editorSocket = useRef();

    // Current content of the code editor
    const [code, setCode, codeRef] = useState("");
    // Selected programming language of code editor
    const [lang, setLang] = useState("python");
    const langChoices =  ["python", "java", "c_cpp"];
    // Need to cache current code as Ace Editor re-renders when lang is changed.
    const changeLang = (newLang) => {
        const currCode = codeRef.current;
        setLang(newLang);
        setCode(currCode);
        console.log("Curr code",codeRef.current);
    }

    var inactivityTimer = useRef(null);

    const MINUTES_TO_MICROSECONDS_MULTIPLIER = 60000;
    function resetInactivityTimer() {
        if (inactivityTimer.current !== null) {
            clearTimeout(inactivityTimer.current);
        }
        inactivityTimer.current = setTimeout(() => {
            toast.info("You have been away for more than 10 minutes, ending your interview now.");
            endMatch();
            history.push({ pathname: '/' });
        }, MINUTES_TO_MICROSECONDS_MULTIPLIER * 10)
    }

    const capitalizeFirstChar = (str) => str.charAt(0).toUpperCase() + str.substring(1)

    // Fetch text history
    const fetchTextHistory = () => axios.get(EDITOR_HISTORY_URL, {
        params: { interviewId: matchRef.current.interviewId }
    })
    .then(res => res.data.data)
    .then(data => {
        const message =  JSON.parse(data.message);
        const textHistory = message.text;
        setCode(textHistory);
    })
    .catch(err => setCode(""));

    useEffect(() => {
        if (matchRef.current === null) {
            history.push({ pathname: '/' });
            return;
        }
    
        var interviewId = matchRef.current.interviewId;

        /**
         * Connect socket and add socket events.
         */
        editorSocket.current = io(EDITOR_BACKEND_DOMAIN, {
            transports: ["websocket"],
            path: EDITOR_SOCKET_PATH,
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 500
        });

        fetchTextHistory();

        editorSocket.current.on("connect", () => {
            console.log("Successfully connected to editor socket");

            editorSocket.current.emit('subscribe', {
                interviewId
            });
        });

        // Upon receiving message from editorSocket.current, replace the "code" state variable with the incoming message.
        editorSocket.current.on('message', data => {
            data = JSON.parse(data);
            if (data.senderEmail !== userRef.current.email) {
                setCode(data.text)
            }
        });

        /**
         * Each interview session lasts only 1 hour, after 1 hour close editor socket to conserve resources.
         */
        const SECONDS_TO_MICROSECONDS_MULTIPLIER = 1000;
        setTimeout(() => {
            editorSocket.current.disconnect();
            editorSocket.current.close();
        }, matchRef.current.durationLeft * SECONDS_TO_MICROSECONDS_MULTIPLIER);

        /**
         * Inactivity timer of 10 minutes.
         */
        resetInactivityTimer();


        /**
         * Close socket when tearing down Editor component
         */
        return () => {
            editorSocket.current.disconnect();
            editorSocket.current.close();
            if (inactivityTimer.current !== null) {
                clearTimeout(inactivityTimer.current);
            }
            setCode("");
        }
    }, [matchRef]);

    // When user changes something in the code editor, send the entire text in the code editor over the editor socket and reset inactivity timer.
    const handleCodeChange = (event) => {
        resetInactivityTimer();
        setCode(event);
        editorSocket.current.emit('newMessage', {
            interviewId: matchRef.current.interviewId,
            text: event,
            senderEmail: userRef.current.email
        });
    }

    return (<>
    <Col md={2}>
    <select className="form-select editor-lang-selector" onChange={e => changeLang(e.target.value)}>
            {
                langChoices.map(choice => {
                    return <option key={choice} value={choice}>{choice === "c_cpp" ? "C++" : capitalizeFirstChar(choice)}</option>
                })
            }
        </select>
    </Col>

        <AceEditor
            placeholder=""
            mode={lang}
            theme="github"
            name="editor"
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            height="100%"
            highlightActiveLine={false}
            value={codeRef.current}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 4,
            }}
            onChange={(e) => handleCodeChange(e)} />
    </>)
}

export default Editor;