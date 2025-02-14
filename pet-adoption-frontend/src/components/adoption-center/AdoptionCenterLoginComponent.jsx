import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "@/styles/LoginComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";

export default function AdoptionCenterLoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/auth/adoption-center-login", {
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

            router.push("/adoption-center-dashboard");
        } catch (error) {
            alert(error.message);
        }
    };

    const fetchUserSession = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/session", {
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

                        <a href="/adoption-center-forgot-password">Forgot Password?</a>
                        <section className={styles.loginButton}>
                            <Button type="submit" variant="contained">
                                Sign in
                            </Button>
                        </section>
                    </form>
                </section>
                <section className={styles.loginRightSection}>
                    <img
                        src="/images/adoption-center_login_image_right.jpg"
                        alt="Adoption Center Login Image"
                        className={styles.loginImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
