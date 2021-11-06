import { useContext, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import Col from 'react-bootstrap/Col'
import { Row } from "react-bootstrap";
import { Widget, addResponseMessage, addUserMessage, renderCustomComponent, dropMessages } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { AppContext } from "../../App.js"
import { CHAT_HISTORY_URL, BACKEND_DOMAIN, CHAT_SOCKET_PATH, CHAT_BACKEND_DOMAIN } from "../../constants";
import "../../css/Chat.css"
import { useHistory } from "react-router-dom";
import useState from 'react-usestateref';

function Chat() {
    let { user, matchRef } = useContext(AppContext);
    const history = useHistory();
    console.log("Rendered chat");

    var interviewId = null;
    var chatSocket = useRef();
    const [chats, setChats, chatsRef] = useState([]);

    const PARTNER_CONNECTED_NOTIFICATION = "Your partner has connected to the chat."
    const PARTNER_DISCONNECT_NOTIFICATION = "Your partner has disconnected from the interview."
    const NOTIFICATION_TYPE_CONNECTION = 0;
    const NOTIFICATION_TYPE_END = 1;


    const PartnerDisconnectedMessage = (props) => (
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

        // Clears messages from a previous session, if any
        dropMessages();

        interviewId = matchRef.current.interviewId;

        chatSocket.current = io.connect(CHAT_BACKEND_DOMAIN, {
            transports: ["websocket"],
            path: CHAT_SOCKET_PATH,
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 500
        });

        chatSocket.current.emit("joinRoom", interviewId);

        chatSocket.current.on("connect", () => {
            console.log("Successfully connected to chat socket.");

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
                    renderCustomComponent(PartnerDisconnectedMessage, {message: endInterviewMessage.message});
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
                    message: "Your partner has disconnected from the interview."
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