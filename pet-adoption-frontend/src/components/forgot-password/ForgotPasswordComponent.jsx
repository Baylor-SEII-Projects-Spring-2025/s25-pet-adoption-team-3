/**
 * ForgotPasswordComponent
 * -----------------------------------------------------------
 * This component provides the "Forgot Password" functionality for users.
 * It allows users to request a password reset email by entering their
 * registered email address.
 *
 * Main Features:
 *  - Email input form with live validation
 *  - Sends password reset link via backend API on submission
 *  - Loading spinner and button disable state while submitting
 *  - Displays feedback alerts for success or errors
 *  - Responsive, styled layout with illustration and navigation link to login
 */

import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import styles from "@/styles/ForgotPasswordComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchUserSession = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                console.warn("No active session.");
                return;
            }

            const data = await response.json();
            setUser(data.user);

            router.push("/");
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
    }, []);

    const isFormValid = email.trim();

    const handleforgotPassword = (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email) {
            alert("Please enter your email");
            return;
        }

        const data = { email };

        fetch(`${API_URL}/api/users/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error sending email");
                }
                return response.text();
            })
            .then((message) => {
                alert(message);
            })
            .catch((error) => {
                console.error("Error sending email:", error);
                alert("Error sending email");
            });
        setLoading(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.forgotPasswordFullWidth}>
                <section className={styles.forgotPasswordLeftSection}>
                    <form
                        className={styles.forgotPasswordForm}
                        onSubmit={handleforgotPassword}
                    >
                        <h2>Forgot password?</h2>

                        <section className={styles.forgotPasswordInput}>
                            <TextField
                                label="Email"
                                id="email"
                                size="small"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </section>

                        <section className={styles.forgotPasswordButton}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || !isFormValid}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : null
                                }
                            >
                                {loading ? "Sending link..." : "Send email link"}
                            </Button>
                        </section>
                        <p>
                            Remembered your password?{" "}
                            <a href="/login">Log in</a>
                        </p>
                    </form>
                </section>
                <section className={styles.forgotPasswordRightSection}>
                    <img
                        src="/images/forgot-password_image_right.png"
                        alt="forgotPassword Image"
                        className={styles.forgotPasswordImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
