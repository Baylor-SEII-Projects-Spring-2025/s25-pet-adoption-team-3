import React, { useState } from "react";
import Router from "next/router";
import { TextField, Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { theme } from "@/utils/theme";
import styles from "@/styles/AdoptionCenterRegisterComponent.module.css";
import { CircularProgress } from "@mui/material";

export default function AdoptionCenterRegisterComponent() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        adoptionCenterName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        website: "",
        bio: "",
        photo: null,
    });

    const [passwordScore, setPasswordScore] = useState(0);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [isPasswordSame, setIsPasswordSame] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        const placeholderPhotoUrl = "https://example.com/default-profile.png";

        const userData = {
            adoptionCenterName: formData.adoptionCenterName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            website: formData.website,
            bio: formData.bio,
            photo: placeholderPhotoUrl,
        };

        try {
            const registerResponse = await fetch(
                `${API_URL}/api/adoption-center/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
                },
            );

            if (!registerResponse.ok)
                throw new Error(await registerResponse.text());

            const contentType = registerResponse.headers.get("content-type");
            let registeredUser;
            if (contentType && contentType.includes("application/json")) {
                registeredUser = await registerResponse.json();
            } else {
                registeredUser = { id: null };
            }

            const userId = registeredUser.id;
            alert(
                "Registration successful! User ID: " +
                    userId +
                    " 🎉" +
                    formData.photo,
            );

            if (formData.photo && userId) {
                const photoFormData = new FormData();
                photoFormData.append("file", formData.photo);

                const uploadResponse = await fetch(
                    `${API_URL}/api/users/${userId}/uploadProfilePhoto`,
                    {
                        method: "POST",
                        body: photoFormData
                    },
                );

                if (!uploadResponse.ok) {
                    alert("❌ Photo upload failed. Try again later.");
                    throw new Error("Photo upload failed");
                }
            }

            Router.push(`/email-sent?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            console.error("Registration failed:", error.message);
            alert("Registration failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isStep1Valid =
        formData.adoptionCenterName.trim() &&
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        passwordScore >= 2 &&
        isPasswordSame;

    const isStep2Valid = formData.phoneNumber.trim() && formData.website.trim();

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
                                    name="phoneNumber"
                                    size="small"
                                    value={formData.phoneNumber}
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
                                <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
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
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={!isStep3Valid || loading}
                                        startIcon={
                                            loading ? (
                                                <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                            ) : null
                                        }
                                    >
                                        {loading
                                            ? "Creating account..."
                                            : "Sign Up"}
                                    </Button>
                                </section>
                            </>
                        )}
                    </form>
                </section>
                <section className={styles.registerRightSection}>
                    <img
                        src="/images/adoption-center_register_image_right.png"
                        alt="Register"
                        className={styles.registerImage}
                    />
                </section>
            </section>
        </ThemeProvider>
    );
}
