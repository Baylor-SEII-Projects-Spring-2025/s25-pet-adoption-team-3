import React, { useEffect, useState } from "react";
import { useSprings, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styles from "@/styles/SwipeComponent.module.css";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const to = (i) => ({ x: 0, y: i * -4, scale: 1 });
const from = (i) => ({ x: 0, y: i * -4, scale: 1 });

export function SwipeComponent() {
    const [pets, setPets] = useState([]);
    const [gone] = useState(() => new Set());
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [currentImageIndices, setCurrentImageIndices] = useState({});

    const navigateImage = (petId, direction) => {
        setCurrentImageIndices((prev) => {
            const pet = pets.find((p) => p.id === petId);
            if (!pet || !pet.image || pet.image.length <= 1) return prev;

            const currentIndex = prev[petId] || 0;
            const totalImages = pet.image.length;
            let newIndex =
                direction === "next"
                    ? (currentIndex + 1) % totalImages
                    : (currentIndex - 1 + totalImages) % totalImages;

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
            if (response.status === 401) return router.push("/login");
            if (!response.ok) throw new Error("Error fetching session");
            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            console.error("Session fetch error:", err);
        }
    };

    useEffect(() => {
        if (!user) fetchUserSession();
    }, []);

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
                if (res.status === 401) return router.push("/login");
                else if (!res.ok) {
                    alert(`HTTP error! status: ${res.status}`);
                    router.push("/");
                }
                const data = await res.json();
                setPets(data);
                const initialIndices = {};
                data.forEach((pet) => (initialIndices[pet.id] = 0));
                setCurrentImageIndices(initialIndices);
            } catch (err) {
                console.error("Fetch pets error:", err);
            }
        }
        fetchPets();
    }, []);

    const [springs, api] = useSprings(pets.length || 0, (i) => ({
        ...to(i),
        from: from(i),
    }));

    useEffect(() => {
        if (pets.length > 0) api.start((i) => ({ ...to(i), from: from(i) }));
    }, [pets, api]);

    const handleSwipe = async (petId, liked) => {
        try {
            console.log(`Swiped ${liked ? "right" : "left"} on pet ${petId}`);
        } catch (err) {
            console.error("Swipe error:", err);
        }
    };

    const bind = useDrag(
        ({
            args: [index],
            down,
            movement: [mx],
            direction: [xDir],
            velocity,
        }) => {
            const trigger = velocity > 0.2;
            const dir = xDir < 0 ? -1 : 1;
            if (!down && trigger) {
                gone.add(index);
                if (pets[index] && pets[index].id)
                    handleSwipe(pets[index].id, dir === 1);
            }

            api.start((i) => {
                if (index !== i) return;
                const isGone = gone.has(index);
                const x = isGone
                    ? (200 + window.innerWidth) * dir
                    : down
                      ? mx
                      : 0;
                return {
                    x,
                    scale: 1,
                    config: {
                        friction: 50,
                        tension: down ? 800 : isGone ? 200 : 500,
                    },
                };
            });

            if (!down && gone.size === pets.length) {
                setTimeout(() => {
                    gone.clear();
                    api.start((i) => to(i));
                }, 600);
            }
        },
    );

    const handleCarouselClick = (e) => e.stopPropagation();

    if (pets.length === 0)
        return <div className={styles.loading}>Loading pets...</div>;

    return (
        <div className={styles.swipeContainer}>
            {springs.map(({ x, y }, i) => {
                if (!pets[i]) return null;
                const pet = pets[i];
                const currentImageIndex = currentImageIndices[pet.id] || 0;
                const hasMultipleImages = pet?.image?.length > 1;

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
                                touchAction: "none",
                                opacity: x.to((x) =>
                                    Math.abs(x) > window.innerWidth / 2 ? 0 : 1,
                                ),
                            }}
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.carousel}>
                                    {pet.image?.length ? (
                                        <div
                                            className={styles.carouselContainer}
                                        >
                                            <img
                                                src={
                                                    pet.image[currentImageIndex]
                                                }
                                                alt={pet.name}
                                                className={styles.carouselImage}
                                            />
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
