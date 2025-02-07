import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { theme } from "@/utils/theme";
import { loginWithGoogle } from "@/utils/auth";
import styles from "@/styles/RegisterComponent.module.css";

export default function RegisterComponent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        console.log(firstName, lastName, email, password, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setIsPasswordSame(value === password);
    };

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.registerFullWidth}>
                <section className={styles.registerLeftSection}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleRegister}
                    >
                        <h2>Connect with us!</h2>

                        <section className={styles.registerInput}>
                            <section className={styles.registerName}>
                                <TextField
                                    label="First Name"
                                    id="firstName"
                                    size="small"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                />

                                <TextField
                                    label="Last Name"
                                    id="lastName"
                                    size="small"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </section>

                            <TextField
                                label="Email"
                                id="email"
                                size="small"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

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

                        <section className={styles.registerButton}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={passwordScore < 2 || !isPasswordSame}
                            >
                                Sign up
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={
                                    <img
                                        src="/icons/google_oauth.png"
                                        alt="Google Icon"
                                        style={{ width: 20, height: 20 }}
                                    />
                                }
                                onClick={loginWithGoogle}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderColor: "#DADADA",
                                    color: "#4A4543",
                                    "&:hover": {
                                        backgroundColor: "#e5e5e5",
                                        color: "#000000",
                                    },
                                }}
                            >
                                Sign up with Google
                            </Button>
                        </section>
                        <p>
                            Already have an account? <a href="/login">Log in</a>
                        </p>
                    </form>
                </section>
                <section className={styles.registerRightSection}>
                    <img
                        src="/images/register_image_right.png"
                        alt="Register Image"
                        className={styles.registerImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
