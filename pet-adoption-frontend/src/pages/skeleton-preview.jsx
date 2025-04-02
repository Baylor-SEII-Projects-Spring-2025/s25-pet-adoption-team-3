import React from "react";
import SwipeSkeleton from "@/components/swipe/Loading";

export default function SkeletonPreview() {
    return (
        <div style={{ padding: "2rem" }}>
            <SwipeSkeleton />
        </div>
    );
}
