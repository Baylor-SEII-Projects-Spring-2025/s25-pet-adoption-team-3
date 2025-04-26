/**
 * AdoptionCenterDashboardComponent
 * -----------------------------------------------------------
 * This component provides the main dashboard for Adoption Center users.
 * It enables adoption centers to manage their profiles, pets, and events,
 * and view messages and matches. The dashboard is divided into four
 * main tabs: Dashboard, My Pets, My Events, and Settings.
 *
 * Main Features:
 *  - Dashboard: Overview section showing center name, messages, and pet matches.
 *  - My Pets: View, search, and manage active or archived pets; add new pets with image and details forms.
 *  - My Events: View, search, and manage current or archived events; add new events with images and details.
 *  - Settings: Edit adoption center profile, upload/delete profile photo, and update details like name, bio, and phone number.
 *  - Includes modal forms for adding pets/events, and advanced search/filtering options.
 *  - Uses Material-UI for form controls and layout.
 *  - Responsive and styled to match the app's overall design.
 *  - Handles user authentication and role-based redirect logic.
 */

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Router from "next/router";
import styles from "@/styles/AdoptionCenterDashboardComponent.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { extractImageFiles } from "@/utils/extractImageFiles";
import { CircularProgress } from "@mui/material";
import Loading from "@/components/adoption-center/Loading";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const petStatuses = [
    "Spayed Female",
    "Unspayed Female",
    "Neutered Male",
    "Unneutered Male",
];

const furTypes = [
    "Short fur",
    "Medium fur",
    "Long fur",
    "Curly fur",
    "Wavy fur",
    "Straight fur",
    "Hairless fur",
    "Double coat fur",
    "Silky fur",
    "Wiry fur",
];

const tailTypes = [
    "Short tail",
    "Docked tail",
    "Bobtail",
    "Curled tail",
    "Straight tail",
    "Plumed tail",
    "Whip-like tail",
    "Kinked tail",
    "Tufted tip tail",
];

const earTypes = [
    "Erect ears",
    "Droopy ears",
    "Semi-erect ears",
    "Folded ears",
    "Floppy ears",
    "Feathered ears",
    "Bat ears",
    "Cropped ears",
    "Tufted ears",
    "Button ears",
];

const bodyTypes = [
    "Lean body",
    "Muscular body",
    "Stocky body",
    "Slender body",
    "Compact body",
    "Elongated body",
    "Cobby body",
    "Athletic body",
    "Heavy - boned body",
];

const initialPetData = {
    images: [null, null, null, null],
    name: "",
    breed: "",
    spayedStatus: "",
    birthdate: "",
    aboutMe: "",
    extra1: "",
    extra2: "",
    extra3: "",
};

