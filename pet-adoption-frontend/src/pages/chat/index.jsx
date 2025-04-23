/**
 * Chat Page
 * -----------------------------------------------------------
 * This page displays the main chat interface for user messaging.
 *
 * Main Features:
 *  - Includes ChatNavbar for navigation and user session context
 *  - Renders ChatComponent for real-time messaging and chat history
 *  - Retrieves recipientId from the route to target the correct conversation
 *  - Supports both adopter and adoption center messaging experiences
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
