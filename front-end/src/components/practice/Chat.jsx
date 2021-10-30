import authHeader from "../../auth-header";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../App.js"

import { CONNECT_MESSENGER_URL, CHAT_HISTORY_URL, CHAT_URL, REACT_APP_BACKEND_URL } from "../../Api.js";
import ChatEntry from "./ChatEntry";
import { io } from "socket.io-client";
import Col from 'react-bootstrap/Col'
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import "../../css/Chat.css"

function Chat() {
    let { user, userRef, match, matchRef } = useContext(AppContext);

    const interviewId = matchRef.current.interviewId;
    const chatSocket = io.connect("http://localhost:8010", {
        path: "/proxy/api/chat/create"
    });
    console.log("hi");
    const [chats, setChats] = useState([]);

    useEffect(() => {
        /**
         * Fetch chat history from backend into chats variable.
         */
        chatSocket.on("connect", () => {
            // Successfully connected/reconnected

            axios.get(CHAT_HISTORY_URL + interviewId).then(res => {
                if (res.data.status === "success" && res.data.data) {
                    const chatHistory = res.data.data.history;
                    setChats(chatHistory);
                }

                /**
                 * Push chat history from chat variables into chat widget
                 */
                for (let chat in chats) {
                    if (chat.senderEmail === user.email) {
                        addUserMessage(chat.message);
                    } else {
                        addResponseMessage(chat.message);
                    }
                }
            }).catch(err => console.log(err));

            /**
             * Set event upon receiving new message to add to chats variable and to chat widget.
             */
            console.log("hi", interviewId);
            chatSocket.on(interviewId, newMessage => {
                console.log("received", newMessage);
                setChats(oldMessages => [...oldMessages, newMessage]);
                if (newMessage.senderEmail !== user.email) {
                    addResponseMessage(newMessage.message);
                }
            });

        });

        // When tearing down Chat component, close the socket.
        return () => {
            console.log("closing chat socket");
            chatSocket.disconnect();
            chatSocket.close();
        }
    }, []);


    /**
     * Upon user entering new message, send to socket.
     */
    const handleNewUserMessage = (msgString) => {
        console.log(`New message incoming! ${msgString}`);

        const newChat = { senderEmail: user.email, message: msgString }
        chatSocket.emit("message", {
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