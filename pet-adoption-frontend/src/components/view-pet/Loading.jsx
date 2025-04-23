/**
 * View Pet Loading Page
 * -----------------------------------------------------------
 * This page displays a skeleton loader while the detailed view for an
 * individual pet profile is being loaded.
 *
 * Main Features:
 *  - Renders the ViewPetSkeleton component as a full-page placeholder
 *  - Provides users with visual feedback during async pet detail fetches
 *  - Used as a route-level loading state for individual pet profile pages
 */

import React from "react";
import ViewPetSkeleton from "@/components/loading/ViewPetSkeleton";

export default function Loading() {
    return <ViewPetSkeleton />;
}