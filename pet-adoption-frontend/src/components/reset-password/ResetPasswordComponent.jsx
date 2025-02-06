import React, { useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import styles from "@/styles/ResetPasswordComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";

export default function ResetPasswordComponent() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = (e) => {
        e.preventDefault();
        console.log(password, confirmPassword);
    };

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.resetPasswordFullWidth}>
                <section className={styles.resetPasswordLeftSection}>
                    <form
                        className={styles.resetPasswordForm}
                        onSubmit={handleResetPassword}
                    >
                        <h2>Reset password</h2>

                        <section className={styles.resetPasswordInput}>
                            <TextField
                                label="Password"
                                id="password"
                                size="small"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <TextField
                                label="Confirm Password"
                                id="confirmPassword"
                                size="small"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </section>

                        <section className={styles.resetPasswordButton}>
                            <Button type="submit" variant="contained">
                                Reset password
                            </Button>
                        </section>
                    </form>
                </section>
                <section className={styles.resetPasswordRightSection}>
                    <img
                        src="/images/reset-password_image_right.png"
                        alt="Reset Password Image"
                        className={styles.resetPasswordImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
