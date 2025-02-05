import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "@/styles/LoginComponent.module.css";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/utils/theme";

export default function LoginComponent() {
    return (
        <ThemeProvider theme={theme}>
            <section className={styles.loginFullWidth}>
                <section className={styles.loginLeftSection}>
                    <form className={styles.loginForm}>
                        <h2>Welcome back!</h2>

                        <section className={styles.loginInput}>
                            <TextField
                                label="Email"
                                id="outlined-size-small"
                                size="small"
                            />

                            <TextField
                                label="Password"
                                id="outlined-size-small"
                                size="small"
                            />
                        </section>

                        <a href="/forgot-password">Forgot Password?</a>
                        <section className={styles.loginButton}>
                            <Button variant="contained">Sign in</Button>
                            <Button variant="contained">Sign in with Google</Button>
                        </section>

                        <p>
                            Don't have an account?{" "}
                            <a href="/sign-up">Sign up</a>
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
