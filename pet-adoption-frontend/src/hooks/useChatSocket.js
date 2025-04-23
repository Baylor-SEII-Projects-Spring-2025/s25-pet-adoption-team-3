import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function useChatSocket(onMessage) {
    const clientRef = useRef(null);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const socket = new SockJS(`${API_URL}/ws-chat`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe("/topic/messages", (msg) => {
                    onMessage(JSON.parse(msg.body));
                });
            },
            onDisconnect: () => console.log("❌ Disconnected"),
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    const sendMessage = (chatMsg) => {
        clientRef.current?.publish({
            destination: "/app/chat",
            body: JSON.stringify(chatMsg),
        });
    };

    return { sendMessage };
}
