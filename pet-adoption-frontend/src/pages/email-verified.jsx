/**
 * Email Verified Page
 * -----------------------------------------------------------
 * This page informs users that their email address has been successfully verified.
 *
 * Main Features:
 *  - Renders the EmailVerifiedComponent with a success message and next steps
 *  - Confirms successful account verification after clicking the verification link
 *  - Encourages users to log in and begin using their account
 *  - Provides clear feedback and a smooth onboarding experience
 */

import React from "react";
import EmailVerifiedComponent from "@/components/email-verified/EmailVerifiedComponent";

export default function EmailVerified() {
    return (
        <>
            <EmailVerifiedComponent />
        </>
    );
}