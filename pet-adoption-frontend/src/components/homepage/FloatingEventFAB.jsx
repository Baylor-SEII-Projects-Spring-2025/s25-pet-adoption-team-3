import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Fab from "@mui/material/Fab";
import EventIcon from "@mui/icons-material/Event";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";

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
    const [showDot, setShowDot] = useState(false);
    const router = useRouter();

    const fetchNearbyEvents = async () => {
        setOpen(true);
    };

    useEffect(() => {
        const preloadEvents = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/event/get-nearby-events`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const text = await res.text();
                const data = text ? JSON.parse(text) : [];

                setEvents(data || []);

                console.log(data);

                const today = dayjs().format("YYYY-MM-DD");
                const hasTodayEvent = data?.some(
                    (event) =>
                        event.registered &&
                        dayjs(event.startDate).format("YYYY-MM-DD") === today,
                );
                setShowDot(hasTodayEvent);
            } catch (err) {
                console.error("Error preloading nearby events:", err);
            }
        };

        preloadEvents();
    }, []);

    const handleNavigate = (eventId) => {
        router.push(`/view-event/${eventId}`);
    };

    return (
        <>
            <Badge
                color="error"
                variant="dot"
                overlap="circular"
                invisible={!showDot}
                sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
            >
                <Fab
                    color="primary"
                    aria-label="nearby-events"
                    onClick={fetchNearbyEvents}
                >
                    <EventIcon />
                </Fab>
            </Badge>

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
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        flexWrap="wrap"
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            {event.title} -{" "}
                                            {event.adoptionCenter}
                                        </Typography>
                                        {event.registered && (
                                            <Box
                                                sx={{
                                                    bgcolor: "#5fe63d",
                                                    color: "white",
                                                    px: 1.5,
                                                    py: 0.4,
                                                    borderRadius: 1,
                                                    fontSize: "0.75rem",
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Registered
                                            </Box>
                                        )}
                                    </Stack>
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
