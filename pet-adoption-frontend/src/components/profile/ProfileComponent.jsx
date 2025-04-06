import React, { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import Loading from "../adoption-center/Loading";
import styles from "@/styles/ProfileDashboardComponent.module.css";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfileDashboardComponent() {
    const [selectedNav, setSelectedNav] = useState("Dashboard");
    const [selectedLikes, setSelectedLikes] = useState("My Likes");
    const [user, setUser] = useState(null);
    const [uploadError, setUploadError] = useState("");
    const anchorRef = useRef(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);

    const fetchUserSession = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                },
            });

            if (response.status === 401) {
                console.warn("No active session.");
                Router.push("/login");
                return;
            }

            const data = await response.json();
            console.log("User session data:", data);

            const fetchedUser = data.user;

            if (fetchedUser.role === "ADOPTION_CENTER") {
                Router.push("/adoption-center/dashboard");
                return;
            } else if (fetchedUser.role !== "ADOPTER") {
                Router.push("/");
                return;
            }

            setUser(fetchedUser);
            setIsPageLoading(false);
        } catch (error) {
            console.error("Error fetching session:", error);
            alert(
                "⚠️ Failed to fetch your session. Please refresh or log in again.",
            );
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (user && user.role === "ADOPTION_CENTER") {
            Router.push("/adoption-center/dashboard");
        }
    }, [user]);

    const handleDeletePhoto = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/users/deleteProfilePhoto/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 400) {
                console.log("User not found");
                alert("User not found.");
                return;
            }

            if (response.ok) {
                console.log("✅ Profile photo deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete profile photo");
                alert("❌ Failed to delete profile photo.");
            }
        } catch (error) {
            console.error("Error deleting profile photo:", error);
            alert("❌ Error deleting profile photo. Please try again.");
        }
    };

    const handleUploadPhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setUploadError(
                "File size exceeds 5MB. Please upload a smaller file.",
            );
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${API_URL}/api/users/${user.id}/uploadProfilePhoto`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                },
            );

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("✅ Photo uploaded, updated user:", updatedUser);
                setUser(updatedUser);
                setUploadError("");
                window.location.reload();
            } else if (response.status === 413) {
                setUploadError("❌ File size too large. Max allowed is 5MB.");
            } else {
                setUploadError("❌ Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error uploading photo:", error);
            setUploadError("❌ Error uploading photo. Please try again.");
        }
    };

    const generateGradient = (name) => {
        if (!name) return "#f50057";

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 3) % 360}, 70%, 60%)`;

        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
        }
    }, [user]);

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        setIsUpdated(
            event.target.value !== user?.firstName ||
                lastName !== user?.lastName,
        );
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        setIsUpdated(
            firstName !== user?.firstName ||
                event.target.value !== user?.lastName,
        );
    };

    const updateFirstName = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/users/changeFirstName/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ firstName }),
                },
            );

            if (response.ok) {
                console.log(`✅ First name updated to: ${firstName}`);
            } else {
                console.error("❌ Failed to update first name");
                alert("❌ Failed to update first name.");
            }
        } catch (error) {
            console.error("❌ Error updating first name:", error);
            alert("❌ Error updating first name. Please try again.");
        }
    };

    const updateLastName = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/users/changeLastName/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ lastName }),
                },
            );

            if (response.ok) {
                console.log(`✅ Last name updated to: ${lastName}`);
            } else {
                console.error("❌ Failed to update last name");
                alert("❌ Failed to update last name.");
            }
        } catch (error) {
            console.error("❌ Error updating last name:", error);
            alert("❌ Error updating last name. Please try again.");
        }
    };

    const handleUpdateProfile = async () => {
        if (firstName !== user.firstName) await updateFirstName();
        if (lastName !== user.lastName) await updateLastName();

        fetchUserSession();
        setIsUpdated(false);
    };

    if (isPageLoading) return <Loading />;
    return (
        <div className={styles.container}>
            <div className={styles.profileLeftSection}>
                <div className={styles.profileNavbarLeft}>
                    <h1>{selectedNav}</h1>
                    <p
                        onClick={() => setSelectedNav("Dashboard")}
                        className={
                            selectedNav === "Dashboard" ? styles.active : ""
                        }
                    >
                        Dashboard
                    </p>
                    <p
                        onClick={() => setSelectedNav("My Likes")}
                        className={
                            selectedNav === "My Likes" ? styles.active : ""
                        }
                    >
                        My Likes
                    </p>
                    <p
                        onClick={() => setSelectedNav("Settings")}
                        className={
                            selectedNav === "Settings" ? styles.active : ""
                        }
                    >
                        Settings
                    </p>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.profileRightSection}>
                <div className={styles.profileNavbarRight}>
                    <div className={styles.dashboardHeader}>
                        {selectedNav === "Dashboard" && (
                            <div className={styles.dashboard}>
                                <div className={styles.dashboardHeaderContent}>
                                    <div className={styles.dashboardWrapper}>
                                        <div
                                            className={
                                                styles.dashboardWrapperHeader
                                            }
                                        >
                                            <Avatar
                                                ref={anchorRef}
                                                sx={{
                                                    background:
                                                        user?.profilePhoto
                                                            ? "transparent"
                                                            : generateGradient(
                                                                  user?.firstName +
                                                                      (user?.lastName ||
                                                                          ""),
                                                              ),
                                                    cursor: "pointer",
                                                    color: "#fff",
                                                    width: 100,
                                                    height: 100,
                                                    border: "1px solid black",
                                                }}
                                                src={
                                                    user?.profilePhoto ||
                                                    undefined
                                                }
                                            >
                                                {!user?.profilePhoto && (
                                                    <>
                                                        {user?.firstName?.charAt(
                                                            0,
                                                        )}
                                                        {user?.lastName
                                                            ? user?.lastName.charAt(
                                                                  0,
                                                              )
                                                            : ""}
                                                    </>
                                                )}
                                            </Avatar>
                                            <h1>
                                                Welcome Back,{" "}
                                                {user?.firstName || ""}
                                            </h1>
                                        </div>
                                        <div
                                            className={styles.dashboardContent}
                                        >
                                            <div
                                                className={
                                                    styles.dashboardContentTop
                                                }
                                            >
                                                <TextField
                                                    disabled
                                                    label="First Name"
                                                    value={
                                                        user?.firstName || ""
                                                    }
                                                    id="firstName"
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                                <TextField
                                                    disabled
                                                    label="Last Name"
                                                    value={user?.lastName || ""}
                                                    id="lastName"
                                                    size="small"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </div>

                                            <TextField
                                                disabled
                                                label="Email"
                                                value={user?.email || ""}
                                                id="email"
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                            <TextField
                                                disabled
                                                label="Password"
                                                value="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                                id="password"
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.profileMessaging}>
                                        <p>My Messages</p>

                                        {user?.messages?.length === 0 ||
                                        !user?.messages ? (
                                            <div className={styles.noMessages}>
                                                <img
                                                    src="/icons/no_messages.png"
                                                    alt="No messages"
                                                />
                                                <p>
                                                    No messages found, check
                                                    back later.
                                                </p>
                                            </div>
                                        ) : (
                                            <ul>
                                                {user?.messages?.map(
                                                    (message, index) => (
                                                        <li key={index}>
                                                            {message}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.profileMatches}>
                                    <p>My Matches</p>

                                    {user?.matches?.length === 0 ||
                                    !user?.matches ? (
                                        <div className={styles.noMatches}>
                                            <img
                                                src="/icons/no_matches.png"
                                                alt="No matches"
                                            />
                                            <p>
                                                No matches found, keep swiping!
                                            </p>
                                        </div>
                                    ) : (
                                        <ul>
                                            {user?.matches?.map(
                                                (matches, index) => (
                                                    <li key={index}>
                                                        {matches}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {selectedNav === "My Likes" && (
                        <div className={styles.likesContent}>
                            <div className={styles.likesNavbar}>
                                <p
                                    onClick={() => setSelectedLikes("My Likes")}
                                    className={
                                        selectedLikes === "My Likes"
                                            ? styles.likesActive
                                            : ""
                                    }
                                >
                                    My Likes
                                </p>

                                <div
                                    className={styles.likesNavbarDivider}
                                ></div>

                                <p
                                    onClick={() =>
                                        setSelectedLikes("Super Likes")
                                    }
                                    className={
                                        selectedLikes === "Super Likes"
                                            ? styles.likesActive
                                            : ""
                                    }
                                >
                                    Super Likes
                                </p>
                            </div>
                            <div className={styles.likesContent}>
                                {selectedLikes === "My Likes" && (
                                    <div>
                                        {user?.likes?.length > 0 ? (
                                            <ul>
                                                {user.likes.map(
                                                    (like, index) => (
                                                        <li key={index}>
                                                            {like}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p>No likes found.</p>
                                        )}
                                    </div>
                                )}

                                {selectedLikes === "Super Likes" && (
                                    <div>
                                        {user?.superLikes?.length > 0 ? (
                                            <ul>
                                                {user.superLikes.map(
                                                    (superLike, index) => (
                                                        <li key={index}>
                                                            {superLike}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p>No super likes found.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedNav === "Settings" && (
                        <div className={styles.settingsWrapper}>
                            <div className={styles.dashboardWrapperHeader}>
                                <Avatar
                                    ref={anchorRef}
                                    sx={{
                                        background: user?.profilePhoto
                                            ? "transparent"
                                            : generateGradient(
                                                  user?.firstName +
                                                      (user?.lastName || ""),
                                              ),
                                        cursor: "pointer",
                                        color: "#fff",
                                        width: 100,
                                        height: 100,
                                        border: "1px solid black",
                                    }}
                                    src={user?.profilePhoto || undefined}
                                >
                                    {!user?.profilePhoto && (
                                        <>
                                            {user?.firstName?.charAt(0)}
                                            {user?.lastName
                                                ? user?.lastName.charAt(0)
                                                : ""}
                                        </>
                                    )}
                                </Avatar>

                                <div
                                    className={
                                        styles.settingsChangeProfilePhoto
                                    }
                                >
                                    <div
                                        className={
                                            styles.settingsChangePhotoButtons
                                        }
                                    >
                                        <input
                                            type="file"
                                            accept=".png, .jpg, .jpeg"
                                            onChange={handleUploadPhoto}
                                            style={{ display: "none" }}
                                            id="upload-photo"
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "upload-photo",
                                                    )
                                                    .click()
                                            }
                                        >
                                            Upload Photo
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="outlined"
                                            color="error"
                                            disabled={!user?.profilePhoto}
                                            onClick={handleOpen}
                                        >
                                            Delete Photo
                                        </Button>
                                        <Modal
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="modal-modal-title"
                                            aria-describedby="modal-modal-description"
                                        >
                                            <Box sx={style}>
                                                <Typography
                                                    id="modal-modal-title"
                                                    variant="h6"
                                                    component="h2"
                                                >
                                                    Are you sure you want to
                                                    delete your profile photo?
                                                </Typography>
                                                <Typography
                                                    id="modal-modal-description"
                                                    sx={{ mt: 2 }}
                                                >
                                                    The photo will be
                                                    permanently deleted and
                                                    cannot be recovered.
                                                </Typography>
                                                <Button
                                                    type="submit"
                                                    variant="outlined"
                                                    color="error"
                                                    sx="margin-top: 20px"
                                                    onClick={() => {
                                                        handleDeletePhoto();
                                                        handleClose();
                                                    }}
                                                >
                                                    Yes, I&apos;m Sure
                                                </Button>
                                            </Box>
                                        </Modal>
                                    </div>

                                    <div className={styles.settingsUploadError}>
                                        {uploadError && (
                                            <p
                                                style={{
                                                    color: "red",
                                                    marginTop: "10px",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                {uploadError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.dashboardContent}>
                                <div className={styles.dashboardContentTop}>
                                    <TextField
                                        label="First Name"
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        id="firstName"
                                        size="small"
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        id="lastName"
                                        size="small"
                                    />
                                </div>

                                <TextField
                                    disabled
                                    label="Email"
                                    value={user?.email || ""}
                                    id="email"
                                    size="small"
                                />
                                <TextField
                                    disabled
                                    label="Password"
                                    value="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    id="password"
                                    size="small"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateProfile}
                                    disabled={!isUpdated}
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
