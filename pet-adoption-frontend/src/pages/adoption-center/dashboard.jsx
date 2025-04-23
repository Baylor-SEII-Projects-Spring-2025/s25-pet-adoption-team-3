/**
 * Adoption Center Dashboard Page
 * -----------------------------------------------------------
 * This page serves as the main dashboard for adoption centers on the platform.
 * It includes navigation and management tools for center admins.
 *
 * Main Features:
 *  - Renders the AdoptionCenterNavbar for navigation
 *  - Displays the AdoptionCenterDashboardComponent for managing pets, events, messages, and settings
 *  - Central hub for adoption centers to oversee their account and operations
 */

import React from "react";
import AdoptionCenterDashboardComponent from "@/components/adoption-center/AdoptionCenterDashboardComponent";
import AdoptionCenterNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function dashboard() {
    return (
        <>
            <AdoptionCenterNavbar />
            <AdoptionCenterDashboardComponent />
        </>
    );
}
