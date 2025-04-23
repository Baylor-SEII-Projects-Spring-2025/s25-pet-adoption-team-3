/**
 * Pet Info Page
 * -----------------------------------------------------------
 * This page displays a detailed view of an individual pet, tailored
 * for adoption center staff to review pet information and interactions.
 *
 * Main Features:
 *  - Renders the AdoptionNavbar for navigation and account context
 *  - Displays the PetInfoComponent, showing all pet details and user likes
 *  - Retrieves petUUID from the route to dynamically load the correct pet
 *  - Supports adoption actions and user engagement with pet profiles
 */

import React from "react";
import { useRouter } from "next/router";
import PetInfoComponent from "@/components/pet-info/PetInfoComponent";
import AdoptionNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function PetInfoPage() {
    const router = useRouter();
    const { petUUID } = router.query;

    return (
        <>
            <AdoptionNavbar />
            <PetInfoComponent petUUID={petUUID} />
        </>
    );
}
