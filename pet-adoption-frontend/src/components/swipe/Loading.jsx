/**
 * Swipe Loading Page
 * -----------------------------------------------------------
 * This page displays a skeleton loader while swipeable pet cards
 * and related data are being loaded for the swipe interface.
 *
 * Main Features:
 *  - Renders the SwipeSkeleton component as a full-page placeholder
 *  - Provides smooth visual feedback during asynchronous pet card fetches
 *  - Used as a route-level loading state for the swipe/adopt page
 */

import React from "react";
import SwipeSkeleton from "@/components/loading/SwipeSkeleton";

export default function Loading() {
    return <SwipeSkeleton />;
}