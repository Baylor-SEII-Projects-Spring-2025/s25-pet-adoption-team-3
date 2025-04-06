import React from "react";
import ProfileSkeleton from "@/components/profile/Loading";

export default function ProfileSkeletonPreview() {
    return (
        <div style={{ padding: "2rem" }}>
            <ProfileSkeleton />
        </div>
    );
}
