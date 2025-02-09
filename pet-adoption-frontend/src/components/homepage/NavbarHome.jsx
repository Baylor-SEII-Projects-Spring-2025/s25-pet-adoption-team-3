import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/NavbarHome.module.css";

export default function Navbar() {
    const [user, setUser] = useState(null);

const fetchUserSession = async () => {
    try {
        const response = await fetch("http://localhost:8080/auth/session", {
            method: "GET",
            credentials: "include", // ✅ Required for session persistence
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401) {
            console.warn("No active session.");
            return; // ✅ No session, just exit
        }

        if (!response.ok) {
            throw new Error("Error fetching session");
        }

        const data = await response.json();
        console.log("✅ Session found:", data);
        setUser(data);
    } catch (error) {
        console.error("Error fetching session:", error);
    }
};

useEffect(() => {
    fetchUserSession();
}, []);



    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <img
                        src="/logos/adopt_logo_white_text.png"
                        alt="Adopt, Don't Shop Logo"
                    />
                </Link>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/learn">Learn</Link>
                </li>
                <li>
                    <Link href="/locations">Locations</Link>
                </li>
                <li>
                    <Link href="/gallery">Gallery</Link>
                </li>
            </ul>
            <div className={styles.auth}>
                {user ? (
                    <Link href="/profile" className={styles.loginButton}>
                        Hello, {user.user}
                    </Link>
                ) : (
                    <Link href="/login" className={styles.loginButton}>
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
}
