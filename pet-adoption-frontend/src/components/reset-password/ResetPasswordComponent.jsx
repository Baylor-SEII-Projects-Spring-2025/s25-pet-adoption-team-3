import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TextField, Button } from "@mui/material";
import styles from "@/styles/ResetPasswordComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordComponent() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } 
    }, [searchParams]); // Remove `token` dependency to prevent unnecessary re-renders

    useEffect(() => {
        console.log("Token:", token);
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            alert("Please fill in both fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            if (!response.ok) {
                throw new Error("Failed to reset password");
            }

            const result = await response.text();
            setMessage(result);
            alert("Password reset successful! You can now log in.");
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Failed to reset password.");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.resetPasswordFullWidth}>
                <section className={styles.resetPasswordLeftSection}>
                    <form
                        className={styles.resetPasswordForm}
                        onSubmit={handleResetPassword}
                    >
                        <h2>Reset Password</h2>

                        {message && <p className={styles.message}>{message}</p>}

                        <section className={styles.resetPasswordInput}>
                            <TextField
                                label="Password"
                                id="password"
                                type="password"
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <TextField
                                label="Confirm Password"
                                id="confirmPassword"
                                type="password"
                                size="small"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </section>

                        <section className={styles.resetPasswordButton}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!token}
                            >
                                Reset Password
                            </Button>
                        </section>
                    </form>
                </section>
                <section className={styles.resetPasswordRightSection}>
                    <img
                        src="/images/reset-password_image_right.png"
                        alt="Reset Password"
                        className={styles.resetPasswordImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
