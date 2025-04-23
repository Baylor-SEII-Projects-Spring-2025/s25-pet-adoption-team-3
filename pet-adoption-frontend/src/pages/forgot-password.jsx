/**
 * Forgot Password Page
 * -----------------------------------------------------------
 * This page allows users to request a password reset email if they've forgotten their password.
 *
 * Main Features:
 *  - Renders the ForgotPasswordComponent for email input and reset request
 *  - Handles form submission and feedback for password reset process
 *  - Provides a clear and simple recovery flow for user accounts
 */

import React from "react";
import ForgotPasswordComponent from "@/components/forgot-password/ForgotPasswordComponent";

export default function ForgotPassword() {
    return (
        <>
            <ForgotPasswordComponent />
        </>
    );
}