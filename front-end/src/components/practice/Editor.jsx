import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/ext-language_tools"
import io from 'socket.io-client';
import { BACKEND_DOMAIN, EDITOR_HISTORY_URL, EDITOR_SOCKET_PATH } from "../../Api.js";
import { useState, useContext, useEffect } from "react";
import ace from "react-ace";
import axios from "axios";
import { AppContext } from "../../App.js";

function Editor() {
    let { user, userRef, match, matchRef } = useContext(AppContext);
    const interviewId = matchRef.current.interviewId;
    const editorSocket = io(BACKEND_DOMAIN, {
        path: EDITOR_SOCKET_PATH,
    });

    // Current content of the code editor
    const [code, setCode] = useState();

    useEffect(() => {
        console.log("Edior useEffect")
        editorSocket.on("connect", () => {
            console.log("Successfully connected to editor socket");

            // Fetch text history
            axios.get(EDITOR_HISTORY_URL, {
                params: { interviewId }
            })
                .then(res => res.data)
                .then(data => {
                    if (data.status === "success") {
                        const textHistory = data.data.message;
                        console.log(textHistory);
                        setCode(textHistory);
                    } else if (data.status == "failed") {
                        setCode("");
                    }
                })
                .catch(err => console.log(err));

            editorSocket.emit('subscribe', {
                interviewId
            });
        });

        editorSocket.on('message', data => {
            console.log(`Receiving: ${data}`);
            setCode(data);
        });

        return () => editorSocket.disconnect();
    }, []);

    const handleCodeChange = (event) => {
        editorSocket.emit('newMessage', {
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
            onChange={(e) => handleCodeChange(e)}/>
    )
}

export default Editor;