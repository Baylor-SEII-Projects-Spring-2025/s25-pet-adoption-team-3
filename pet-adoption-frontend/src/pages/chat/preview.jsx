import React from "react";
import ChatSkeleton from "@/components/loading/ChatSkeleton";

export default function ChatSkeletonPreview() {
    return (
        <div style={{ height: "100vh", overflow: "hidden" }}>
            <ChatSkeleton />
        </div>
    );
}
