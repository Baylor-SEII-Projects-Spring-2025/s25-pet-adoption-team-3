import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TextField, Button } from "@mui/material";
import styles from "@/styles/ResetPasswordComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import PasswordStrengthBar from "react-password-strength-bar";
import { CircularProgress } from "@mui/material";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordComponent() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState("");
    const searchParams = useSearchParams();
    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        console.log("Token:", token);
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setloading(true);

        if (!password || !confirmPassword) {
            alert("Please fill in both fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/users/reset-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token, newPassword: password }),
                },
            );

            if (!response.ok) {
                throw new Error("Failed to reset password");
            }

            const result = await response.text();
            setMessage(result);
            alert("Password reset successful! You can now log in.");
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Failed to reset password.");
            alert("❌ Failed to reset password. Please try again.");

        } finally {
            setloading(false);
        }

    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setIsPasswordSame(value === password);
    };

    const isFormValid =
        password.trim() &&
        confirmPassword.trim() &&
        passwordScore >= 2 &&
        isPasswordSame;

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
                                className={styles.passwordInput}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setIsPasswordSame(
                                        e.target.value === confirmPassword,
                                    );
                                }}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                            />

                            {passwordFocused && (
                                <PasswordStrengthBar
                                    password={password}
                                    onChangeScore={(score) =>
                                        setPasswordScore(score)
                                    }
                                />
                            )}

                            <TextField
                                label="Confirm Password"
                                id="confirmPassword"
                                type="password"
                                size="small"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                error={
                                    confirmPassword.length > 0 &&
                                    !isPasswordSame
                                }
                                helperText={
                                    confirmPassword.length > 0 &&
                                    !isPasswordSame
                                        ? "Passwords do not match"
                                        : ""
                                }
                            />
                        </section>

                        <section className={styles.resetPasswordButton}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!token || !isFormValid || loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : null
                                }
                            >
                                {loading ? "Updating password..." : "Reset Password"}
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
