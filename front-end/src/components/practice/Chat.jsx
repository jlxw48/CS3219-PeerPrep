import { useContext, useEffect, useRef } from "react";
import axios from "axios";
// import { io } from "socket.io-client";
import Col from 'react-bootstrap/Col'
import { Row } from "react-bootstrap";
import { Widget, addResponseMessage, addUserMessage, renderCustomComponent, dropMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { AppContext } from "../../App.js"
import { CHAT_HISTORY_URL, BACKEND_DOMAIN, CHAT_SOCKET_PATH, CHAT_BACKEND_DOMAIN } from "../../constants";
import "../../css/Chat.css"
import { useHistory } from "react-router-dom";
import useState from 'react-usestateref';
const io = window.io;

function Chat() {
    let { user, matchRef } = useContext(AppContext);
    const history = useHistory();
    console.log("Rendered chat");

    var chatSocket = useRef();
    const [chats, setChats, chatsRef] = useState([]);
    const PARTNER_DISCONNECT_NOTIFICATION = "Your partner has disconnected from the interview."

    const ChatWidgetNotificationMessage = (props) => (
        <div className="rcw-message">
            <div className="rcw-response">
                <div className="rcw-messages-text">
                    <p><i>{props.message}</i></p>
                </div>
            </div>
        </div>)

    useEffect(() => {
        if (matchRef.current === null) {
            history.push({ pathname: '/' });
        }

        console.log("ho")

        // Clears messages from a previous session, if any
        dropMessages();

        const interviewId = matchRef.current.interviewId;

        // Fetch and populate chat history.
        axios.get(CHAT_HISTORY_URL + interviewId).then(res => res.data.data).then(data => {
            const chatHistory = data.history;
            setChats(chatHistory);

            // Push chat history from chats variable into chat widget
            for (let chat of chatsRef.current) {
                if (chat.senderEmail === user.email) {
                    addUserMessage(chat.message);
                } else {
                    addResponseMessage(chat.message);
                }
            }
        }).catch(err => console.log("Error fetching chat history", err));

        chatSocket.current = io.connect(CHAT_BACKEND_DOMAIN, {
            transports: ["websocket"],
            path: CHAT_SOCKET_PATH,
            upgrade: false,
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 500
        });

        chatSocket.current.on("connect", () => {
            chatSocket.current.emit("joinRoom", interviewId);
            console.log("Successfully connected to chat socket.");

            // In case multiple connection turn off existing events.
            chatSocket.current.off("message");
            chatSocket.current.off("notification");

            // Set event upon receiving new message to add to chats variable and to chat widget.
            chatSocket.current.on("message", newMessage => {
                console.log("Received msg from chat socket", newMessage);
                setChats(oldMessages => [...oldMessages, newMessage]);
                if (newMessage.senderEmail !== user.email) {
                    addResponseMessage(newMessage.message);
                }
            });

            // Display notification in chat widget
            chatSocket.current.on("notification", endInterviewMessage => {
                if (endInterviewMessage.senderEmail !== user.email) {
                    renderCustomComponent(ChatWidgetNotificationMessage, { message: endInterviewMessage.message });
                }
            })

        });



        // Upon timeout, close socket to conserve resources
        const SECONDS_TO_MICROSECONDS_MULTIPLIER = 1000;
        setTimeout(() => {
            chatSocket.current.disconnect();
            chatSocket.current.close();
        }, matchRef.current.durationLeft * SECONDS_TO_MICROSECONDS_MULTIPLIER);

        // Clean up
        return () => {
            console.log("Closing chat socket");
            // Broadcast to interview partner that the user is disconnecting.
            chatSocket.current.emit("end_interview", {
                interviewId,
                contents: {
                    senderEmail: user.email,
                    message: PARTNER_DISCONNECT_NOTIFICATION
                }
            })
            // Delete all messages from chat widget
            dropMessages();
            setChats([]);
            // Clean up socket
            chatSocket.current.disconnect();
            chatSocket.current.close();
        }
    }, [matchRef]);


    /**
     * Upon user entering new message into chat widget, send to socket.
     */
    const handleNewUserMessage = (msgString) => {
        console.log(`New message incoming! ${msgString}`);

        const newChat = { senderEmail: user.email, message: msgString }
        chatSocket.current.emit("message", {
            interviewId: matchRef.current.interviewId,
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