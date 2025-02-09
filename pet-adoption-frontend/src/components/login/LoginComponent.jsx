import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "@/styles/LoginComponent.module.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";
import { loginWithGoogle } from "@/utils/auth";

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
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

        window.location.href = "/dashboard"; // Redirect on success
    } catch (error) {
        alert(error.message);
    }
};


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
                            <Button type="submit" variant="contained">
                                Sign in
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
