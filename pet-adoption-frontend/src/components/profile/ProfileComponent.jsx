import React, { useState } from "react";
import styles from "@/styles/ProfileDashboardComponent.module.css";

export default function ProfileDashboardComponent() {
    const [selectedNav, setSelectedNav] = useState("dashboard");

    return (
        <div className={styles.container}>
            <div className={styles.profileLeftSection}>
                <div className={styles.profileNavbarLeft}>
                    <h1>{selectedNav}</h1>
                    <p
                        onClick={() => setSelectedNav("Dashboard")}
                        className={selectedNav === "Dashboard" ? styles.active : ""}
                    >
                        Dashboard
                    </p>
                    <p
                        onClick={() => setSelectedNav("My Likes")}
                        className={selectedNav === "My Likes" ? styles.active : ""}
                    >
                        My Likes
                    </p>
                    <p
                        onClick={() => setSelectedNav("Settings")}
                        className={selectedNav === "Settings" ? styles.active : ""}
                    >
                        Settings
                    </p>
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.profileRightSection}>
                <div className={styles.profileNavbarRight}>
                    {selectedNav === "Dashboard" && <h1>Dashboard</h1>}
                    {selectedNav === "My Likes" && <h1>My Likes</h1>}
                    {selectedNav === "Settings" && <h1>Settings</h1>}
                </div>
            </div>
        </div>
    );
}
