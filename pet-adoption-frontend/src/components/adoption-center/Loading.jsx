/**
 * Loading Page
 * -----------------------------------------------------------
 * This page is displayed while adoption center dashboard data is loading.
 * It shows a skeleton loader to indicate to users that content is being fetched.
 *
 * Main Features:
 *  - Renders the AdoptionCenterSkeleton component as a full-page placeholder
 *  - Provides visual feedback during async page or route loads
 *  - Used as a route-level loading state in the app’s adoption center section
 */

import React from "react";
import AdoptionCenterSkeleton from "@/components/loading/AdoptionCenterSkeleton";

export default function Loading() {
    return <AdoptionCenterSkeleton />;
}