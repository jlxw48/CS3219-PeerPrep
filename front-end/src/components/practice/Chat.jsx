import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Col from 'react-bootstrap/Col'
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { AppContext } from "../../App.js"
import { CHAT_HISTORY_URL, BACKEND_DOMAIN, CHAT_SOCKET_PATH } from "../../Api.js";
import "../../css/Chat.css"

function Chat() {
    let { user, matchRef } = useContext(AppContext);

    const interviewId = matchRef.current.interviewId;
    var chatSocket = useRef();
    const [chats, setChats] = useState([]);

    useEffect(() => {

        chatSocket.current = io.connect(BACKEND_DOMAIN, {
            path: CHAT_SOCKET_PATH
        });

        /**
         * Fetch chat history from backend into chats variable.
         */
        chatSocket.current.on("connect", () => {
            // Successfully connected/reconnected

            axios.get(CHAT_HISTORY_URL + interviewId).then(res => {
                if (res.data.status === "success" && res.data.data) {
                    const chatHistory = res.data.data.history;
                    setChats(chatHistory);
                }

                /**
                 * Push chat history from chats variable into chat widget
                 */
                for (let chat in chats) {
                    if (chat.senderEmail === user.email) {
                        addUserMessage(chat.message);
                    } else {
                        addResponseMessage(chat.message);
                    }
                }
            }).catch(err => console.log("Error fetching chat history", err));

            /**
             * Set event upon receiving new message to add to chats variable and to chat widget.
             */
            chatSocket.current.on(interviewId, newMessage => {
                setChats(oldMessages => [...oldMessages, newMessage]);
                if (newMessage.senderEmail !== user.email) {
                    addResponseMessage(newMessage.message);
                }
            });

        });

        const SECONDS_TO_MICROSECONDS_MULTIPLIER = 1000;
        // Upon timeout, close socket to conserve resources
        setTimeout(() => {
            chatSocket.current.disconnect();
            chatSocket.current.close();
        }, matchRef.current.durationLeft * SECONDS_TO_MICROSECONDS_MULTIPLIER);

        // When tearing down Chat component, close the socket.
        return () => {
            console.log("Closing chat socket");
            setChats([]);
            chatSocket.current.disconnect();
            chatSocket.current.close();
        }
    }, []);


    /**
     * Upon user entering new message into chat widget, send to socket.
     */
    const handleNewUserMessage = (msgString) => {
        console.log(`New message incoming! ${msgString}`);

        const newChat = { senderEmail: user.email, message: msgString }
        chatSocket.current.emit("message", {
            interviewId: interviewId,
            contents: newChat
        });
    };

    return (
        <Col md={3} className="chat-col">
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Chat"
                subtitle=""
                showTimeStamp={false}
            />
        </Col>
    )
}

export default Chat;