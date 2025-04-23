/**
 * Gallery Page
 * -----------------------------------------------------------
 * This page displays a gallery of adoptable pets, allowing users to browse
 * pet profiles in a visually engaging layout.
 *
 * Main Features:
 *  - Renders the ProfileNavbar for authenticated navigation
 *  - Displays the GalleryComponent with a grid/list of pet cards
 *  - Enables exploration of available pets outside the swipe interface
 */

import React from "react";
import GalleryComponent from "@/components/gallery/GalleryComponent";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Gallery() {
    return (
        <>
            <ProfileNavbar />
            <GalleryComponent />
        </>
    );
}