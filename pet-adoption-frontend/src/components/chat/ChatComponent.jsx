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
    const [unreadCounts, setUnreadCounts] = useState({});

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
        if (user) {
            fetchUnreadCounts(); // Only run after user is fetched
        }
    }, [user, previousChats]);

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
                setPreviousChats(
                    data.map((chat) => ({
                        ...chat,
                        id: String(chat.id),
                    })),
                );
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        }
    };

    const fetchUnreadCounts = async () => {
        if (!user) return;
        try {
            // First get the global unread count
            const countRes = await fetch(`${API_URL}/api/chat/unread-count`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            if (!countRes.ok) return;

            // Then get unread counts per conversation
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

                // ✅ Mark messages from this chat as read
                await fetch(`${API_URL}/api/chat/mark-read/${recipientId}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                fetchUnreadCounts(); // Refresh UI count
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

                    if (
                        String(user.id) === String(incoming.recipientId) &&
                        String(incoming.senderId) === String(recipientId)
                    ) {
                        // Only add messages that are from the currently active chat partner
                        setMessages((prev) => [...prev, incoming]);
                    } else {
                        // Optionally update unread count or other UI cues for other chats
                        console.log(
                            "Received message from another chat:",
                            incoming,
                        );
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

    const sortedChats = [...previousChats].sort((a, b) => {
        const aUnread = unreadCounts[a.id]?.count > 0;
        const bUnread = unreadCounts[b.id]?.count > 0;

        const aTime = new Date(
            unreadCounts[a.id]?.lastMessageTime || a.lastMessageTime || 0,
        );
        const bTime = new Date(
            unreadCounts[b.id]?.lastMessageTime || b.lastMessageTime || 0,
        );

        // Sort by unread first
        if (aUnread && !bUnread) return -1;
        if (!aUnread && bUnread) return 1;

        // Then by latest message time
        return bTime - aTime;
    });

    console.log("🔴 Unread Counts:", unreadCounts);
    console.log(
        "🧩 Center IDs in sortedChats:",
        sortedChats.map((c) => c.id),
    );
    console.log("🧩 UnreadCounts keys:", Object.keys(unreadCounts));

    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chatSidebar}>
                <h3>Recent Conversations</h3>
                {sortedChats.map((center) => (
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
                            justifyContent: "space-between", // push dot to right
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
