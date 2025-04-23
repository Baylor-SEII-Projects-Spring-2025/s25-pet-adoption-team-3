import React, { useEffect, useState } from "react";
import styles from "@/styles/EventInfoComponent.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EventInfoComponent({ eventId }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            <h1 className={styles.eventTitle}>{event.title}</h1>
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
        </div>
    );
}

EventInfoComponent.propTypes = {
    eventId: PropTypes.string.isRequired,
};
