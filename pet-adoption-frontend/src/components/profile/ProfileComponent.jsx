import React, { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Router from "next/router";
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

export default function ProfileDashboardComponent() {
    const [selectedNav, setSelectedNav] = useState("Dashboard");
    const [selectedLikes, setSelectedLikes] = useState("My Likes");
    const [user, setUser] = useState(null);
    const anchorRef = useRef(null);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const fetchUserSession = async () => {
        try {
            const response = await fetch("http://localhost:8080/auth/session", {
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

            if (!response.ok) {
                throw new Error("Error fetching session");
            }

            const data = await response.json();
            console.log("✅ Session refreshed:", data);
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

    const handleDeletePhoto = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/users/deleteProfilePhoto/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 400) {
                // Correct way to check for bad request
                console.log("User not found");
                return;
            }

            if (response.ok) {
                console.log("✅ Profile photo deleted successfully");
            } else {
                console.error("Failed to delete profile photo");
            }
        } catch (error) {
            console.error("Error deleting profile photo:", error);
        }
    };

    const handleUploadPhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `http://localhost:8080/api/users/${user.id}/uploadProfilePhoto`,
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
            } else {
                console.error("❌ Upload failed");
            }
        } catch (error) {
            console.error("❌ Error uploading photo:", error);
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
                                                .getElementById("upload-photo")
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
                                                Are you sure you want to delete
                                                your profile photo?
                                            </Typography>
                                            <Typography
                                                id="modal-modal-description"
                                                sx={{ mt: 2 }}
                                            >
                                                The photo will be permanently
                                                deleted and cannot be recovered.
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
                            </div>
                            <div className={styles.dashboardContent}>
                                <div className={styles.dashboardContentTop}>
                                    <TextField
                                        label="First Name"
                                        value={user?.firstName || ""}
                                        id="firstName"
                                        size="small"
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={user?.lastName || ""}
                                        id="lastName"
                                        size="small"
                                    />
                                </div>

                                <TextField
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
