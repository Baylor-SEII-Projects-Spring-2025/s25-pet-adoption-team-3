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
