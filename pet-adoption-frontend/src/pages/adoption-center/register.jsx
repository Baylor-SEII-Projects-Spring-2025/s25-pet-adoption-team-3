/**
 * Adoption Center Register Page
 * -----------------------------------------------------------
 * This page provides the registration flow for new adoption centers
 * to sign up and join the platform.
 *
 * Main Features:
 *  - Renders the AdoptionCenterRegisterComponent for multi-step registration
 *  - Collects center info, account credentials, and profile details
 *  - Guides new adoption centers through onboarding and account creation
 */

import React from "react";
import AdoptionCenterRegister from "@/components/adoption-center/AdoptionCenterRegisterComponent";

export default function register() {
    return (
        <>
            <AdoptionCenterRegister />
        </>
    );
}
