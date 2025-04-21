import React from "react";
import { useRouter } from "next/router";
import PetInfoComponent from "@/components/pet-info/PetInfoComponent";
import AdoptionNavbar from "@/components/adoption-center/AdoptionNavbar";

export default function PetInfoPage() {
    const router = useRouter();
    const { petUUID } = router.query;

    return (
        <>
            <AdoptionNavbar />
            <PetInfoComponent petUUID={petUUID} />
        </>
    );
}
