import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "@/styles/NavbarHome.module.css";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const anchorRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const clientRef = useRef(null);

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
                console.warn("No active session.");
                return;
            }

            if (!response.ok) {
                throw new Error("Error fetching session");
            }

            const data = await response.json();
            setUser(data.user);
            fetchUnreadCount();
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await fetch(`${API_URL}/api/chat/unread-count`, {
                method: "GET",
                credentials: "include",
            });

            if (res.ok) {
                const count = await res.json();
                setUnreadCount(count);
            }
        } catch (err) {
            console.error("Failed to fetch unread count:", err);
        }
    };

    useEffect(() => {
        if (!user) return;

        const socket = new SockJS(`${API_URL}/ws-chat`);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe("/topic/messages", (msg) => {
                    const incoming = JSON.parse(msg.body);
                    if (String(incoming.recipientId) === String(user.id)) {
                        setUnreadCount((prev) => prev + 1);
                    }
                });
            },
        });

        clientRef.current = client;
        client.activate();

        return () => {
            client.deactivate();
        };
    }, [user]);

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
            messages: "/chat",
        },
        ADOPTER: {
            dashboard: "/profile",
            profile: "/profile",
            settings: "/profile",
            messages: "/chat",
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
                                {!user.profilePhoto &&
                                    user.role != "ADOPTION_CENTER" && (
                                        <>
                                            {user.firstName.charAt(0)}
                                            {user.lastName
                                                ? user.lastName.charAt(0)
                                                : ""}
                                        </>
                                    )}
                            </Avatar>

                            {unreadCount > 0 && (
                                <span className={styles.notificationCount}>
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}

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
                                zIndex: 100000,
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
                                                        href={links.messages}
                                                        className={
                                                            styles.navbarLink
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.messageWithDot
                                                            }
                                                        >
                                                            My Messages
                                                            {unreadCount >
                                                                0 && (
                                                                <span
                                                                    className={
                                                                        styles.notificationDot
                                                                    }
                                                                ></span>
                                                            )}
                                                        </span>
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
