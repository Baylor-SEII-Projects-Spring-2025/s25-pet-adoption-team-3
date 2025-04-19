import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styles from "@/styles/ChatComponent.module.css";
import PropTypes from "prop-types";

export default function ChatComponent({ recipientId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null); // <- this will be sender
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const WS_URL = `${API_URL}/ws-chat`;

    const [previousChats, setPreviousChats] = useState([]);


    // Generate avatar background gradient based on name
    const generateGradient = (name) => {
        if (!name) return "#f50057";

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 3) % 360}, 70%, 60%)`;

        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    // Get initials from name
    const getInitials = (name) => {
        if (!name) return "";

        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chat/conversations`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.ok) {
                    const data = await res.json();
                    console.log("Conversations:", data);
                    setPreviousChats(data);
                }
            } catch (err) {
                console.error("Failed to fetch conversations:", err);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/session`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (res.status === 401) {
                    Router.push("/login");
                    return;
                }

                const data = await res.json();
                setUser(data.user);
                console.log("User session:", data.user);
            } catch (err) {
                console.error("Failed to fetch user session:", err);
            }
        };

        fetchUserSession();
    }, []);

    useEffect(() => {
        if (!user || !recipientId) return;

        const fetchChatHistory = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/chat/history/${recipientId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                if (!res.ok) {
                    console.error("Failed to fetch chat history");
                    return;
                }

                const history = await res.json();
                console.log("Chat history:", history);

                setMessages(history);
            } catch (err) {
                console.error("Error fetching chat history:", err);
            }
        };

        fetchChatHistory();
    }, [user?.id, recipientId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!user) return;

        const socket = new SockJS(WS_URL);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log("[STOMP DEBUG]:", str), // optional detailed logs
            reconnectDelay: 5000, // auto-reconnect
            onConnect: () => {
                setIsConnected(true);
                stompClient.subscribe("/topic/messages", (msg) => {
                    const incoming = JSON.parse(msg.body);
                    console.log("Incoming message:", incoming);

                    console.log("User ID:", user.id);
                    console.log("Recipient ID:", recipientId);
                    console.log("Sender ID:", incoming.senderId);

                    if (String(user.id) === String(incoming.senderId)) {
                        console.log("Outgoing message:", incoming);
                    } else if (
                        String(user.id) === String(incoming.recipientId)
                    ) {
                        console.log("Incoming message:", incoming);
                        setMessages((prev) => [...prev, incoming]);
                    } else {
                        console.log("Unknown message:", incoming);
                    }
                });
            },
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            clientRef.current?.deactivate();
        };
    }, [user, recipientId]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const msg = {
            senderId: user.id,
            recipientId: recipientId,
            content: input,
            timestamp: new Date().toISOString(),
        };

        if (clientRef.current && isConnected) {
            clientRef.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(msg),
            });

            setMessages((prev) => [...prev, msg]);
            setInput("");
        } else {
            console.warn("❌ STOMP client not connected");
        }
    };

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chatSidebar}>
                <h3>Recent Conversations</h3>
                {previousChats.map((center) => (
                    <div
                        key={center.id}
                        onClick={() => {
                            Router.push(`/chat/${center.id}`);
                        }}
                        className={
                            center.id === recipientId
                                ? styles.activeChat
                                : styles.chatItem
                        }
                    >
                        {center.profilePhoto ? (
                            <img
                                src={center.profilePhoto}
                                alt={center.name}
                                className={styles.avatarImage}
                            />
                        ) : (
                            <div
                                className={styles.avatarPlaceholder}
                                style={{
                                    background: generateGradient(center.name),
                                }}
                            >
                                {getInitials(center.name)}
                            </div>
                        )}
                        <span>{center.name}</span>
                    </div>
                ))}
            </div>

            <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                    {user &&
                        messages.map((msg, i) => (
                            <div
                                key={i}
                                className={
                                    msg.senderId.toString() ===
                                    user.id.toString()
                                        ? styles.chatBubbleRight
                                        : styles.chatBubbleLeft
                                }
                            >
                                <div className={styles.chatContent}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className={styles.chatInputArea}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className={styles.chatInput}
                    />
                    <button onClick={sendMessage} className={styles.sendButton}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

ChatComponent.propTypes = {
    recipientId: PropTypes.string.isRequired,
};
