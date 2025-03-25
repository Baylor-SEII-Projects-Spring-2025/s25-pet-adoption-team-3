import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextField, Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { theme } from "@/utils/theme";
import { loginWithGoogle } from "@/utils/auth";
import styles from "@/styles/RegisterComponent.module.css";
import { CircularProgress } from "@mui/material";

export default function RegisterComponent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            setUser(data.user);

            router.push("/");
        } catch (error) {
            console.error("Error fetching session:", error);
            alert("⚠️ Failed to fetch session. Please refresh or try again later.");
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        const userData = {
            firstName,
            lastName,
            email,
            password,
            role: "ADOPTER",
        };

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            router.push(`/email-sent?email=${encodeURIComponent(email)}`);
        } catch (error) {
            console.error("Registration failed:", error.message);
            setErrorMessage(error.message);
            alert(`❌ Registration failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setIsPasswordSame(value === password);
    };

    const isFormValid =
        firstName.trim() &&
        lastName.trim() &&
        email.trim() &&
        password.trim() &&
        confirmPassword.trim() &&
        passwordScore >= 2 &&
        isPasswordSame;

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.registerFullWidth}>
                <section className={styles.registerLeftSection}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleRegister}
                    >
                        <h2>Connect with us!</h2>
                        {errorMessage && (
                            <p
                                style={{
                                    color: "red",
                                    textAlign: "center",
                                    marginTop: "10px",
                                }}
                            >
                                {errorMessage}
                            </p>
                        )}

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
                                disabled={!isFormValid || loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : null
                                }
                            >
                                {loading ? "Creating account..." : "Register"}
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
