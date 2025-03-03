import React, { useState } from "react";
import { TextField, Button, Input } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { theme } from "@/utils/theme";
import styles from "@/styles/AdoptionCenterRegisterComponent.module.css";

export default function AdoptionCenterRegisterComponent() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        adoptionCenterName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        website: "",
        bio: "",
        photo: null,
    });

    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleRegister = async (e) => {
        e.preventDefault();
        const userData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            userData.append(key, value);
        });

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                body: userData,
            });

            if (!response.ok) throw new Error(await response.text());

            window.location.href = "/login";
        } catch (error) {
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        }
    };

    const isStep1Valid =
        formData.adoptionCenterName.trim() &&
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        passwordScore >= 2 &&
        isPasswordSame;

    const isStep2Valid = formData.phone.trim() && formData.website.trim();

    const isStep3Valid = formData.bio.trim() && formData.photo;

    return (
        <ThemeProvider theme={theme}>
            <section className={styles.registerFullWidth}>
                <section className={styles.registerLeftSection}>
                    <form
                        className={styles.registerForm}
                        onSubmit={handleRegister}
                    >
                        <h2>Join our family!</h2>

                        {step === 1 && (
                            <>
                                <section className={styles.registerInput}>
                                    <section className={styles.registerName}>
                                        <TextField
                                            label="Adoption Center Name"
                                            name="adoptionCenterName"
                                            size="small"
                                            value={formData.adoptionCenterName}
                                            onChange={handleChange}
                                        />
                                    </section>

                                    <TextField
                                        label="Email"
                                        name="email"
                                        size="small"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        label="Password"
                                        name="password"
                                        type="password"
                                        size="small"
                                        value={formData.password}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setIsPasswordSame(
                                                e.target.value ===
                                                    formData.confirmPassword,
                                            );
                                        }}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                    />
                                    {passwordFocused && (
                                        <PasswordStrengthBar
                                            password={formData.password}
                                            onChangeScore={(score) =>
                                                setPasswordScore(score)
                                            }
                                        />
                                    )}
                                    <TextField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        size="small"
                                        value={formData.confirmPassword}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setIsPasswordSame(
                                                e.target.value ===
                                                    formData.password,
                                            );
                                        }}
                                        error={
                                            formData.confirmPassword.length >
                                                0 && !isPasswordSame
                                        }
                                        helperText={
                                            formData.confirmPassword.length >
                                                0 && !isPasswordSame
                                                ? "Passwords do not match"
                                                : ""
                                        }
                                    />
                                </section>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={!isStep1Valid}
                                >
                                    Next
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <TextField
                                    label="Phone Number"
                                    name="phone"
                                    size="small"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <TextField
                                    label="Website Link"
                                    name="website"
                                    size="small"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                                <section className={styles.navigationButtons}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={!isStep2Valid}
                                    >
                                        Next
                                    </Button>
                                </section>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <TextField
                                    label="Short Bio"
                                    name="bio"
                                    size="small"
                                    multiline
                                    rows={3}
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className={styles.previewImage}
                                    />
                                )}
                                <section className={styles.navigationButtons}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleBack}
                                    >
                                        Back
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={!isStep3Valid}>
                                        Sign Up
                                    </Button>
                                </section>
                            </>
                        )}
                    </form>
                </section>
                <section className={styles.registerRightSection}>
                    <img
                        src="/images/register_image_right.png"
                        alt="Register"
                        className={styles.registerImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
