/**
 * Chat Page
 * -----------------------------------------------------------
 * This page provides the chat interface for users to communicate
 * directly with each other or with adoption centers.
 *
 * Main Features:
 *  - Renders the ChatNavbar for navigation and user context
 *  - Displays the ChatComponent for message history and real-time chat
 *  - Passes the recipient's userId (from URL) to the chat component
 *  - Enables seamless, interactive messaging within the platform
 */

import React from "react";
import { useRouter } from "next/router";
import Chat from "@/components/chat/ChatComponent";
import ChatNavbar from "@/components/chat/ChatNavbar";

export default function ChatPage() {
    const router = useRouter();
    const { userId: recipientId } = router.query;
    
    return (
        <>
            <ChatNavbar />
            <Chat recipientId={recipientId} />
        </>
    );
}
