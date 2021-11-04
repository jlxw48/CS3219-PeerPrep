import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools"
import io from 'socket.io-client';
import { BACKEND_DOMAIN, EDITOR_HISTORY_URL, EDITOR_SOCKET_PATH, EDITOR_BACKEND_DOMAIN } from "../../Api.js";
import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../App.js";
import { useAppStateHelper } from "../../common/state_handlers/AppState.js";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function Editor() {
    let { matchRef, userRef } = useContext(AppContext);
    let { endMatch } = useAppStateHelper();
    const history = useHistory();

    if (matchRef.current === null) {
        history.push({ pathname: '/' });
    }

    var interviewId = matchRef.current.interviewId;
    var editorSocket = useRef();

    // Current content of the code editor
    const [code, setCode] = useState();

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

    useEffect(() => {
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

        editorSocket.current.on("connect", () => {
            console.log("Successfully connected to editor socket");

            // Fetch text history
            axios.get(EDITOR_HISTORY_URL, {
                params: { interviewId }
            })
            .then(res => res.data.data)
            .then(data => {
                const message =  JSON.parse(data.message);
                const textHistory = message.text;
                setCode(textHistory);
            })
            .catch(err => setCode(""));

            editorSocket.current.emit('subscribe', {
                interviewId
            });
        });

        // // Upon receiving message from editorSocket.current, replace the "code" state variable with the incoming message.
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
        editorSocket.current.emit('newMessage', {
            interviewId,
            text: event,
            senderEmail: userRef.current.email
        });
    }

    return (
        <AceEditor
            placeholder=""
            mode="python"
            theme="github"
            name="editor"
            fontSize={14}
            showPrintMargin={false}
            showGutter={true}
            height="100%"
            highlightActiveLine={false}
            value={code}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 4,
            }}
            onChange={(e) => handleCodeChange(e)} />
    )
}

export default Editor;