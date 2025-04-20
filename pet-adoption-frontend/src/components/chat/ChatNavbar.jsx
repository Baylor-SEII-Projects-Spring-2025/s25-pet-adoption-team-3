import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "@/styles/ChatNavbar.module.css";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

export default function ChatNavbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const Router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchUserSession = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                Router.push("/login");
                console.warn("No active session.");
                return;
            }

            const data = await response.json();
            console.log("✅ Session found:", data);
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
    }, []);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error logging out");
            }

            console.log("✅ Logged out");
            Router.push("/");
            setUser(null);
            setOpen(false);
        } catch (error) {
            console.error("Error logging out:", error);
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

        const roleLinks = {
            ADOPTION_CENTER: {
                dashboard: "/adoption-center/dashboard",
                profile: "/adoption-center/dashboard",
                settings: "/adoption-center/dashboard",
            },
            ADOPTER: {
                dashboard: "/profile",
                profile: "/profile",
                settings: "/profile",
            },
        };

        const links = user
            ? roleLinks[user.role] || roleLinks["default"]
            : roleLinks["default"];

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Link href="/">
                    <img
                        src="/logos/adopt_logo_black_text.png"
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
                    <div style={{ position: "relative" }}>
                        <div className={styles.profileItems}>
                            <Avatar
                                ref={anchorRef}
                                sx={{
                                    background: user.profilePhoto
                                        ? "transparent"
                                        : generateGradient(
                                              user.firstName +
                                                  (user.lastName || ""),
                                          ),
                                    cursor: "pointer",
                                    color: "#fff",
                                }}
                                src={user.profilePhoto || undefined}
                                onClick={handleToggle}
                            >
                                {!user.picture &&
                                    user.role != "ADOPTION_CENTER" && (
                                        <>
                                            {user.firstName.charAt(0)}
                                            {user.lastName
                                                ? user.lastName.charAt(0)
                                                : ""}
                                        </>
                                    )}
                            </Avatar>

                            <img
                                src="/icons/profile_expand_arrow.png"
                                alt="Expand"
                                style={{
                                    cursor: "pointer",
                                    marginLeft: "3px",
                                    width: "15px",
                                    marginRight: "10px",
                                }}
                                onClick={handleToggle}
                            />
                        </div>

                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                            style={{
                                zIndex: 10000,
                            }}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: "left top" }}
                                >
                                    <Paper>
                                        <ClickAwayListener
                                            onClickAway={handleClose}
                                        >
                                            <MenuList autoFocusItem={open}>
                                                <MenuItem onClick={handleClose}>
                                                    <Link
                                                        href={links.profile}
                                                        className={
                                                            styles.navbarLink
                                                        }
                                                    >
                                                        Dashboard
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    <Link
                                                        href={links.profile}
                                                        className={
                                                            styles.navbarLink
                                                        }
                                                    >
                                                        My Likes
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem onClick={handleClose}>
                                                    <Link
                                                        href={links.profile}
                                                        className={
                                                            styles.navbarLink
                                                        }
                                                    >
                                                        Settings
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={handleLogout}
                                                    className={
                                                        styles.navbarLink
                                                    }
                                                >
                                                    Logout
                                                </MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                ) : (
                    <Link href="/login" className={styles.loginButton}>
                        Log In
                    </Link>
                )}
            </div>
        </nav>
    );
}
