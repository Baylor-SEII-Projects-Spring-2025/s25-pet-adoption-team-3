import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    TextField,
    Button,
    Snackbar,
    Alert,
    Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import Router from "next/router";
import styles from "@/styles/EventInfoComponent.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditEventComponent({ eventId }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [user, setUser] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/session`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (response.status === 401) {
                    Router.push("/login");
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

                if (typeof data === "string" && data === "Event not found.") {
                    setError("Event not found.");
                } else {
                    setEvent({
                        ...data,
                        startDate: dayjs(data.startDate),
                        endDate: dayjs(data.endDate),
                    });
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

    const handleSubmit = async (e) => {
        setSubmitLoading(true);
        e.preventDefault();
        try {
            const res = await fetch(
                `${API_URL}/api/event/edit-event?adoptionCenterID=${user.id}&eventID=${event.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image: event.image,
                        title: event.title,
                        description: event.description,
                        startDate: event.startDate.format("YYYY-MM-DD"),
                        endDate: event.endDate.format("YYYY-MM-DD"),
                    }),
                },
            );

            const message = await res.text();

            setSnackbar({
                open: true,
                message,
                severity: res.ok ? "success" : "error",
            });

            if (res.ok) {
                setTimeout(() => Router.push(`/view-event/${event.id}`), 2000);
            }
        } catch (err) {
            console.error("Failed to edit event:", err);
            setSnackbar({
                open: true,
                message: "Failed to edit event.",
                severity: "error",
            });
        } finally {
            setSubmitLoading(false);
        }

    };

    if (loading) {
        return (
            <Box className={styles.loadingContainer}>
                <CircularProgress />
                <Typography>Loading event details...</Typography>
            </Box>
        );
    }

    const formValid =
        event?.title?.trim() &&
        event?.description?.trim() &&
        dayjs(event.startDate).isValid() &&
        dayjs(event.endDate).isValid();


    if (error) {
        return <Typography className={styles.errorText}>{error}</Typography>;
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box className={styles.eventContainer}>
                <Typography variant="h4" fontWeight="bold" mb={3}>
                    Edit Event
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={event.title}
                            onChange={(e) =>
                                setEvent({ ...event, title: e.target.value })
                            }
                            required
                        />
                    </Box>

                    <Box mb={3}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            minRows={4}
                            value={event.description}
                            onChange={(e) =>
                                setEvent({
                                    ...event,
                                    description: e.target.value,
                                })
                            }
                            required
                        />
                    </Box>

                    <Box mb={3}>
                        <DatePicker
                            label="Start Date"
                            value={event.startDate}
                            onChange={(newDate) =>
                                setEvent({ ...event, startDate: newDate })
                            }
                            shouldDisableDate={(date) => date.isBefore(dayjs())}
                            renderInput={(params) => (
                                <TextField fullWidth required {...params} />
                            )}
                        />
                    </Box>

                    <Box mb={3}>
                        <DatePicker
                            label="End Date"
                            value={event.endDate}
                            onChange={(newDate) =>
                                setEvent({ ...event, endDate: newDate })
                            }
                            shouldDisableDate={(date) => date.isBefore(dayjs())}
                            renderInput={(params) => (
                                <TextField fullWidth required {...params} />
                            )}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!formValid}
                        startIcon={
                            submitLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : null
                        }
                    >
                        Save Changes
                    </Button>
                </form>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={() =>
                            setSnackbar({ ...snackbar, open: false })
                        }
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </LocalizationProvider>
    );
}

EditEventComponent.propTypes = {
    eventId: PropTypes.string.isRequired,
};
