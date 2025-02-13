import React, { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Router from "next/router";
import styles from "@/styles/ProfileDashboardComponent.module.css";

export default function ProfileDashboardComponent() {
    const [selectedNav, setSelectedNav] = useState("Dashboard");
    const [user, setUser] = useState(null);
    const anchorRef = useRef(null);

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
                Router.push("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Error fetching session");
            }

            const data = await response.json();
            console.log("✅ Session found:", data);
            setUser(data.user);

            console.log("user: " + user);
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        fetchUserSession();
    }, []);

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
                        )}
                        <h1>Welcome Back, {user?.firstName || ""}</h1>
                    </div>
                    <div className={styles.dashboardContent}>
                        <div className={styles.dashboardContentTop}>
                            <TextField
                                disabled
                                label="First Name"
                                value={user?.firstName || ""}
                                id="firstName"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                disabled
                                label="Last Name"
                                value={user?.lastName || ""}
                                id="lastName"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <TextField
                            disabled
                            label="Email"
                            value={user?.email || ""}
                            id="email"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            disabled
                            label="Password"
                            value="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            id="password"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>

                    {selectedNav === "My Likes" && <h1>My Likes</h1>}
                    {selectedNav === "Settings" && <h1>Settings</h1>}
                </div>
            </div>
        </div>
    );
}
