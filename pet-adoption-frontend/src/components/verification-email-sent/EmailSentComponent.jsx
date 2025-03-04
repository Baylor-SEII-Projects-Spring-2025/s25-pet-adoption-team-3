import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/EmailSent.module.css";

export default function EmailSentComponent({ email }) {
    return (
        <div className={styles.container}>

            <div className={styles.card}>
                <img
                    src="/icons/email-verified-check.png"
                    alt="Email Sent"
                    className={styles.icon}
                />
                <h1>Verification Email Sent!</h1>
                <p>
                    We have sent a verification link to <strong>{email}</strong>
                    . Please check your inbox and follow the instructions to
                    verify your email.
                </p>
                <p className={styles.hint}>
                    Didn&apos;t receive an email? Check your spam folder or{" "}
                    <a
                        href="/resend-verification"
                        className={styles.resendLink}
                    >
                        resend verification email
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

// Prop validation
EmailSentComponent.propTypes = {
    email: PropTypes.string.isRequired,
};
