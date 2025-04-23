/**
 * Register Page (Adopter)
 * -----------------------------------------------------------
 * This page allows new adopters to create an account and join the platform.
 *
 * Main Features:
 *  - Renders the RegisterComponent for user registration
 *  - Collects first name, last name, email, and password with validation
 *  - Supports password strength and confirmation, plus Google sign-up
 *  - Guides users through onboarding and account creation process
 */

import React from "react";
import RegisterComponent from "@/components/register/RegisterComponent";

export default function Login() {
    return (
        <>
            <RegisterComponent />
        </>
    );
}