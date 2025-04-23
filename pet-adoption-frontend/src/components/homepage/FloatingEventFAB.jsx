import React, { useState } from "react";
import { useRouter } from "next/router";
import Fab from "@mui/material/Fab";
import EventIcon from "@mui/icons-material/Event";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxHeight: "80vh",
    overflowY: "auto",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function FloatingEventFAB() {
    const [open, setOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const router = useRouter();

    const fetchNearbyEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/event/get-nearby-events`, {
                method: "GET",
                credentials: "include",
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : [];

            setEvents(data || []);
            console.log("Nearby events:", data);
            setOpen(true);
        } catch (err) {
            console.error("Error fetching nearby events:", err);
        }
    };

    const handleNavigate = (eventId) => {
        router.push(`/view-event/${eventId}`);
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="nearby-events"
                onClick={fetchNearbyEvents}
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                }}
            >
                <EventIcon />
            </Fab>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Nearby Events
                    </Typography>
                    {events.length === 0 ? (
                        <Typography>No nearby events found.</Typography>
                    ) : (
                        <Stack spacing={2}>
                            {events.map((event) => (
                                <Paper
                                    key={event.id}
                                    elevation={3}
                                    onClick={() => handleNavigate(event.id)}
                                    sx={{
                                        p: 2,
                                        cursor: "pointer",
                                        borderRadius: 2,
                                        transition: "transform 0.2s",
                                        ":hover": {
                                            transform: "scale(1.02)",
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <img
                                        src={
                                            event.image ||
                                            "/images/no_image_available.png"
                                        }
                                        alt={event.title}
                                        style={{
                                            width: "100%",
                                            height: 160,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                    >
                                        {event.title} - {event.adoptionCenter}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {dayjs(event.startDate).format(
                                            "MMMM D, YYYY",
                                        )}{" "}
                                        to{" "}
                                        {dayjs(event.endDate).format(
                                            "MMMM D, YYYY",
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {event.description ||
                                            "No description provided."}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Modal>
        </>
    );
}
