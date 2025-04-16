import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileNavbar from "@/components/profile/ProfileNavbar";
import ViewPetComponent from "../../components/view-pet/ViewPetComponent";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ViewPetPage() {
  const router = useRouter();
  const { petId } = router.query;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) {
      console.log("Router not ready yet.");
      return;
    }

    console.log("Router ready. petId is:", petId);

    if (!petId) {
      console.log("No petId found.");
      return;
    }

    const fetchPet = async () => {
      console.log("Fetching pet with ID:", petId);

      try {
        const res = await fetch(`${API_URL}/api/pet/get-pet-detail/${petId}`, {
          credentials: "include",
        });

        const contentType = res.headers.get("content-type");
        const raw = await res.text();
        console.log("Fetch status:", res.status);
        console.log("Raw response:", raw);

        if (!res.ok) {
          setError(`HTTP error: ${res.status}`);
          return;
        }

        if (contentType && contentType.includes("application/json")) {
          const data = JSON.parse(raw);

          // Add placeholder values if missing
          if (!data.location) data.location = "placeholder";
          if (!data.adoptionCenterName) {
            data.adoptionCenterName = data.adoptionCenter?.name || "Happy Paws Rescue";
          }

          console.log("Parsed pet data:", data);
          setPet(data);
        } else {
          setError("Unexpected format from server");
        }
      } catch (err) {
        console.error("Fetch or parse error:", err);
        setError("Error loading pet");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [router.isReady, petId]);

  return (
    <>
      <ProfileNavbar />
      {loading ? (
        <div style={{ padding: "2rem" }}>Loading...</div>
      ) : error ? (
        <div style={{ padding: "2rem", color: "red" }}>{error}</div>
      ) : pet ? (
        <ViewPetComponent pet={pet} />
      ) : (
        <div style={{ padding: "2rem" }}>Pet not found</div>
      )}
    </>
  );
}
