/**
 * Reset Password Page
 * -----------------------------------------------------------
 * This page allows users to set a new password using a secure token
 * (typically accessed from a password reset email).
 *
 * Main Features:
 *  - Renders the ResetPasswordComponent for input and validation
 *  - Collects and confirms the new password with strength checking
 *  - Handles password reset requests securely via the backend API
 *  - Provides user feedback on success or failure
 */

import React from "react";
import ResetPasswordComponent from "@/components/reset-password/ResetPasswordComponent";

export default function ResetPassword() {
    return (
        <>
            <ResetPasswordComponent />
        </>
    );
}
