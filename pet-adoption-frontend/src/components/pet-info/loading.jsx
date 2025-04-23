/**
 * Pet Info Loading Page
 * -----------------------------------------------------------
 * This page displays a skeleton loader for the pet detail view while
 * detailed pet data is being fetched from the backend.
 *
 * Main Features:
 *  - Renders the PetInfoSkeleton component as a full-page placeholder
 *  - Provides visual feedback to users during async pet info loads
 *  - Used as a route-level loading state for pet detail/profile pages
 */

import React from "react";
import PetInfoSkeleton from "@/components/loading/PetInfoSkeleton";

export default function Loading() {
    return <PetInfoSkeleton />;
}