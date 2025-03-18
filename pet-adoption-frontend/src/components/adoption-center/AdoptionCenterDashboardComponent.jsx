import dayjs from "dayjs";
import React, { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Router from "next/router";
import styles from "@/styles/AdoptionCenterDashboardComponent.module.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

const initialPetData = {
    images: [null, null, null, null],
    name: "",
    breed: "",
    status: "",
    birthdate: "",
    aboutMe: "",
    extra1: "",
    extra2: "",
    extra3: "",
};

const initialEventData = {
    image: null,
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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openModal, setOpenModal] = React.useState(false);

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
                throw new Error("Error fetching session");
            }

            const data = await response.json();

            if (data.user.role != "ADOPTION_CENTER") {
                Router.push("/");
            }

            setUser(data.user);
        } catch (error) {
            console.error("Error fetching session:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUserSession();
        }
    }, []);

    useEffect(() => {
        if (user && user.role === "ADOPTER") {
            Router.push("/dashboard");
        }
    }, [user]);

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
                console.log("User not found");
                return;
            }

            if (response.ok) {
                console.log("✅ Profile photo deleted successfully");
                window.location.reload();
            } else {
                console.error("Failed to delete profile photo");
            }
        } catch (error) {
            console.error("Error deleting profile photo:", error);
        }
    };

    const handleUploadPhoto = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError(
                "File size exceeds 5MB. Please upload a smaller file.",
            );
            return;
        }

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
                console.log("✅ Photo uploaded, updated user:", updatedUser);
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

    // add a pet logic
    const [petData, setPetData] = useState({
        images: [null, null, null, null],
        name: "",
        breed: "",
        status: "",
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

        const newImages = [...petData.images];
        newImages[index] = file; // Store the File object instead of a blob URL
        setPetData({ ...petData, images: newImages });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (petData.images.filter((img) => img !== null).length !== 4) {
            alert("You must upload exactly 4 images.");
            return;
        }

        console.log("Submitting pet data:", petData);
        handleModalClose();
    };

    const isFormValid = () => {
        return (
            petData.images.every((img) => img !== null) && // All 4 images uploaded
            petData.name.trim() !== "" &&
            petData.breed.trim() !== "" &&
            petData.status.trim() !== "" &&
            petData.birthdate.trim() !== "" &&
            petData.aboutMe.trim() !== "" &&
            petData.extra1.trim() !== "" &&
            petData.extra2.trim() !== "" &&
            petData.extra3.trim() !== ""
        );
    };

    const handleAddPetSubmit = async () => {
        try {
            const formData = new FormData();
            petData.images.forEach((file) => {
                if (file) {
                    formData.append(`images`, file); // Append each image file
                }
            });

            formData.append("name", petData.name);
            formData.append("breed", petData.breed);
            formData.append("status", petData.status);
            formData.append("birthdate", petData.birthdate);
            formData.append("aboutMe", petData.aboutMe);
            formData.append("extra1", petData.extra1);
            formData.append("extra2", petData.extra2);
            formData.append("extra3", petData.extra3);

            const response = await fetch(`${API_URL}/api/pets/upload`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to upload pet details");
            }

            console.log("✅ Pet added successfully");

            setPetData(initialPetData);
            handleModalClose();
        } catch (error) {
            console.error("Error uploading pet data:", error);
        }
    };

    // add an event logic
    // Event Handlers
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

        const imageUrl = URL.createObjectURL(file);
        setEventData({ ...eventData, image: imageUrl });
    };

    const isEventFormValid = () => {
        return (
            eventData.image !== null &&
            eventData.title.trim() !== "" &&
            eventData.description.trim() !== "" &&
            eventData.startDate.trim() !== "" &&
            eventData.endDate.trim() !== ""
        );
    };

    // Handle form submission
    const handleEventSubmit = (e) => {
        e.preventDefault();

        if (!isEventFormValid()) {
            alert("Please fill out all fields and upload an image.");
            return;
        }

        console.log("Submitting event data:", eventData);

        // Reset form
        setEventData(initialEventData);
        handleModalClose();
    };

    return (
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
                                <div className={styles.dashboardHeaderContent}>
                                    <div className={styles.dashboardWrapper}>
                                        <div
                                            className={
                                                styles.dashboardWrapperHeader
                                            }
                                        >
                                            <h1>
                                                {user?.adoptionCenterName || ""}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className={styles.profileMessaging}>
                                        <p>My Messages</p>

                                        {user?.messages?.length === 0 ||
                                        !user?.messages ? (
                                            <div className={styles.noMessages}>
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
                                            <ul>
                                                {user?.messages?.map(
                                                    (message, index) => (
                                                        <li key={index}>
                                                            {message}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.profileMatches}>
                                    <p>My Pets</p>

                                    {user?.matches?.length === 0 ||
                                    !user?.matches ? (
                                        <div className={styles.noMatches}>
                                            <img
                                                src="/icons/no_matches.png"
                                                alt="No matches"
                                            />
                                            <p>No pets found, add some pets!</p>
                                        </div>
                                    ) : (
                                        <ul>
                                            {user?.matches?.map(
                                                (matches, index) => (
                                                    <li key={index}>
                                                        {matches}
                                                    </li>
                                                ),
                                            )}
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
                                        className={styles.likesNavbarDivider}
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
                                        <div className={styles.addPetButton}>
                                            <Button
                                                variant="contained"
                                                color="primary"
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
                                                        className={styles.form}
                                                    >
                                                        <h3> Upload photos</h3>
                                                        {/* Image Upload Grid */}
                                                        <Box
                                                            className={
                                                                styles.imagePreviewContainer
                                                            }
                                                        >
                                                            {petData.images.map(
                                                                (
                                                                    imgSrc,
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
                                                                        {/* Hidden File Input */}
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

                                                                        {/* Remove Button (Only when an image exists) */}
                                                                        {imgSrc && (
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
                                                                                        null; // Remove image
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

                                                                        {/* Clickable Placeholder or Image */}
                                                                        {imgSrc ? (
                                                                            <img
                                                                                src={
                                                                                    imgSrc
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

                                                        {/* Text Fields */}
                                                        <TextField
                                                            label="Name"
                                                            name="name"
                                                            value={petData.name}
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
                                                            name="status"
                                                            value={
                                                                petData.status
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            fullWidth
                                                            required
                                                            sx={{ mb: 2 }}
                                                        >
                                                            {petStatuses.map(
                                                                (status) => (
                                                                    <MenuItem
                                                                        key={
                                                                            status
                                                                        }
                                                                        value={
                                                                            status
                                                                        }
                                                                    >
                                                                        {status}
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
                                                                    textField: {
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

                                                        {/* Extra Sections */}
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

                                                        {/* Buttons */}
                                                        <Box
                                                            sx={{
                                                                display: "flex",
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
                                                            >
                                                                Add Pet
                                                            </Button>
                                                        </Box>
                                                    </form>
                                                </Box>
                                            </Modal>
                                        </div>
                                        <div className={styles.petsText}>
                                            {user?.likes?.length > 0 ? (
                                                <ul>
                                                    {user.likes.map(
                                                        (like, index) => (
                                                            <li key={index}>
                                                                {like}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : (
                                                <p>No pets found.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedPets === "Archived Pets" && (
                                    <div className={styles.archivedPets}>
                                        {user?.superLikes?.length > 0 ? (
                                            <ul>
                                                {user.superLikes.map(
                                                    (superLike, index) => (
                                                        <li key={index}>
                                                            {superLike}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : (
                                            <p>No archived pets found.</p>
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
                                        className={styles.likesNavbarDivider}
                                    ></div>

                                    <p
                                        onClick={() =>
                                            setSelectedEvents("Archived Events")
                                        }
                                        className={
                                            selectedEvents === "Archived Events"
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
                                        <div className={styles.addEventButton}>
                                            <Button
                                                variant="contained"
                                                color="primary"
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
                                                        className={styles.form}
                                                    >
                                                        <h3>Upload Photo</h3>

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

                                                            {eventData.image ? (
                                                                <div
                                                                    className={
                                                                        styles.eventImageWrapper
                                                                    }
                                                                >
                                                                    <img
                                                                        src={
                                                                            eventData.image
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
                                                                                    image: null,
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

                                                        {/* Text Fields */}
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
                                                            {/* Start Date Picker */}
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
                                                                } // Disable past dates
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                        required: true,
                                                                        sx: {
                                                                            mb: 2,
                                                                        },
                                                                    },
                                                                }}
                                                            />

                                                            {/* End Date Picker */}
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
                                                                shouldDisableDate={
                                                                    (date) =>
                                                                        date.isBefore(
                                                                            dayjs(),
                                                                        ) || // Prevent selecting past dates
                                                                        (eventData.startDate &&
                                                                            date.isBefore(
                                                                                dayjs(
                                                                                    eventData.startDate,
                                                                                ),
                                                                            )) // Prevent selecting before start date
                                                                }
                                                                slotProps={{
                                                                    textField: {
                                                                        fullWidth: true,
                                                                        required: true,
                                                                        sx: {
                                                                            mb: 2,
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        </LocalizationProvider>

                                                        {/* Buttons */}
                                                        <Box
                                                            sx={{
                                                                display: "flex",
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
                                                            >
                                                                Create Event
                                                            </Button>
                                                        </Box>
                                                    </form>
                                                </Box>
                                            </Modal>
                                        </div>

                                        <div className={styles.petsText}>
                                            {user?.events?.length > 0 ? (
                                                <ul>
                                                    {user.events.map(
                                                        (event, index) => (
                                                            <li key={index}>
                                                                {event.title}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : (
                                                <p>No events found.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedEvents === "Archived Events" && (
                                    <div className={styles.archivedPets}>
                                        {user?.archivedEvents?.length > 0 ? (
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
                                                      (user?.lastName || ""),
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
                                                    delete your profile photo?
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

                                    <div className={styles.settingsUploadError}>
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
                                        value={user?.adoptionCenterName || ""}
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
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