const initialEventData = {
    images: [null],
    title: "",
    description: "",
    startDate: "",
    endDate: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfileDashboardComponent() {
    const [selectedNav, setSelectedNav] = useState("Dashboard");
    const [selectedPets, setSelectedPets] = useState("My Pets");
    const [selectedEvents, setSelectedEvents] = useState("My Events");
    const [user, setUser] = useState(null);
    const [uploadError, setUploadError] = useState("");
    const anchorRef = useRef(null);
    const [eventData, setEventData] = useState(initialEventData);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [adoptionCenterName, setAdoptionCenterName] = useState("");
    const [websiteLink, setWebsiteLink] = useState("");
    const [address, setAddress] = useState("");
    const [bio, setBio] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [availablePets, setAvailablePets] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [archivedPets, setArchivedPets] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [myPetsDashboard, setMyPetsDashboard] = useState([]);

    const handleModalOpen = () => {
        setOpenModal(true);
    };
    const handleModalClose = () => {
        setOpenModal(false);
    };

    const fetchUserSession = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/session`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                },
            });

            if (response.status === 401) {
                console.warn("No active session.");
                Router.push("/login");
                return;
            }

            if (!response.ok) {
                alert(
                    "⚠️ Failed to load user session. Please refresh or log in again.",
                );
                throw new Error("Error fetching session");
            }

            const data = await response.json();

            const fetchedUser = data.user;

            if (fetchedUser.role === "ADOPTER") {
                Router.push("/profile");
                return;
            } else if (fetchedUser.role !== "ADOPTION_CENTER") {
                Router.push("/");
                return;
            }

            setUser(fetchedUser);
            setIsPageLoading(false);
        } catch (error) {
            console.error("Error fetching session:", error);
            alert("❌ Error fetching session.");
        }
    };

    const fetchMyPets = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/get-pets-dashboard`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                console.error("Failed to fetch my pets");
                return;
            }

            const data = await response.json();
            console.log("🐶 My pets:", data);
            setMyPetsDashboard(data);
        } catch (error) {
            console.error("Error fetching my pets:", error);
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${API_URL}/api/chat/conversations`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Failed to fetch conversations");
                return;
            }

            const data = await response.json();
            console.log("💬 Conversations:", data);
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    useEffect(() => {
        fetchUserSession();
        fetchMyPets();
        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchArchivedPets = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/adoption-center/archived-pets`,
                    { credentials: "include" },
                );
                if (!response.ok)
                    throw new Error("Failed to fetch archived pets");
                const data = await response.json();
                setArchivedPets(data);
            } catch (err) {
                console.error("Error loading archived pets:", err);
            }
        };

        if (selectedPets === "Archived Pets") {
            fetchArchivedPets();
        }
    }, [selectedPets]);

    //fetch available pets logic
    const fetchAvailablePets = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/pet/get-all-pets/${user.id}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                alert("❌ Failed to fetch pets.");
                throw new Error("Failed to fetch pets");
            }

            const data = await response.json();

            const filteredPets = data.filter(
                (pet) => pet.status === "AVAILABLE",
            );
            setAvailablePets(filteredPets);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    };

    const handleDeletePhoto = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/users/deleteProfilePhoto/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (response.status === 400) {
                return;
            }

            if (response.ok) {
                window.location.reload();
            } else {
                console.error("Failed to delete profile photo");
            }
        } catch (error) {
            console.error("Error deleting profile photo:", error);
            alert("❌ Error deleting profile photo. Please try again.");
        }
    };

    const handleUploadPhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(
                `${API_URL}/api/users/${user.id}/uploadProfilePhoto`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                },
            );

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setUploadError("");
                window.location.reload();
            } else if (response.status === 413) {
                setUploadError("❌ File size too large. Max allowed is 5MB.");
            } else {
                setUploadError("❌ Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("❌ Error uploading photo:", error);
            setUploadError("❌ Error uploading photo. Please try again.");
        }
    };

    const generateGradient = (name) => {
        if (!name) return "#f50057";

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 3) % 360}, 70%, 60%)`;

        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    const [petData, setPetData] = useState({
        images: [null, null, null, null],
        name: "",
        breed: "",
        spayedStatus: "",
        birthdate: "",
        aboutMe: "",
        extra1: "",
        extra2: "",
        extra3: "",
    });

    const handleChange = (e) => {
        setPetData({ ...petData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("❌ File size exceeds 5MB. Please upload a smaller file.");
            return;
        }

        const newImages = [...petData.images];
        newImages[index] = {
            preview: URL.createObjectURL(file),
            file: file,
        };
        setPetData({ ...petData, images: newImages });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (petData.images.filter((img) => img !== null).length !== 4) {
            alert("You must upload exactly 4 images.");
            return;
        }
    };

    const isFormValid = () => {
        return (
            petData.images.every((img) => img !== null) && // All 4 images uploaded
            petData.name.trim() !== "" &&
            petData.breed.trim() !== "" &&
            petData.spayedStatus.trim() !== "" &&
            petData.birthdate.trim() !== "" &&
            petData.aboutMe.trim() !== "" &&
            petData.extra1.trim() !== "" &&
            petData.extra2.trim() !== "" &&
            petData.extra3.trim() !== ""
        );
    };

    const handleAddPetSubmit = async () => {
        setLoading(true);
        if (!isFormValid()) {
            alert("Please fill out all fields and upload exactly 4 images.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            extractImageFiles(petData, formData);

            formData.append("name", petData.name);
            formData.append("breed", petData.breed);
            formData.append("spayedStatus", petData.spayedStatus);
            formData.append("birthdate", petData.birthdate);
            formData.append("aboutMe", petData.aboutMe);
            formData.append("extra1", petData.extra1);
            formData.append("extra2", petData.extra2);
            formData.append("extra3", petData.extra3);

            const characteristics = [
                petData.furType,
                petData.tailType,
                petData.earType,
                petData.bodyType,
            ];

            characteristics.forEach((ch) => {
                formData.append("characteristics", ch);
            });

            const response = await fetch(
                `${API_URL}/api/pet/add-pet-with-images`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                },
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Server response:", errorText);
                throw new Error(
                    `Failed to upload pet details: ${response.status} ${errorText}`,
                );
            }
        } catch (error) {
            console.error("Error uploading pet data:", error);
            alert("❌ Failed to add pet. Please try again.");
        } finally {
            setLoading(false);
        }

        setPetData(initialPetData);
        handleModalClose();
        fetchAvailablePets();
    };

    const handleEventDateChange = (field, newValue) => {
        if (newValue) {
            setEventData((prev) => ({
                ...prev,
                [field]: newValue.format("YYYY-MM-DD"),
            }));
        }
    };

    const handleEventChange = (event) => {
        const { name, value } = event.target;
        setEventData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEventImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert("❌ File size exceeds 5MB. Please upload a smaller file.");
            return;
        }

        const newimagesconst newImages = [...eventData.images];
        newImages[0] = {
            preview: URL.createObjectURL(file),
            file: file,
        };

        setEventData({ ...eventData, images: newImages });
    };

    const isEventFormValid = () => {
        return (
            eventData.images[0] !== null &&
            eventData.title.trim() !== "" &&
            eventData.description.trim() !== "" &&
            eventData.startDate.trim() !== "" &&
            eventData.endDate.trim() !== ""
        );
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!isEventFormValid()) {
            alert("Please fill out all fields and upload an image.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            extractImageFiles(eventData, formData);
            formData.append("title", eventData.title);
            formData.append("description", eventData.description);
            formData.append("startDate", eventData.startDate);
            formData.append("endDate", eventData.endDate);

            const response = await fetch(
                `${API_URL}/api/event/create-event-with-image/${user.id}`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to create event");
            }
        } catch (error) {
            console.error("❌ Error creating event:", error);
            alert("❌ Failed to create event. Please try again.");
            setLoading(false);
            return;
        }

        setEventData(initialEventData);
        handleModalClose();
        fetchAvailableEvents();
        setLoading(false);
    };

    const fetchAvailableEvents = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/event/getAllEvents/${user.id}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                alert("❌ Failed to fetch events.");
                throw new Error("Failed to fetch events");
            }

            const data = await response.json();

            const filteredEvents = data.filter((event) =>
                dayjs(event.startDate).isSameOrAfter(dayjs(), "day"),
            );
            setAvailableEvents(filteredEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        if (user && selectedEvents === "My Events") {
            fetchAvailableEvents();
        }
    }, [user, selectedEvents]);

    const handleEventSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredEvents = availableEvents.filter(
        (event) =>
            event.title.toLowerCase().includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery),
    );

    useEffect(() => {
        if (user && selectedPets === "My Pets") {
            fetchAvailablePets();
        }
    }, [user, selectedPets]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredPets = availablePets.filter(
        (pet) =>
            pet.petName.toLowerCase().includes(searchQuery) ||
            pet.breed.toLowerCase().includes(searchQuery) ||
            pet.spayedStatus.toLowerCase().includes(searchQuery),
    );

    const archivedFilteredPets = archivedPets.filter(
        (petArchived) =>
            petArchived.petName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            petArchived.breed
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            petArchived.spayedStatus
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    );

    useEffect(() => {
        if (user) {
            setAdoptionCenterName(user.adoptionCenterName || "");
            setWebsiteLink(user.website || "");
            setBio(user.bio || "");
            setPhoneNumber(user.phoneNumber || "");
            setAddress(user.address || "");
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        if (adoptionCenterName !== user.adoptionCenterName)
            await updateAdoptionCenterName();
        if (websiteLink !== user.website) await updateWebsiteLink();
        if (bio !== user.bio) await updateBio();
        if (phoneNumber !== user.phoneNumber) await updatePhoneNumber();

        fetchUserSession();
        setIsUpdated(false);
    };

    const handleAdoptionCenterNameChange = (event) => {
        setAdoptionCenterName(event.target.value);
        setIsUpdated(
            event.target.value !== user?.adoptionCenterName ||
                websiteLink !== user?.website ||
                bio !== user?.bio ||
                phoneNumber !== user?.phoneNumber,
        );
    };

    const handleWebsiteChange = (event) => {
        setWebsiteLink(event.target.value);
        setIsUpdated(
            adoptionCenterName !== user?.adoptionCenterName ||
                event.target.value !== user?.website ||
                bio !== user?.bio ||
                phoneNumber !== user?.phoneNumber,
        );
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
        setIsUpdated(
            adoptionCenterName !== user?.adoptionCenterName ||
                websiteLink !== user?.website ||
                event.target.value !== user?.bio ||
                phoneNumber !== user?.phoneNumber,
        );
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
        setIsUpdated(
            adoptionCenterName !== user?.adoptionCenterName ||
                websiteLink !== user?.website ||
                bio !== user?.bio ||
                event.target.value !== user?.phoneNumber,
        );
    };

    const updateAdoptionCenterName = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/change-name/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        adoptionCenterName,
                    }),
                },
            );

            if (response.ok) {
                setIsUpdated(false);
            } else {
                console.error("Failed to update adoption center name");
                alert("❌ Failed to update adoption center name.");
            }
        } catch (error) {
            console.error("Error updating adoption center name:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateWebsiteLink = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/update-website-link/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        website: websiteLink,
                    }),
                },
            );

            if (response.ok) {
                setIsUpdated(false);
            } else {
                console.error("Failed to update website link");
                alert("❌ Failed to update website link.");
            }
        } catch (error) {
            console.error("Error updating website link:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateBio = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/update-bio/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        bio,
                    }),
                },
            );

            if (response.ok) {
                setIsUpdated(false);
            } else {
                console.error("Failed to update bio");
                alert("❌ Failed to update bio.");
            }
        } catch (error) {
            console.error("Error updating bio:", error);
        } finally {
            setLoading(false);
        }
    };

    const updatePhoneNumber = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/update-phone-number/${user.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber,
                    }),
                },
            );

            if (response.ok) {
                setIsUpdated(false);
            } else {
                console.error("Failed to update phone number");
                alert("❌ Failed to update phone number.");
            }
        } catch (error) {
            console.error("Error updating phone number:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePetClick = (petId) => {
        const encodedId = btoa(petId.toString());
        Router.push(`/pet-info/${encodedId}`);
    };

    if (isPageLoading) {
        return <Loading />;
    }

    return (
        <Suspense fallback={<Loading />}>
            <div className={styles.container}>
                <div className={styles.profileLeftSection}>
                    <div className={styles.profileNavbarLeft}>
                        <h1>{selectedNav}</h1>
                        <p
                            onClick={() => setSelectedNav("Dashboard")}
                            className={
                                selectedNav === "Dashboard" ? styles.active : ""
                            }
                        >
                            Dashboard
                        </p>
                        <p
                            onClick={() => setSelectedNav("My Pets")}
                            className={
                                selectedNav === "My Pets" ? styles.active : ""
                            }
                        >
                            My Pets
                        </p>
                        <p
                            onClick={() => setSelectedNav("My Events")}
                            className={
                                selectedNav === "My Events" ? styles.active : ""
                            }
                        >
                            My Events
                        </p>
                        <p
                            onClick={() => setSelectedNav("Settings")}
                            className={
                                selectedNav === "Settings" ? styles.active : ""
                            }
                        >
                            Settings
                        </p>
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.profileRightSection}>
                    <div className={styles.profileNavbarRight}>
                        <div className={styles.dashboardHeader}>
                            {selectedNav === "Dashboard" && (
                                <div className={styles.dashboard}>
                                    <div
                                        className={
                                            styles.dashboardHeaderContent
                                        }
                                    >
                                        <div
                                            className={styles.dashboardWrapper}
                                        >
                                            <div
                                                className={
                                                    styles.dashboardWrapperHeader
                                                }
                                            >
                                                <h1>
                                                    {user?.adoptionCenterName ||
                                                        ""}
                                                </h1>
                                            </div>
                                        </div>

                                        <div
                                            className={styles.profileMessaging}
                                        >
                                            <p>My Messages</p>

                                            {conversations.length === 0 ? (
                                                <div
                                                    className={
                                                        styles.noMessages
                                                    }
                                                >
                                                    <img
                                                        src="/icons/no_messages.png"
                                                        alt="No messages"
                                                    />
                                                    <p>
                                                        No messages found, check
                                                        back later.
                                                    </p>
                                                </div>
                                            ) : (
                                                <ul
                                                    style={{
                                                        listStyle: "none",
                                                        padding: 0,
                                                    }}
                                                >
                                                    {conversations.map(
                                                        (conv, index) => (
                                                            <li
                                                                key={index}
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <Paper
                                                                    elevation={
                                                                        3
                                                                    }
                                                                    onClick={() =>
                                                                        Router.push(
                                                                            `/chat/${conv.id}`,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        padding:
                                                                            "10px 16px",
                                                                        marginBottom:
                                                                            "12px",
                                                                        cursor: "pointer",
                                                                        borderRadius:
                                                                            "12px",
                                                                        transition:
                                                                            "transform 0.2s ease",
                                                                    }}
                                                                    onMouseEnter={(
                                                                        e,
                                                                    ) =>
                                                                        (e.currentTarget.style.transform =
                                                                            "scale(1.02)")
                                                                    }
                                                                    onMouseLeave={(
                                                                        e,
                                                                    ) =>
                                                                        (e.currentTarget.style.transform =
                                                                            "scale(1)")
                                                                    }
                                                                >
                                                                    <Avatar
                                                                        ref={
                                                                            anchorRef
                                                                        }
                                                                        sx={{
                                                                            background:
                                                                                conv?.photo
                                                                                    ? "transparent"
                                                                                    : generateGradient(
                                                                                          conv?.firstName +
                                                                                              (conv?.lastName ||
                                                                                                  conv?.name ||
                                                                                                  ""),
                                                                                      ),
                                                                            cursor: "pointer",
                                                                            color: "#fff",
                                                                            width: 40,
                                                                            height: 40,
                                                                            marginRight:
                                                                                "20px",
                                                                            border: "1px solid black",
                                                                        }}
                                                                        src={
                                                                            conv?.profilePhoto ||
                                                                            undefined
                                                                        }
                                                                    >
                                                                        {!conv?.profilePhoto && (
                                                                            <>
                                                                                {conv?.firstName?.charAt(
                                                                                    0,
                                                                                )}
                                                                                {conv?.lastName?.charAt(
                                                                                    0,
                                                                                )}
                                                                                {conv?.name
                                                                                    ? conv?.name.charAt(
                                                                                          0,
                                                                                      )
                                                                                    : ""}
                                                                            </>
                                                                        )}
                                                                    </Avatar>
                                                                    <div>
                                                                        <strong>
                                                                            {
                                                                                conv.name
                                                                            }
                                                                        </strong>
                                                                        <p
                                                                            style={{
                                                                                fontSize:
                                                                                    "12px",
                                                                                color: "#555",
                                                                                margin: "4px 0",
                                                                            }}
                                                                        >
                                                                            Last
                                                                            message:{" "}
                                                                            {conv.lastMessageTime
                                                                                ? dayjs(
                                                                                      conv.lastMessageTime,
                                                                                  ).fromNow()
                                                                                : "N/A"}
                                                                        </p>
                                                                        {parseInt(
                                                                            conv.unreadCount,
                                                                        ) >
                                                                            0 && (
                                                                            <span
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize:
                                                                                        "12px",
                                                                                }}
                                                                            >
                                                                                🔴{" "}
                                                                                {
                                                                                    conv.unreadCount
                                                                                }{" "}
                                                                                unread
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </Paper>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.profileMatches}>
                                        <p>My Pets</p>

                                        {myPetsDashboard.length === 0 ? (
                                            <div className={styles.noMatches}>
                                                <img
                                                    src="/icons/no_matches.png"
                                                    alt="No matches"
                                                />
                                                <p>
                                                    No pets found. Try adding
                                                    some!
                                                </p>
                                            </div>
                                        ) : (
                                            <ul className={styles.petCardList}>
                                                {myPetsDashboard.map((pet) => (
                                                    <li key={pet.id}>
                                                        <Paper
                                                            elevation={3}
                                                            onClick={() =>
                                                                handlePetClick(
                                                                    pet.id,
                                                                )
                                                            }
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "space-between",
                                                                padding:
                                                                    "12px 16px",
                                                                marginBottom:
                                                                    "10px",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    fontWeight: 500,
                                                                    fontSize:
                                                                        "16px",
                                                                }}
                                                            >
                                                                {pet.name}
                                                            </span>
                                                            <img
                                                                src={
                                                                    pet.photo ||
                                                                    "/icons/no_image.png"
                                                                }
                                                                alt={pet.name}
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius:
                                                                        "8px",
                                                                    marginLeft:
                                                                        "16px",
                                                                }}
                                                            />
                                                        </Paper>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedNav === "My Pets" && (
                            <div className={styles.likesContent}>
                                <div className={styles.petsHeader}>
                                    <div className={styles.likesNavbar}>
                                        <p
                                            onClick={() =>
                                                setSelectedPets("My Pets")
                                            }
                                            className={
                                                selectedPets === "My Pets"
                                                    ? styles.likesActive
                                                    : ""
                                            }
                                        >
                                            My Pets
                                        </p>

                                        <div
                                            className={
                                                styles.likesNavbarDivider
                                            }
                                        ></div>

                                        <p
                                            onClick={() =>
                                                setSelectedPets("Archived Pets")
                                            }
                                            className={
                                                selectedPets === "Archived Pets"
                                                    ? styles.likesActive
                                                    : ""
                                            }
                                        >
                                            Archived Pets
                                        </p>
                                    </div>
                                </div>
                                <div className={styles.likesContent}>
                                    {selectedPets === "My Pets" && (
                                        <div>
                                            <div
                                                className={styles.addPetButton}
                                            >
                                                <TextField
                                                    label="Search Pets"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={searchQuery}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    className={
                                                        styles.searchField
                                                    }
                                                    size="small"
                                                    sx={{ mb: 2 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={
                                                        styles.addPetButtonClass
                                                    }
                                                    onClick={handleModalOpen}
                                                >
                                                    <img
                                                        src="/icons/plus_icon.png"
                                                        alt="Add"
                                                    />
                                                    New Pet
                                                </Button>
                                                <Modal
                                                    open={openModal}
                                                    onClose={handleModalClose}
                                                    aria-labelledby="add-pet-modal"
                                                >
                                                    <Box sx={modalStyle}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Add New Pet
                                                        </Typography>

                                                        <form
                                                            onSubmit={
                                                                handleFormSubmit
                                                            }
                                                            className={
                                                                styles.form
                                                            }
                                                        >
                                                            <h3>
                                                                {" "}
                                                                Upload photos
                                                            </h3>
                                                            <Box
                                                                className={
                                                                    styles.imagePreviewContainer
                                                                }
                                                            >
                                                                {petData.images.map(
                                                                    (
                                                                        imgObj,
                                                                        index,
                                                                    ) => (
                                                                        <Box
                                                                            key={
                                                                                index
                                                                            }
                                                                            className={
                                                                                styles.imageWrapper
                                                                            }
                                                                        >
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(
                                                                                    event,
                                                                                ) =>
                                                                                    handleImageUpload(
                                                                                        index,
                                                                                        event,
                                                                                    )
                                                                                }
                                                                                className={
                                                                                    styles.fileInput
                                                                                }
                                                                                id={`file-input-${index}`}
                                                                            />
                                                                            {imgObj &&
                                                                                imgObj.preview && (
                                                                                    <button
                                                                                        className={
                                                                                            styles.removeButton
                                                                                        }
                                                                                        onClick={(
                                                                                            e,
                                                                                        ) => {
                                                                                            e.preventDefault();
                                                                                            const newImages =
                                                                                                [
                                                                                                    ...petData.images,
                                                                                                ];
                                                                                            newImages[
                                                                                                index
                                                                                            ] =
                                                                                                null;
                                                                                            setPetData(
                                                                                                {
                                                                                                    ...petData,
                                                                                                    images: newImages,
                                                                                                },
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        ✕
                                                                                    </button>
                                                                                )}
                                                                            {imgObj &&
                                                                            imgObj.preview ? (
                                                                                <img
                                                                                    src={
                                                                                        imgObj.preview
                                                                                    }
                                                                                    className={
                                                                                        styles.previewImage
                                                                                    }
                                                                                    alt={`Uploaded ${index}`}
                                                                                />
                                                                            ) : (
                                                                                <Box
                                                                                    className={
                                                                                        styles.placeholder
                                                                                    }
                                                                                    onClick={() =>
                                                                                        document
                                                                                            .getElementById(
                                                                                                `file-input-${index}`,
                                                                                            )
                                                                                            .click()
                                                                                    }
                                                                                >
                                                                                    +
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    ),
                                                                )}
                                                            </Box>
                                                            <TextField
                                                                label="Name"
                                                                name="name"
                                                                value={
                                                                    petData.name
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <TextField
                                                                label="Breed"
                                                                name="breed"
                                                                value={
                                                                    petData.breed
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <TextField
                                                                select
                                                                label="Spayed/Neutered Status"
                                                                name="spayedStatus"
                                                                value={
                                                                    petData.spayedStatus
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            >
                                                                {petStatuses.map(
                                                                    (
                                                                        status,
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                status
                                                                            }
                                                                            value={
                                                                                status
                                                                            }
                                                                        >
                                                                            {
                                                                                status
                                                                            }
                                                                        </MenuItem>
                                                                    ),
                                                                )}
                                                            </TextField>
                                                            <LocalizationProvider
                                                                dateAdapter={
                                                                    AdapterDayjs
                                                                }
                                                            >
                                                                <DatePicker
                                                                    label="Birthdate"
                                                                    value={
                                                                        petData.birthdate
                                                                            ? dayjs(
                                                                                  petData.birthdate,
                                                                              )
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        newValue,
                                                                    ) => {
                                                                        if (
                                                                            newValue
                                                                        ) {
                                                                            setPetData(
                                                                                {
                                                                                    ...petData,
                                                                                    birthdate:
                                                                                        newValue.format(
                                                                                            "YYYY-MM-DD",
                                                                                        ),
                                                                                },
                                                                            );
                                                                        }
                                                                    }}
                                                                    format="YYYY-MM-DD"
                                                                    shouldDisableDate={(
                                                                        date,
                                                                    ) =>
                                                                        date.isAfter(
                                                                            dayjs(),
                                                                        )
                                                                    }
                                                                    slotProps={{
                                                                        textField:
                                                                            {
                                                                                fullWidth: true,
                                                                                required: true,
                                                                                sx: {
                                                                                    mb: 2,
                                                                                },
                                                                            },
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                            <TextField
                                                                select
                                                                label="Fur Type"
                                                                name="furType"
                                                                value={
                                                                    petData.furType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            >
                                                                {furTypes.map(
                                                                    (
                                                                        furType,
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                furType
                                                                            }
                                                                            value={
                                                                                furType
                                                                            }
                                                                        >
                                                                            {
                                                                                furType
                                                                            }
                                                                        </MenuItem>
                                                                    ),
                                                                )}
                                                            </TextField>
                                                            <TextField
                                                                select
                                                                label="Tail Type"
                                                                name="tailType"
                                                                value={
                                                                    petData.tailType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            >
                                                                {tailTypes.map(
                                                                    (
                                                                        tailType,
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                tailType
                                                                            }
                                                                            value={
                                                                                tailType
                                                                            }
                                                                        >
                                                                            {
                                                                                tailType
                                                                            }
                                                                        </MenuItem>
                                                                    ),
                                                                )}
                                                            </TextField>
                                                            <TextField
                                                                select
                                                                label="Ear Type"
                                                                name="earType"
                                                                value={
                                                                    petData.earType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            >
                                                                {earTypes.map(
                                                                    (
                                                                        earType,
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                earType
                                                                            }
                                                                            value={
                                                                                earType
                                                                            }
                                                                        >
                                                                            {
                                                                                earType
                                                                            }
                                                                        </MenuItem>
                                                                    ),
                                                                )}
                                                            </TextField>
                                                            <TextField
                                                                select
                                                                label="Body Type"
                                                                name="bodyType"
                                                                value={
                                                                    petData.bodyType
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            >
                                                                {bodyTypes.map(
                                                                    (
                                                                        bodyType,
                                                                    ) => (
                                                                        <MenuItem
                                                                            key={
                                                                                bodyType
                                                                            }
                                                                            value={
                                                                                bodyType
                                                                            }
                                                                        >
                                                                            {
                                                                                bodyType
                                                                            }
                                                                        </MenuItem>
                                                                    ),
                                                                )}
                                                            </TextField>
                                                            <TextField
                                                                label="About Me"
                                                                name="aboutMe"
                                                                value={
                                                                    petData.aboutMe
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                multiline
                                                                rows={3}
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 2 }}
                                                            >
                                                                Additional Info:
                                                            </Typography>
                                                            <TextField
                                                                label="I go crazy for..."
                                                                name="extra1"
                                                                value={
                                                                    petData.extra1
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <TextField
                                                                label="My favorite toy is..."
                                                                name="extra2"
                                                                value={
                                                                    petData.extra2
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <TextField
                                                                label="The way to win me over is..."
                                                                name="extra3"
                                                                value={
                                                                    petData.extra3
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    mt: 3,
                                                                }}
                                                            >
                                                                <Button
                                                                    onClick={
                                                                        handleModalClose
                                                                    }
                                                                    variant="outlined"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    disabled={
                                                                        !isFormValid()
                                                                    }
                                                                    onClick={
                                                                        handleAddPetSubmit
                                                                    }
                                                                    startIcon={
                                                                        loading ? (
                                                                            <CircularProgress
                                                                                size={
                                                                                    20
                                                                                }
                                                                                color="inherit"
                                                                            />
                                                                        ) : null
                                                                    }
                                                                >
                                                                    {loading
                                                                        ? "Adding Pet..."
                                                                        : "Add Pet"}
                                                                </Button>
                                                            </Box>
                                                        </form>
                                                    </Box>
                                                </Modal>
                                            </div>
                                            <div className={styles.petsText}>
                                                {filteredPets.length > 0 ? (
                                                    <div
                                                        className={
                                                            styles.petsGrid
                                                        }
                                                    >
                                                        {filteredPets.map(
                                                            (pet) => (
                                                                <div
                                                                    key={pet.id}
                                                                    className={
                                                                        styles.petCard
                                                                    }
                                                                    onClick={() =>
                                                                        handlePetClick(
                                                                            pet.petId,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={
                                                                            pet.petImage
                                                                        }
                                                                        alt={
                                                                            pet.petName
                                                                        }
                                                                        className={
                                                                            styles.petImage
                                                                        }
                                                                    />
                                                                    <div
                                                                        className={
                                                                            styles.petDetails
                                                                        }
                                                                    >
                                                                        <div>
                                                                            <p
                                                                                className={
                                                                                    styles.petName
                                                                                }
                                                                            >
                                                                                {
                                                                                    pet.petName
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Breed:{" "}
                                                                                {
                                                                                    pet.breed
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    pet.spayedStatus
                                                                                }
                                                                            </p>
                                                                            <p>
                                                                                Born:{" "}
                                                                                {dayjs(
                                                                                    pet.birthdate,
                                                                                ).format(
                                                                                    "MMMM D, YYYY",
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p>No pets found.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedPets === "Archived Pets" && (
                                        <div className={styles.archivedPets}>
                                            <div
                                                className={styles.addPetButton}
                                            >
                                                <TextField
                                                    label="Search Pets"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={searchQuery}
                                                    onChange={
                                                        handleSearchChange
                                                    }
                                                    className={
                                                        styles.searchField
                                                    }
                                                    size="small"
                                                    sx={{ mb: 2 }}
                                                />
                                            </div>

                                            {archivedFilteredPets.length > 0 ? (
                                                <div
                                                    className={styles.petsGrid}
                                                >
                                                    {archivedFilteredPets.map(
                                                        (pet) => (
                                                            <div
                                                                key={pet.id}
                                                                className={
                                                                    styles.petCard
                                                                }
                                                                onClick={() =>
                                                                    handlePetClick(
                                                                        pet.petId,
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        pet.petImage
                                                                    }
                                                                    alt={
                                                                        pet.name
                                                                    }
                                                                    className={
                                                                        styles.petImage
                                                                    }
                                                                />
                                                                <div
                                                                    className={
                                                                        styles.petDetails
                                                                    }
                                                                >
                                                                    <div>
                                                                        <p
                                                                            className={
                                                                                styles.petName
                                                                            }
                                                                        >
                                                                            {
                                                                                pet.petName
                                                                            }
                                                                        </p>
                                                                        <p>
                                                                            Breed:{" "}
                                                                            {
                                                                                pet.breed
                                                                            }
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                pet.spayedStatus
                                                                            }
                                                                        </p>
                                                                        <p>
                                                                            Born:{" "}
                                                                            {dayjs(
                                                                                pet.birthdate,
                                                                            ).format(
                                                                                "MMMM D, YYYY",
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p>No Archived Pets found.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedNav === "My Events" && (
                            <div className={styles.likesContent}>
                                <div className={styles.petsHeader}>
                                    <div className={styles.likesNavbar}>
                                        <p
                                            onClick={() =>
                                                setSelectedEvents("My Events")
                                            }
                                            className={
                                                selectedEvents === "My Events"
                                                    ? styles.likesActive
                                                    : ""
                                            }
                                        >
                                            My Events
                                        </p>

                                        <div
                                            className={
                                                styles.likesNavbarDivider
                                            }
                                        ></div>

                                        <p
                                            onClick={() =>
                                                setSelectedEvents(
                                                    "Archived Events",
                                                )
                                            }
                                            className={
                                                selectedEvents ===
                                                "Archived Events"
                                                    ? styles.likesActive
                                                    : ""
                                            }
                                        >
                                            Archived Events
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.likesContent}>
                                    {selectedEvents === "My Events" && (
                                        <div>
                                            <div
                                                className={
                                                    styles.addEventButton
                                                }
                                            >
                                                <TextField
                                                    label="Search Events"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={searchQuery}
                                                    onChange={
                                                        handleEventSearchChange
                                                    }
                                                    className={
                                                        styles.searchField
                                                    }
                                                    size="small"
                                                    sx={{ mb: 2 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={
                                                        styles.addEventButtonClass
                                                    }
                                                    onClick={() =>
                                                        setOpenModal(true)
                                                    }
                                                >
                                                    <img
                                                        src="/icons/plus_icon.png"
                                                        alt="Add"
                                                    />
                                                    New Event
                                                </Button>
                                                <Modal
                                                    open={openModal}
                                                    onClose={handleModalClose}
                                                    aria-labelledby="add-event-modal"
                                                >
                                                    <Box sx={modalStyle}>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{ mb: 2 }}
                                                        >
                                                            Add New Event
                                                        </Typography>

                                                        <form
                                                            onSubmit={
                                                                handleEventSubmit
                                                            }
                                                            className={
                                                                styles.form
                                                            }
                                                        >
                                                            <h3>
                                                                Upload Photo
                                                            </h3>

                                                            {/* Image Upload Box */}
                                                            <Box
                                                                className={
                                                                    styles.eventImagePreviewContainer
                                                                }
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={
                                                                        handleEventImageUpload
                                                                    }
                                                                    className={
                                                                        styles.fileInput
                                                                    }
                                                                    id="event-file-input"
                                                                />

                                                                {eventData
                                                                    .images[0] ? (
                                                                    <div
                                                                        className={
                                                                            styles.eventImageWrapper
                                                                        }
                                                                    >
                                                                        <img
                                                                            src={
                                                                                eventData
                                                                                    .images[0]
                                                                                    .preview
                                                                            }
                                                                            className={
                                                                                styles.previewImageEvent
                                                                            }
                                                                            alt="Uploaded Event"
                                                                        />
                                                                        <button
                                                                            className={
                                                                                styles.removeButton
                                                                            }
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.preventDefault();
                                                                                setEventData(
                                                                                    {
                                                                                        ...eventData,
                                                                                        images: [
                                                                                            null,
                                                                                        ],
                                                                                    },
                                                                                );
                                                                            }}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <Box
                                                                        className={
                                                                            styles.eventPlaceholder
                                                                        }
                                                                        onClick={() =>
                                                                            document
                                                                                .getElementById(
                                                                                    "event-file-input",
                                                                                )
                                                                                .click()
                                                                        }
                                                                    >
                                                                        +
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                            <TextField
                                                                label="Event Title"
                                                                name="title"
                                                                value={
                                                                    eventData.title
                                                                }
                                                                onChange={
                                                                    handleEventChange
                                                                }
                                                                fullWidth
                                                                required
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <TextField
                                                                label="Event Description"
                                                                name="description"
                                                                value={
                                                                    eventData.description
                                                                }
                                                                onChange={
                                                                    handleEventChange
                                                                }
                                                                fullWidth
                                                                required
                                                                multiline
                                                                rows={3}
                                                                sx={{ mb: 2 }}
                                                            />
                                                            <LocalizationProvider
                                                                dateAdapter={
                                                                    AdapterDayjs
                                                                }
                                                            >
                                                                <DatePicker
                                                                    label="Start Date"
                                                                    value={
                                                                        eventData.startDate
                                                                            ? dayjs(
                                                                                  eventData.startDate,
                                                                              )
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        newValue,
                                                                    ) =>
                                                                        handleEventDateChange(
                                                                            "startDate",
                                                                            newValue,
                                                                        )
                                                                    }
                                                                    format="YYYY-MM-DD"
                                                                    shouldDisableDate={(
                                                                        date,
                                                                    ) =>
                                                                        date.isBefore(
                                                                            dayjs(),
                                                                        )
                                                                    }
                                                                    slotProps={{
                                                                        textField:
                                                                            {
                                                                                fullWidth: true,
                                                                                required: true,
                                                                                sx: {
                                                                                    mb: 2,
                                                                                },
                                                                            },
                                                                    }}
                                                                />
                                                                <DatePicker
                                                                    label="End Date"
                                                                    value={
                                                                        eventData.endDate
                                                                            ? dayjs(
                                                                                  eventData.endDate,
                                                                              )
                                                                            : null
                                                                    }
                                                                    onChange={(
                                                                        newValue,
                                                                    ) =>
                                                                        handleEventDateChange(
                                                                            "endDate",
                                                                            newValue,
                                                                        )
                                                                    }
                                                                    format="YYYY-MM-DD"
                                                                    shouldDisableDate={(
                                                                        date,
                                                                    ) =>
                                                                        date.isBefore(
                                                                            dayjs(),
                                                                        ) ||
                                                                        (eventData.startDate &&
                                                                            date.isBefore(
                                                                                dayjs(
                                                                                    eventData.startDate,
                                                                                ),
                                                                            ))
                                                                    }
                                                                    slotProps={{
                                                                        textField:
                                                                            {
                                                                                fullWidth: true,
                                                                                required: true,
                                                                                sx: {
                                                                                    mb: 2,
                                                                                },
                                                                            },
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                    mt: 3,
                                                                }}
                                                            >
                                                                <Button
                                                                    onClick={
                                                                        handleModalClose
                                                                    }
                                                                    variant="outlined"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    disabled={
                                                                        !isEventFormValid()
                                                                    }
                                                                    startIcon={
                                                                        loading ? (
                                                                            <CircularProgress
                                                                                size={
                                                                                    20
                                                                                }
                                                                                color="inherit"
                                                                            />
                                                                        ) : null
                                                                    }
                                                                >
                                                                    {loading
                                                                        ? "Creating Event..."
                                                                        : "Create Event"}
                                                                </Button>
                                                            </Box>
                                                        </form>
                                                    </Box>
                                                </Modal>
                                            </div>

                                            <div className={styles.petsText}>
                                                {filteredEvents.length > 0 ? (
                                                    <div
                                                        className={
                                                            styles.eventsGrid
                                                        }
                                                    >
                                                        {filteredEvents.map(
                                                            (event) => (
                                                                <div
                                                                    key={
                                                                        event.id
                                                                    }
                                                                    className={
                                                                        styles.eventCard
                                                                    }
                                                                >
                                                                    <img
                                                                        src={
                                                                            event.image
                                                                        }
                                                                        alt={
                                                                            event.title
                                                                        }
                                                                        className={
                                                                            styles.eventImage
                                                                        }
                                                                    />
                                                                    <div
                                                                        className={
                                                                            styles.eventDetails
                                                                        }
                                                                    >
                                                                        <p
                                                                            className={
                                                                                styles.eventTitle
                                                                            }
                                                                        >
                                                                            {
                                                                                event.title
                                                                            }
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                styles.eventDescription
                                                                            }
                                                                        >
                                                                            {
                                                                                event.description
                                                                            }
                                                                        </p>
                                                                        <p
                                                                            className={
                                                                                styles.eventDate
                                                                            }
                                                                        >
                                                                            {dayjs(
                                                                                event.startDate,
                                                                            ).format(
                                                                                "MMMM D, YYYY",
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {dayjs(
                                                                                event.endDate,
                                                                            ).format(
                                                                                "MMMM D, YYYY",
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p
                                                        className={
                                                            styles.noEventsMessage
                                                        }
                                                    >
                                                        No events found.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {selectedEvents === "Archived Events" && (
                                        <div className={styles.archivedPets}>
                                            {user?.archivedEvents?.length >
                                            0 ? (
                                                <ul>
                                                    {user.archivedEvents.map(
                                                        (event, index) => (
                                                            <li key={index}>
                                                                {event.title}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : (
                                                <p>No archived events found.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {selectedNav === "Settings" && (
                            <div className={styles.settingsWrapper}>
                                <div className={styles.dashboardWrapperHeader}>
                                    <Avatar
                                        ref={anchorRef}
                                        sx={{
                                            background: user?.profilePhoto
                                                ? "transparent"
                                                : generateGradient(
                                                      user?.firstName +
                                                          (user?.lastName ||
                                                              ""),
                                                  ),
                                            cursor: "pointer",
                                            color: "#fff",
                                            width: 100,
                                            height: 100,
                                            border: "1px solid black",
                                        }}
                                        src={user?.profilePhoto || undefined}
                                    >
                                        {!user?.profilePhoto && (
                                            <>
                                                {user?.firstName?.charAt(0)}
                                                {user?.lastName
                                                    ? user?.lastName.charAt(0)
                                                    : ""}
                                            </>
                                        )}
                                    </Avatar>

                                    <div
                                        className={
                                            styles.settingsChangeProfilePhoto
                                        }
                                    >
                                        <div
                                            className={
                                                styles.settingsChangePhotoButtons
                                            }
                                        >
                                            <input
                                                type="file"
                                                accept=".png, .jpg, .jpeg"
                                                onChange={handleUploadPhoto}
                                                style={{ display: "none" }}
                                                id="upload-photo"
                                            />
                                            <Button
                                                variant="contained"
                                                onClick={() =>
                                                    document
                                                        .getElementById(
                                                            "upload-photo",
                                                        )
                                                        .click()
                                                }
                                            >
                                                Upload Photo
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="outlined"
                                                color="error"
                                                disabled={!user?.profilePhoto}
                                                onClick={handleOpen}
                                            >
                                                Delete Photo
                                            </Button>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style}>
                                                    <Typography
                                                        id="modal-modal-title"
                                                        variant="h6"
                                                        component="h2"
                                                    >
                                                        Are you sure you want to
                                                        delete your profile
                                                        photo?
                                                    </Typography>
                                                    <Typography
                                                        id="modal-modal-description"
                                                        sx={{ mt: 2 }}
                                                    >
                                                        The photo will be
                                                        permanently deleted and
                                                        cannot be recovered.
                                                    </Typography>
                                                    <Button
                                                        type="submit"
                                                        variant="outlined"
                                                        color="error"
                                                        sx="margin-top: 20px"
                                                        onClick={() => {
                                                            handleDeletePhoto();
                                                            handleClose();
                                                        }}
                                                    >
                                                        Yes, I&apos;m Sure
                                                    </Button>
                                                </Box>
                                            </Modal>
                                        </div>

                                        <div
                                            className={
                                                styles.settingsUploadError
                                            }
                                        >
                                            {uploadError && (
                                                <p
                                                    style={{
                                                        color: "red",
                                                        marginTop: "10px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {uploadError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.dashboardContent}>
                                    <div className={styles.dashboardContentTop}>
                                        <TextField
                                            label="Adoption Center Name"
                                            value={adoptionCenterName}
                                            onChange={
                                                handleAdoptionCenterNameChange
                                            }
                                            id="firstName"
                                            size="small"
                                        />
                                    </div>
                                    <TextField
                                        disabled
                                        label="Email"
                                        value={user?.email || ""}
                                        id="email"
                                        size="small"
                                    />
                                    <TextField
                                        disabled
                                        label="Password"
                                        value="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                        id="password"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <TextField
                                        label="Website Link"
                                        value={websiteLink}
                                        onChange={handleWebsiteChange}
                                        fullWidth
                                        id="website link"
                                        size="small"
                                    />
                                    <TextField
                                        disabled
                                        label="Address"
                                        value={address}
                                        fullWidth
                                        id="address"
                                        size="small"
                                    />
                                    <TextField
                                        label="Bio"
                                        value={bio}
                                        onChange={handleBioChange}
                                        fullWidth
                                        id="bio"
                                        size="small"
                                        multiline
                                        rows={3}
                                    />
                                    <TextField
                                        label="Phone Number"
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        fullWidth
                                        id="phone number"
                                        size="small"
                                    />

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateProfile}
                                        disabled={!isUpdated}
                                        startIcon={
                                            loading ? (
                                                <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                />
                                            ) : null
                                        }
                                    >
                                        {loading
                                            ? "Updating Profile..."
                                            : "Update Profile"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "600px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    maxHeight: "80vh",
    overflowY: "auto",
};
