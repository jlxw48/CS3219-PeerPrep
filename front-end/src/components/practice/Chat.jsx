import authHeader from "../../auth-header";
import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../App.js"

import { MATCH_QUESTION_URL, CONNECT_MESSENGER_URL, CHAT_HISTORY_URL } from "../../Api.js";
import ChatEntry from "./ChatEntry";
import { io } from "socket.io-client";
import Col from 'react-bootstrap/Col'
import { Widget, addResponseMessage, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import "../../css/Chat.css"

function Chat() {
    let { user, userRef, match, matchRef } = useContext(AppContext);

    const interviewId = matchRef.current.interviewId;
    const partnerName = matchRef.current.partnerUsername;
    const chatSocket = io.connect("localhost:3003", {
        'path': '/chat/create'
    });
    const [chats, setChats] = useState([]);

    useEffect(() => {
        /**
         * Fetch chat history from backend into chats variable.
         */
        chatSocket.on("connection", () => {
            // Successfully connected/reconnected
            console.log("Chat socket connected.");

            axios.get(CHAT_HISTORY_URL, {
                interviewId: interviewId
            }).then(res => {
                if (res.data.data) {
                    const chatHistory = res.data.data.history;
                    setChats(chatHistory);
                }
            }).catch(err => console.log(err))

        });

        addResponseMessage("bro");


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

        /**
         * Set event upon receiving new message to add to chats variable and to chat widget.
         */
        chatSocket.on(interviewId, newMessage => {
            setChats(oldMessages => [...oldMessages, newMessage]);
            if (newMessage.senderEmail === user.email) {
                addUserMessage(newMessage.message)
            } else {
                addResponseMessage(newMessage.message);
            }
        });

       
        return () => chatSocket.disconnect();

    }, []);


    /**
     * Upon user entering new message, send to socket.
     */
    const handleNewUserMessage = (msgString) => {
        console.log(`New message incoming! ${msgString}`);

        const newChat = { senderEmail: user.email, message: msgString }
        alert(msgString);
        // setChats(oldMessages => [...oldMessages, newChat]);
        chatSocket.emit("message", {
            interviewId: interviewId,
            contents: newChat
        });

    };

    return (
        <Col md={3} className="chat-col">
            {/* <div className="chat-entry-container">
                <br /> */}
            {/* {seeds.chats.map(chat => {
                    return <><ChatEntry {...chat} /><br /></>
                })} */}
            {/* </div>
            <div className="chat-input-container">
                <input type="textarea" className="chat-input" placeholder="Enter a message..." />
            </div> */}
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Chat with your practice partner"
                subtitle=""
                showTimeStamp={false}
            />
        </Col>
    )


}

export default Chat;