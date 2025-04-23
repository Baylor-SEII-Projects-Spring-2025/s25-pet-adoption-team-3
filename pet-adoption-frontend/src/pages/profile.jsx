/**
 * Profile Page
 * -----------------------------------------------------------
 * This page displays the adopter's profile dashboard, allowing users
 * to view and manage their information, liked pets, and settings.
 *
 * Main Features:
 *  - Renders the ProfileNavbar for authenticated navigation
 *  - Displays the ProfileComponent with user info, matches, and actions
 *  - Central hub for adopters to manage their account and adoption activity
 */

import React from "react";
import ProfileComponent from "@/components/profile/ProfileComponent";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Profile() {
    return (
        <>
            <ProfileNavbar />
            <ProfileComponent />
        </>
    );
}