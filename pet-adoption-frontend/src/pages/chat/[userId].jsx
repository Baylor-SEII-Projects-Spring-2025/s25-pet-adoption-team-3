import React from "react";
import { useRouter } from "next/router";
import Chat from "@/components/chat/ChatComponent";

export default function ChatPage() {
    const router = useRouter();
    const { userId: recipientId } = router.query;

    if (!recipientId) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Chat recipientId={recipientId} />
        </>
    );
}
