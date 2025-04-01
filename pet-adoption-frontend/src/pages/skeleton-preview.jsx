import React from "react";
import AdoptionCenterSkeleton from "@/components/adoption-center/Loading";

export default function SkeletonPreview() {
    return (
        <div style={{ padding: "2rem" }}>
            <AdoptionCenterSkeleton />
        </div>
    );
}
