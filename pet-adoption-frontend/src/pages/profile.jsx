import React from "react";
import ProfileComponent from "@/components/profile/ProfileComponent";
import ProfileNavbar from "@/components/profile/ProfileNavbar";

export default function Profile() {
    return (
        <>
            <ProfileNavbar />
            <ProfileComponent />
        </>
    );
}