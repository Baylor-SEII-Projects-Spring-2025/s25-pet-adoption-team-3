import React from "react";
import { useRouter } from "next/router";
import EditEventComponent from "@/components/event-info/EditEventComponent";
import AdoptionCenterNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function EventInfoPage() {
    const router = useRouter();
    const { eventId } = router.query;

    return (
        <>
            <AdoptionCenterNavbar />
            <EditEventComponent eventId={eventId} />
        </>
    );
}
