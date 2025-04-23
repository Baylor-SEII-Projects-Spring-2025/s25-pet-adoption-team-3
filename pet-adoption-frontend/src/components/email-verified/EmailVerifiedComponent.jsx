/**
 * EmailVerifiedComponent
 * -----------------------------------------------------------
 * This component displays a confirmation screen after a user
 * successfully verifies their email address.
 *
 * Main Features:
 *  - Shows a success icon and "Email Verified!" message
 *  - Provides instructions for next steps (log in to account)
 *  - Includes a prominent button to navigate directly to the login page
 *  - Styled with a centered card layout for clear user feedback
 */

import React from "react";
import Link from "next/link";
import styles from "@/styles/EmailVerified.module.css";

export default function EmailVerifiedComponent() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <img
                    src="/icons/email-verified-check.png"
                    alt="Email Verified"
                    className={styles.icon}
                />
                <h1>Email Verified!</h1>
                <p>
                    Your email has been successfully verified. You can now log
                    in and access your account.
                </p>
                <Link href="/login">
                    <button className={styles.loginButton}>Go to Login</button>
                </Link>
            </div>
        </div>
    );
}
