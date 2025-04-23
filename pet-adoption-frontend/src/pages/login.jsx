/**
 * Login Page
 * -----------------------------------------------------------
 * This page allows users to sign in to their account using email/password
 * or Google OAuth, providing secure access to the platform.
 *
 * Main Features:
 *  - Renders the LoginComponent with forms for email and password login
 *  - Offers Google OAuth login as an alternative
 *  - Includes navigation to password reset and registration pages
 *  - Handles authentication and user redirection on success
 */

import React from "react";
import LoginComponent from "@/components/login/LoginComponent";

export default function Login() {
    return (
        <>
            <LoginComponent />
        </>
    );
}
