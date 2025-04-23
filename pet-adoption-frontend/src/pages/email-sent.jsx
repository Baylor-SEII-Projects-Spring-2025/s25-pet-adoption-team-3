/**
 * Email Sent Page
 * -----------------------------------------------------------
 * This page confirms to users that a verification email has been sent after registration.
 *
 * Main Features:
 *  - Retrieves the user's email address from the URL query parameters
 *  - Renders the EmailSentComponent to display a success message and further instructions
 *  - Shows a loading message while the email address is being retrieved
 *  - Provides a clear, user-friendly confirmation of the registration process
 */

import React from "react";
import { useRouter } from "next/router";
import EmailSentComponent from "@/components/verification-email-sent/EmailSentComponent";

export default function EmailSent() {
    const router = useRouter();
    const { email } = router.query;

    return email ? <EmailSentComponent email={email} /> : <p>Loading...</p>;
}
