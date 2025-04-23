/**
 * Profile Loading Page
 * -----------------------------------------------------------
 * This page displays a skeleton loader while user profile data is being fetched.
 *
 * Main Features:
 *  - Renders the ProfileSkeleton component as a full-page placeholder
 *  - Provides a smooth, visually consistent loading state for the profile dashboard
 *  - Used as a route-level loading indicator for profile-related pages
 */

import React from "react";
import ProfileSkeleton from "@/components/loading/ProfileSkeleton";

export default function Loading() {
    return <ProfileSkeleton />;
}