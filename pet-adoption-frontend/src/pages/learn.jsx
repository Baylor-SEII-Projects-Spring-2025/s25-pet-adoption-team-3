/**
 * Learn Page
 * -----------------------------------------------------------
 * This page educates users about the benefits and responsibilities
 * of pet adoption, supporting the mission of the platform.
 *
 * Main Features:
 *  - Renders the ProfileNavbar for authenticated navigation
 *  - Displays the LearnComponent with information and visuals about adoption
 *  - Encourages ethical adoption and informs users with key facts and reasons
 */

import React from "react";
import LearnComponent from "@/components/learn/LearnComponent";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Learn() {
    return (
        <>
            <ProfileNavbar />
            <LearnComponent />
        </>
    );
}