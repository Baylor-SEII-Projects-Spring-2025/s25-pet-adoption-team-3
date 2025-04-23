/**
 * View Pet Page
 * -----------------------------------------------------------
 * This page displays a detailed profile for a specific pet, as seen
 * by adopters browsing or viewing their liked pets.
 *
 * Main Features:
 *  - Renders the ProfileNavbar for authenticated user navigation
 *  - Fetches pet details using petId from the route and checks user session
 *  - Displays loading and error states with skeletons and messages
 *  - Renders the ViewPetComponent with all pet info if data is found
 *  - Handles route-level data validation and error fallback
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProfileNavbar from "@/components/profile/ProfileNavbar";
import ViewPetComponent from "../../components/view-pet/ViewPetComponent";
import ViewPetSkeleton from "@/components/loading/ViewPetSkeleton";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ViewPetPage() {
  const router = useRouter();
  const { petId } = router.query;

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const checkSessionAndFetchPet = async () => {
      try {
        const sessionRes = await fetch(`${API_URL}/auth/session`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (sessionRes.status === 401) {
          router.replace("/login");
          return;
        }
      } catch {
        setError("Failed to check authentication.");
        setLoading(false);
        return;
      }

      if (!petId) {
        return;
      }

      console.log("Fetching pet with ID:", petId);

      try {
        const res = await fetch(`${API_URL}/api/pet/get-pet-detail/${petId}`, {
          credentials: "include",
        });

        const contentType = res.headers.get("content-type");
        const raw = await res.text();

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

    checkSessionAndFetchPet();
  }, [router.isReady, petId]);

  return (
    <>
      <ProfileNavbar />
      {loading ? (
        <ViewPetSkeleton />
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
