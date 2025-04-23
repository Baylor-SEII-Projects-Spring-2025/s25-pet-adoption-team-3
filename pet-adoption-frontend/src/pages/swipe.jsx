/**
 * Swipe Page
 * -----------------------------------------------------------
 * This page provides the interactive swipe interface for adopters to
 * browse, like, or pass on available pets in a card-based UI.
 *
 * Main Features:
 *  - Renders the ProfileNavbar for authenticated navigation
 *  - Displays the SwipeComponent for pet discovery with swipe gestures
 *  - Central experience for matching adopters with pets
 */

import React from "react";
import { SwipeComponent } from "@/components/swipe/SwipeComponent";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Swipe() {
    return (
        <>
            <ProfileNavbar />
            <SwipeComponent />
        </>
    );
}