import React, { useEffect, useState } from "react";
import { useSprings, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styles from "@/styles/SwipeComponent.module.css";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Simplified animation helpers without drop-in effect
const to = (i) => ({
    x: 0,
    y: i * -4,
    scale: 1,
});

const from = (i) => ({
    x: 0,
    y: i * -4, // Start at final position, no drop-in
    scale: 1, // No scale change
});

export function SwipeComponent() {
    const [pets, setPets] = useState([]);
    const [gone] = useState(() => new Set()); // Track cards that have been swiped away
    const [user, setUser] = useState(null);
    const router = useRouter();

    // Track current image index for each pet
    const [currentImageIndices, setCurrentImageIndices] = useState({});

    // Function to navigate to next or previous image
    const navigateImage = (petId, direction) => {
        setCurrentImageIndices((prev) => {
            const pet = pets.find((p) => p.id === petId);
            if (!pet || !pet.image || pet.image.length <= 1) return prev;

            const currentIndex = prev[petId] || 0;
            const totalImages = pet.image.length;

            // Calculate new index with wrapping
            let newIndex;
            if (direction === "next") {
                newIndex = (currentIndex + 1) % totalImages;
            } else {
                newIndex = (currentIndex - 1 + totalImages) % totalImages;
            }

            return { ...prev, [petId]: newIndex };
        });
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
                router.push("/login");
                return;
            }

            if (!response.ok) throw new Error("Error fetching session");
            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error("Session fetch error:", error);
        }
    };

    // Fetch user session on component mount
    useEffect(() => {
        if (!user) fetchUserSession();
    }, []);

    // Fetch pets data
    useEffect(() => {
        async function fetchPets() {
            try {
                const res = await fetch(
                    `${API_URL}/api/pet/swipe/temp-get-pets`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "Cache-Control": "no-cache",
                        },
                    },
                );

                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setPets(data);

                // Initialize currentImageIndices for all pets
                const initialIndices = {};
                data.forEach((pet) => {
                    initialIndices[pet.id] = 0;
                });
                setCurrentImageIndices(initialIndices);
            } catch (error) {
                console.error("Fetch pets error:", error);
            }
        }

        fetchPets();
    }, []);

    // Create springs for each pet card
    const [props, api] = useSprings(pets.length || 0, (i) => ({
        ...to(i),
        from: from(i),
    }));

    // Update springs when pets data changes
    useEffect(() => {
        if (pets.length > 0) {
            api.start((i) => ({ ...to(i), from: from(i) }));
        }
    }, [pets, api]);

    // Handle swipe event for a pet
    const handleSwipe = async (petId, liked) => {
        try {
            // Implement your swipe API call here if needed
            console.log(`Swiped ${liked ? "right" : "left"} on pet ${petId}`);
        } catch (error) {
            console.error("Error recording swipe:", error);
        }
    };

    // Use useDrag hook for swipe functionality but without scaling effect
    const bind = useDrag(
        ({
            args: [index],
            down,
            movement: [mx],
            direction: [xDir],
            velocity,
        }) => {
            const trigger = velocity > 0.2; // Velocity threshold for swipe
            const dir = xDir < 0 ? -1 : 1; // Direction of swipe

            if (!down && trigger) {
                gone.add(index); // Mark card as gone if swiped

                // Call API when card is swiped
                if (pets[index] && pets[index].id) {
                    handleSwipe(pets[index].id, dir === 1);
                }
            }

            // Update card position without scale change
            api.start((i) => {
                if (index !== i) return; // Only affect current card
                const isGone = gone.has(index);

                // X position calculation
                const x = isGone
                    ? (200 + window.innerWidth) * dir
                    : down
                      ? mx
                      : 0;

                // Return animation properties without scale change
                return {
                    x,
                    scale: 1, // Keep scale constant
                    config: {
                        friction: 50,
                        tension: down ? 800 : isGone ? 200 : 500,
                    },
                };
            });

            // Reset all cards if all have been swiped
            if (!down && gone.size === pets.length) {
                setTimeout(() => {
                    gone.clear();
                    api.start((i) => to(i));
                }, 600);
            }
        },
    );

    // Event handler to stop propagation for carousel buttons
    const handleCarouselClick = (e) => {
        e.stopPropagation();
    };

    // Don't render if no pets yet
    if (pets.length === 0) {
        return <div className={styles.loading}>Loading pets...</div>;
    }

    return (
        <div className={styles.swipeContainer}>
            {props.map(({ x, y, scale }, i) => {
                // Skip rendering if we don't have pet data for this index
                if (!pets[i]) return null;

                const pet = pets[i];
                const currentImageIndex = currentImageIndices[pet.id] || 0;
                const hasMultipleImages = pet?.image && pet.image.length > 1;

                return (
                    <animated.div
                        key={pet?.id || i}
                        className={styles.cardContainer}
                        style={{
                            zIndex: pets.length - i,
                            transform: x.to(
                                (x) => `translate3d(${x}px,${y.get()}px,0)`,
                            ),
                        }}
                    >
                        <animated.div
                            {...bind(i)}
                            className={styles.card}
                            style={{
                                touchAction: "none", // Important for touch devices
                                opacity: x.to((x) =>
                                    Math.abs(x) > window.innerWidth / 2 ? 0 : 1,
                                ),
                            }}
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.carousel}>
                                    {pet?.image && pet.image.length > 0 ? (
                                        <div
                                            className={styles.carouselContainer}
                                        >
                                            <img
                                                src={
                                                    pet.image[currentImageIndex]
                                                }
                                                alt={`${pet.name}`}
                                                className={styles.carouselImage}
                                            />

                                            {/* Image counter indicator */}
                                            {hasMultipleImages && (
                                                <div
                                                    className={
                                                        styles.imageCounter
                                                    }
                                                >
                                                    {currentImageIndex + 1} /{" "}
                                                    {pet.image.length}
                                                </div>
                                            )}

                                            {/* Navigation arrows */}
                                            {hasMultipleImages && (
                                                <>
                                                    <button
                                                        className={`${styles.carouselButton} ${styles.prevButton}`}
                                                        onClick={(e) => {
                                                            handleCarouselClick(
                                                                e,
                                                            );
                                                            navigateImage(
                                                                pet.id,
                                                                "prev",
                                                            );
                                                        }}
                                                        aria-label="Previous image"
                                                    >
                                                        &#10094;
                                                    </button>
                                                    <button
                                                        className={`${styles.carouselButton} ${styles.nextButton}`}
                                                        onClick={(e) => {
                                                            handleCarouselClick(
                                                                e,
                                                            );
                                                            navigateImage(
                                                                pet.id,
                                                                "next",
                                                            );
                                                        }}
                                                        aria-label="Next image"
                                                    >
                                                        &#10095;
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.noImage}>
                                            No image available
                                        </div>
                                    )}
                                </div>
                                <div className={styles.petInfo}>
                                    <h2>{pet.name}</h2>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {pet.spayedStatus}
                                    </p>
                                    <p>
                                        <strong>Birthdate:</strong>{" "}
                                        {pet.birthdate}
                                    </p>
                                    <p>
                                        <strong>About Me:</strong> {pet.aboutMe}
                                    </p>
                                    <p>
                                        <strong>Extras:</strong> {pet.extra1},{" "}
                                        {pet.extra2}, {pet.extra3}
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {pet.location}
                                    </p>
                                    <p>
                                        <strong>Adoption Center:</strong>{" "}
                                        {pet.adoptionCenterName}
                                    </p>
                                </div>
                            </div>
                            <div className={styles.swipeHint}>
                                Swipe right to like, left to pass
                            </div>
                        </animated.div>
                    </animated.div>
                );
            })}
        </div>
    );
}
