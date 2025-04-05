import React from "react";
import { useRouter} from "next/router";
import AdoptionCenterSkeleton from "@/components/loading/AdoptionCenterSkeleton";
import SwipeSkeleton from "@/components/loading/SwipeSkeleton";
import ProfileSkeleton from "@/components/loading/ProfileSkeleton";

export default function Loading() {
    const { pathname } = useRouter();

    if(pathname.includes("/adoption-center")) return <AdoptionCenterSkeleton />;
    if(pathname === "/swipe") return <SwipeSkeleton />;
    if(pathname === "/profile") return <ProfileSkeleton />;
    return <div>Loading... </div>;
}