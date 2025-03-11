import React from "react";
import AdoptionCenterDashboardComponent from "@/components/adoption-center/AdoptionCenterDashboardComponent";
import AdoptionCenterNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function dashboard() {
    return (
        <>
            <AdoptionCenterNavbar />
            <AdoptionCenterDashboardComponent />
        </>
    );
}
