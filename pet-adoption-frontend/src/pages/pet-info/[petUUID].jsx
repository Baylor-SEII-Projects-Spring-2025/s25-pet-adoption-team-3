/**
 * Pet Info Page
 * -----------------------------------------------------------
 * This page displays detailed information about a specific pet,
 * including profile details and user interactions.
 *
 * Main Features:
 *  - Renders the AdoptionNavbar for navigation and context
 *  - Displays PetInfoComponent for rich pet profile details
 *  - Retrieves petUUID from the route for dynamic data fetch
 *  - Centralizes all information and actions related to the selected pet
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
