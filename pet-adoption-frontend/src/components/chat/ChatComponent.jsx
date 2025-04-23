import React, { useState, useEffect, useRef } from "react";
import Router from "next/router";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styles from "@/styles/ChatComponent.module.css";
import PropTypes from "prop-types";
import ChatSkeleton from "@/components/loading/ChatSkeleton";

export default function ChatComponent({ recipientId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [user, setUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [petContext, setPetContext] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const WS_URL = `${API_URL}/ws-chat`;

    const [previousChats, setPreviousChats] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});

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

    const getInitials = (name) => {
        if (!name) return "";

        const parts = name.split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    useEffect(() => {
        if (user) {
            fetchUnreadCounts();
        }
    }, [user, previousChats]);

    const fetchConversations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/chat/conversations`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const data = await res.json();
                setPreviousChats(
                    data.map((chat) => ({
                        ...chat,
                        id: String(chat.id),
                    })),
                );
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUnreadCounts = async () => {
        if (!user) return;
        try {
            const countRes = await fetch(`${API_URL}/api/chat/unread-count`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!countRes.ok) return;

            const counts = {};
            for (const chat of previousChats) {
                const res = await fetch(
                    `${API_URL}/api/chat/history/${chat.id}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                if (res.ok) {
                    const history = await res.json();
                    const unreadCount = history.filter(
                        (msg) =>
                            !msg.read &&
                            String(msg.recipientId) === String(user.id),
                    ).length;

                    if (unreadCount > 0) {
                        counts[String(chat.id)] = {
                            count: unreadCount,
                            lastMessageTime:
                                history[history.length - 1]?.timestamp ||
                                new Date().toISOString(),
                        };
                    }
                }
            }

            setUnreadCounts(counts);
        } catch (err) {
            console.error("Failed to fetch unread counts:", err);
        }
    };

    useEffect(() => {
        const context = sessionStorage.getItem("petContext");
        if (context) {
            try {
                const parsed = JSON.parse(context);
                setPetContext(parsed);

                const lastPetContextMsg = [...messages]
                    .reverse()
                    .find((msg) => msg.petContext);

                const isSameContext =
                    lastPetContextMsg &&
                    lastPetContextMsg.petContext &&
                    parsed &&
                    lastPetContextMsg.petContext.name === parsed.name &&
                    lastPetContextMsg.petContext.age === parsed.age &&
                    lastPetContextMsg.petContext.breed === parsed.breed &&
                    lastPetContextMsg.petContext.gender === parsed.gender;

                if (!isSameContext && user && recipientId) {
                    const baseMsg = {
                        senderId: user.id,
                        recipientId: recipientId,
                        content: "",
                        timestamp: new Date().toISOString(),
                        petContext: parsed,
                    };

                    if (clientRef.current && isConnected) {
                        clientRef.current.publish({
                            destination: "/app/chat",
                            body: JSON.stringify(baseMsg),
                        });

                        sessionStorage.removeItem("petContext");

                        setMessages((prev) => [...prev, baseMsg]);
                    }
                }
            } catch (err) {
                console.error("Invalid pet context", err);
                sessionStorage.removeItem("petContext");
            }
        }
    }, [user, recipientId, isConnected, messages]);

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
                setMessages(history);

                await fetch(`${API_URL}/api/chat/mark-read/${recipientId}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                fetchUnreadCounts();
            } catch (err) {
                console.error("Error fetching chat history:", err);
            }
        };

        fetchChatHistory();
    }, [user?.id, recipientId]);

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
                fetchConversations();
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
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);
                stompClient.subscribe("/topic/messages", (msg) => {
                    const incoming = JSON.parse(msg.body);

                    if (
                        String(user.id) === String(incoming.recipientId) &&
                        String(incoming.senderId) === String(recipientId)
                    ) {
                        setMessages((prev) => [...prev, incoming]);
                    } else {
                        fetchConversations();
                        fetchUnreadCounts();
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

        const baseMsg = {
            senderId: user.id,
            recipientId: recipientId,
            content: input,
            timestamp: new Date().toISOString(),
        };

        const hasSentContext = messages.some((msg) => msg.petContext);

        const msg =
            !hasSentContext && petContext
                ? { ...baseMsg, petContext }
                : baseMsg;

        if (clientRef.current && isConnected) {
            clientRef.current.publish({
                destination: "/app/chat",
                body: JSON.stringify(msg),
            });

            setMessages((prev) => [...prev, msg]);
            setInput("");

            if (!hasSentContext && petContext) {
                setPetContext(null);
            }
        } else {
            console.warn("❌ STOMP client not connected");
        }
    };

    const sortedChats = [...previousChats].sort((a, b) => {
        const aUnread = unreadCounts[a.id]?.count > 0;
        const bUnread = unreadCounts[b.id]?.count > 0;

        const aTime = new Date(
            unreadCounts[a.id]?.lastMessageTime || a.lastMessageTime || 0,
        );
        const bTime = new Date(
            unreadCounts[b.id]?.lastMessageTime || b.lastMessageTime || 0,
        );

        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;

        return bTime - aTime;
    });

    if(isLoading) return <ChatSkeleton />;

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chatSidebar}>
                <h3 className={styles.recentConversationsHeader}>
                    Recent Conversations
                </h3>
                    {sortedChats.length === 0 ? (
                    <div className={styles.noConversations}>
                        No recent conversations
                    </div>
                ) : (
                    sortedChats.map((center) => (
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
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
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
                                            background: generateGradient(
                                                center.name,
                                            ),
                                        }}
                                    >
                                        {getInitials(center.name)}
                                    </div>
                                )}
                                <span>{center.name}</span>
                            </div>

                            {unreadCounts[center.id]?.count > 0 && (
                                <div className={styles.unreadIndicator}></div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className={styles.chatContainer}>
                {!recipientId ? (
                    <div className={styles.noConversationSelected}>
                        <p>No conversation selected</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.chatMessages}>
                            {user &&
                                messages.map((msg, i) => {
                                    const isSender =
                                        msg.senderId.toString() ===
                                        user.id.toString();

                                    return (
                                        <div
                                            key={i}
                                            className={
                                                isSender
                                                    ? styles.chatBubbleRight
                                                    : styles.chatBubbleLeft
                                            }
                                        >
                                            <div className={styles.chatContent}>
                                                {msg.petContext ? (
                                                    <>
                                                        <p
                                                            style={{
                                                                fontStyle:
                                                                    "italic",
                                                                marginBottom:
                                                                    "0.25rem",
                                                            }}
                                                        >
                                                            You&apos;re chatting
                                                            about{" "}
                                                            <strong>
                                                                {
                                                                    msg
                                                                        .petContext
                                                                        .name
                                                                }
                                                            </strong>{" "}
                                                            (
                                                            {
                                                                msg.petContext
                                                                    .breed
                                                            }
                                                            , Age{" "}
                                                            {msg.petContext.age}
                                                            ,{" "}
                                                            {
                                                                msg.petContext
                                                                    .gender
                                                            }
                                                            )
                                                        </p>
                                                        <img
                                                            src={
                                                                msg.petContext
                                                                    .image
                                                            }
                                                            alt={
                                                                msg.petContext
                                                                    .name
                                                            }
                                                            className={
                                                                styles.petContextImage
                                                            }
                                                            style={{
                                                                marginTop:
                                                                    "0.5rem",
                                                                maxWidth:
                                                                    "200px",
                                                                borderRadius:
                                                                    "10px",
                                                            }}
                                                        />
                                                    </>
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            <div ref={messagesEndRef} />
                        </div>
                        <div className={styles.chatInputArea}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && sendMessage()
                                }
                                placeholder="Type a message..."
                                className={styles.chatInput}
                            />
                            <button
                                onClick={sendMessage}
                                className={styles.sendButton}
                            >
                                Send
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

ChatComponent.propTypes = {
    recipientId: PropTypes.string.isRequired,
};