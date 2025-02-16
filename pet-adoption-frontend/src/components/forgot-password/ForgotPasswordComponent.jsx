import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import styles from "@/styles/ForgotPasswordComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import { useRouter } from "next/router";

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
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

            if (!response.ok) {
                throw new Error("Error fetching session");
            }

            const data = await response.json();
            console.log("✅ Session found:", data);

            router.push("/");
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const handleforgotPassword = (e) => {
        e.preventDefault();
        console.log(email);
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
                            <Button type="submit" variant="contained">
                                Send email link
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
