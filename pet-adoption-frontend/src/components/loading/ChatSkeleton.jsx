import React from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "@/styles/ChatComponent.module.css";

export default function ChatSkeleton() {
    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chatSidebar}>
                <Skeleton variant="text" width={180} height={30} sx={{ mt: 2, mb: 2, ml: 2 }} />
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles.chatItem} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px" }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={100} height={24} />
                    </div>
                ))}
            </div>

            <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={i % 2 === 0 ? styles.chatBubbleLeft : styles.chatBubbleRight}
                        >
                            <Skeleton
                                variant="rounded"
                                width={200}
                                height={40}
                                sx={{ borderRadius: "10px", mb: 1 }}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.chatInputArea}>
                    <Skeleton variant="rounded" height={40} width="100%" sx={{ mr: 1 }} />
                    <Skeleton variant="rounded" width={70} height={40} />
                </div>
            </div>
        </div>
    );
}
