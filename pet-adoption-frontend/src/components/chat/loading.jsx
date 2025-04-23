/**
 * Chat Loading Page
 * -----------------------------------------------------------
 * This page displays a skeleton loader for the chat interface while chat
 * conversations or messages are being loaded.
 *
 * Main Features:
 *  - Renders the ChatSkeleton component as a full-page placeholder
 *  - Provides visual feedback to the user during asynchronous chat fetches
 *  - Used as a route-level loading state for chat pages
 */

import React from "react";
import ChatSkeleton from "@/components/loading/ChatSkeleton";

export default function Loading() {
    return <ChatSkeleton />;
}