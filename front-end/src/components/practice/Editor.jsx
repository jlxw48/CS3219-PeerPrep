import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools"
import io from 'socket.io-client';
import { BACKEND_DOMAIN, EDITOR_HISTORY_URL, EDITOR_SOCKET_PATH } from "../../Api.js";
import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { AppContext } from "../../App.js";

function Editor() {
    let { matchRef } = useContext(AppContext);
    const interviewId = matchRef.current.interviewId;
    var editorSocket = useRef()

    // Current content of the code editor
    const [code, setCode] = useState();

    useEffect(() => {
        editorSocket.current = io(BACKEND_DOMAIN, {
            path: EDITOR_SOCKET_PATH,
        });

        editorSocket.current.on("connect", () => {
            console.log("Successfully connected to editor socket");

            // Fetch text history
            axios.get(EDITOR_HISTORY_URL, {
                params: { interviewId }
            })
            .then(res => res.data.data)
            .then(data => {
                const textHistory = data.message;
                setCode(textHistory);
            })
            .catch(err => setCode(""));

            editorSocket.current.emit('subscribe', {
                interviewId
            });
        });

        // Upon receiving message from editorSocket.current, replace the "code" state variable with the incoming message.
        editorSocket.current.on('message', data => {
            console.log(`Receiving: ${data}`);
            setCode(data);
        });

        const SECONDS_TO_MICROSECONDS_MULTIPLIER = 1000;
        // Upon timeout, close socket to conserve resources
        setTimeout(() => {
            editorSocket.current.disconnect();
            editorSocket.current.close();
        }, matchRef.current.durationLeft * SECONDS_TO_MICROSECONDS_MULTIPLIER);

        return () => {
            editorSocket.current.disconnect();
            setCode("");
        }
    }, []);

    // When user changes something in the code editor, send the entire text in the code editor over the editor socket.
    const handleCodeChange = (event) => {
        editorSocket.current.emit('newMessage', {
            interviewId,
            text: event
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