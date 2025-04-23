import React from "react";
import { useRouter } from "next/router";
import EventInfoComponent from "@/components/event-info/EventInfoComponent";
import EventInfoNavbar from "@/components/event-info/EventInfoNavbar";

export default function EventInfoPage() {
    const router = useRouter();
    const { eventId } = router.query;

    return (
        <>
            <EventInfoNavbar />
            <EventInfoComponent eventId={eventId} />
        </>
    );
}
