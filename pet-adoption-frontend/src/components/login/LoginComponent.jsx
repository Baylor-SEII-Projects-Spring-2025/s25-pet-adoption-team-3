import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "@/styles/LoginComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import { loginWithGoogle } from "@/utils/auth";
import { CircularProgress } from "@mui/material";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const isFormValid = email.trim() && password.trim();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const contentType = response.headers.get("content-type");

            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Invalid credentials");
                }
                throw new Error("Invalid credentials");
            }

            const data = await response.json();
            console.log("Login successful:", data);
            setUser(data.user);

            if (data.role === "ADOPTION_CENTER") {
                router.push("/adoption-center/dashboard");
            }
            else if (data.role === "ADOPTER") {
                router.push("/profile");
            }
            else {
                router.push("/");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.loginFullWidth}>
                <section className={styles.loginLeftSection}>
                    <form
                        className={styles.loginForm}
                        onSubmit={handleEmailLogin}
                    >
                        <h2>Welcome back!</h2>

                        <section className={styles.loginInput}>
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </section>

                        <a href="/forgot-password">Forgot Password?</a>

                        <section className={styles.loginButton}>
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
                                {loading ? "Logging in..." : "Login"}
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
                                Sign in with Google
                            </Button>
                        </section>

                        <p>
                            Don&apos;t have an account?{" "}
                            <a href="/register">Sign up</a>
                        </p>
                    </form>
                </section>
                <section className={styles.loginRightSection}>
                    <img
                        src="/images/login_image_right.png"
                        alt="Login Image"
                        className={styles.loginImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
