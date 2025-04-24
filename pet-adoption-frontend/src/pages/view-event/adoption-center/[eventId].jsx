import React from "react";
import { useRouter } from "next/router";
import EventInfoComponent from "@/components/event-info/EventInfoComponent";
import AdoptionCenterNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function EventInfoPage() {
    const router = useRouter();
    const { eventId } = router.query;

    return (
        <>
            <AdoptionCenterNavbar />
            <EventInfoComponent eventId={eventId} />
        </>
    );
}
