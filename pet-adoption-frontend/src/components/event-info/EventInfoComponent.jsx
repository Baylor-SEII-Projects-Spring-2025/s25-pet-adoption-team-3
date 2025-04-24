import React, { useEffect, useState } from "react";
import styles from "@/styles/EventInfoComponent.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import Router from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EventInfoComponent({ eventId }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [user, setUser] = useState(null);

    useEffect(() => {
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
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching session:", error);
            }
        };
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (!eventId) return;

        const fetchEvent = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/event/get-event/${eventId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const data = await res.json();
                console.log("Event data:", data);

                if (typeof data === "string" && data === "Event not found.") {
                    setError("Event not found.");
                } else {
                    setEvent(data);
                }
            } catch (err) {
                console.error("Failed to fetch event:", err);
                setError("Failed to load event data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleRegister = async () => {
        try {
            const res = await fetch(
                `${API_URL}/api/event/register-to-event/${eventId}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            const message = await res.text();

            setSnackbar({
                open: true,
                message,
                severity: res.ok ? "success" : "error",
            });
        } catch (err) {
            console.error("Failed to register:", err);
            setSnackbar({
                open: true,
                message: "Failed to register for event.",
                severity: "error",
            });
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress />
                <p>Loading event details...</p>
            </div>
        );
    }

    if (error) {
        return <p className={styles.errorText}>{error}</p>;
    }

    return (
        <div className={styles.eventContainer}>
            <div className={styles.titleRow}>
                <h1 className={styles.eventTitle}>{event.title}</h1>
                {user?.role === "ADOPTION_CENTER" ? null : event.registered ? (
                    <div
                        style={{
                            backgroundColor: "#5fe63d",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            marginLeft: "auto",
                        }}
                    >
                        Registered
                    </div>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        sx={{
                            ml: "auto",
                            width: "fit-content",
                        }}
                    >
                        Register for this Event
                    </Button>
                )}
                {user?.role === "ADOPTION_CENTER" && (
                    <div className={styles.editDeleteBtnGroup}>
                        <button
                            className={styles.editBtn}
                            onClick={() =>
                                Router.push(`/view-event/adoption-center/edit-event/${event.id}`)
                            }
                        >
                            Edit Event
                        </button>
                        <button
                            className={styles.deleteBtn}
                            onClick={async () => {
                                if (
                                    !confirm(
                                        "Are you sure you want to delete this event?",
                                    )
                                )
                                    return;
                                try {
                                    const res = await fetch(
                                        `${API_URL}/api/event/delete-event?eventId=${event.id}&adoptionCenterId=${user.id}`,
                                        {
                                            method: "DELETE",
                                            credentials: "include",
                                        },
                                    );
                                    const message = await res.text();
                                    setSnackbar({
                                        open: true,
                                        message,
                                        severity: res.ok ? "success" : "error",
                                    });
                                    if (res.ok) {
                                        setTimeout(
                                            () =>
                                                Router.push(
                                                    "/adoption-center/dashboard",
                                                ),
                                            2000,
                                        );
                                    }
                                } catch (err) {
                                    console.error(
                                        "Failed to delete event:",
                                        err,
                                    );
                                    setSnackbar({
                                        open: true,
                                        message: "Failed to delete event.",
                                        severity: "error",
                                    });
                                }
                            }}
                        >
                            Delete Event
                        </button>
                    </div>
                )}
            </div>

            <img
                src={event.image || "/images/no_image_available.png"}
                alt={event.title}
                className={styles.eventImage}
            />
            <p className={styles.eventDescription}>{event.description}</p>
            <p className={styles.eventDate}>
                Start Date: {dayjs(event.startDate).format("MMMM D, YYYY")}
                <br />
                End Date: {dayjs(event.endDate).format("MMMM D, YYYY")}
            </p>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}

EventInfoComponent.propTypes = {
    eventId: PropTypes.string.isRequired,
};
