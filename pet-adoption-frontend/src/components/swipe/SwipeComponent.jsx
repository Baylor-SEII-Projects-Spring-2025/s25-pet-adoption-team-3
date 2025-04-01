import React, { useEffect, useState } from "react";
import { useSprings, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import styles from "@/styles/SwipeComponent.module.css";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const to = (i) => ({ x: 0, y: i * -4, scale: 1 });
const from = (i) => ({ x: 0, y: i * -4, scale: 1 });
const to = (i) => ({ x: 0, y: i * -4, scale: 1 });
const from = (i) => ({ x: 0, y: i * -4, scale: 1 });

export function SwipeComponent() {
    const [pets, setPets] = useState([]);
    const [gone] = useState(() => new Set());
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
            if (response.status === 401) return router.push("/login");
            if (!response.ok) throw new Error("Error fetching session");
            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            console.error("Session fetch error:", err);
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
    const fetchPets = async () => {
        try {
            const res = await fetch(`${API_URL}/api/pet/swipe/temp-get-pets`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                },
            });
            if (res.status === 401) return router.push("/login");
            if (!res.ok) {
                alert(`HTTP error! status: ${res.status}`);
                router.push("/");
                return;
            }
            const data = await res.json();
            setPets((prev) => [...prev, ...data]);
            const newIndices = {};
            data.forEach((pet) => (newIndices[pet.id] = 0));
            setCurrentImageIndices((prev) => ({ ...prev, ...newIndices }));
        } catch (err) {
            console.error("Fetch pets error:", err);
        }
    };

    // pos fix for Strict Mode causing useEffects to trigger twice in dev environments.
    // how tf else are we supposed to have an async call that modifies data?????
    // the greatest minds at facebook ladies/gents.
    let initialized = false;
    useEffect(() => {
        if(!initialized){
            initialized = true;
            fetchPets();
        }
    }, []);

    const [springs, api] = useSprings(pets.length || 0, (i) => ({
    const [springs, api] = useSprings(pets.length || 0, (i) => ({
        ...to(i),
        from: from(i),
    }));

    useEffect(() => {
        if (pets.length > 0) api.start((i) => ({ ...to(i), from: from(i) }));
        if (pets.length > 0) api.start((i) => ({ ...to(i), from: from(i) }));
    }, [pets, api]);

    const handleSwipe = async (petId, liked) => {
        try {
            console.log(`Swiped ${liked ? "right" : "left"} on pet ${petId}`);
            const response = await fetch(
                `${API_URL}/api/pet/${liked ? "like" : "dislike"}-pet/${petId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                    },
                    body: JSON.stringify({ petId }),
                },
            );

            console.log("Response status:", response.status);
        } catch (err) {
            console.error("Swipe error:", err);
        }
    };

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
            const trigger = velocity > 0.2;
            const dir = xDir < 0 ? -1 : 1;
            if (!down && trigger) {
                gone.add(index);
                if (pets[index] && pets[index].id)
                gone.add(index);
                if (pets[index] && pets[index].id)
                    handleSwipe(pets[index].id, dir === 1);
            }

            api.start((i) => {
                if (index !== i) return;
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

            if (!down && pets.length - gone.size <= 2) {
                fetchPets();
            }
        },
    );

    const handleCarouselClick = (e) => e.stopPropagation();
    const handleCarouselClick = (e) => e.stopPropagation();

    if (pets.length === 0)
    if (pets.length === 0)
        return <div className={styles.loading}>Loading pets...</div>;

    return (
        <div className={styles.swipeContainer}>
            {springs.map(({ x, y }, i) => {
            {springs.map(({ x, y }, i) => {
                if (!pets[i]) return null;
                const pet = pets[i];
                const currentImageIndex = currentImageIndices[pet.id] || 0;
                const hasMultipleImages = pet?.image?.length > 1;
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
                                touchAction: "none",
                                opacity: x.to((x) =>
                                    Math.abs(x) > window.innerWidth / 2 ? 0 : 1,
                                ),
                            }}
                        >
                            <div className={styles.cardContent}>
                                <div className={styles.carousel}>
                                    {pet.image?.length ? (
                                    {pet.image?.length ? (
                                        <div
                                            className={styles.carouselContainer}
                                        >
                                            <img
                                                src={
                                                    pet.image[currentImageIndex]
                                                }
                                                alt={pet.name}
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
                                    <h2 className={styles.petName}>
                                        {pet.name}
                                    </h2>
                                    <p>
                                        <img
                                            src="/icons/location_icon.png"
                                            alt="Location"
                                            className={styles.icon}
                                        />
                                        {pet.location}
                                    </p>
                                    <p>
                                        <img
                                            src="/icons/adoption_location_icon.png"
                                            alt="Adoption Center"
                                            className={styles.icon}
                                        />
                                        {pet.adoptionCenterName}
                                    </p>
                                    <p>
                                        <img
                                            src="/icons/breed_icon.png"
                                            alt="Breed"
                                            className={styles.icon}
                                        />
                                        {pet.breed}
                                    </p>
                                    <p>
                                        <img
                                            src="/icons/fertile_status_icon.png"
                                            alt="Fertility Status"
                                            className={styles.icon}
                                        />
                                        {pet.spayedStatus}
                                    </p>
                                    <p>
                                        <img
                                            src="/icons/birthday_icon.png"
                                            alt="Birthdate"
                                            className={styles.iconBirthdate}
                                        />
                                        {(() => {
                                            const birthDate = new Date(
                                                pet.birthdate,
                                            );
                                            const now = new Date();

                                            // Format birthdate as "Month day, year"
                                            const options = {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            };
                                            const formattedDate =
                                                birthDate.toLocaleDateString(
                                                    "en-US",
                                                    options,
                                                );

                                            // Calculate age
                                            let age =
                                                now.getFullYear() -
                                                birthDate.getFullYear();
                                            const hasHadBirthdayThisYear =
                                                now.getMonth() >
                                                    birthDate.getMonth() ||
                                                (now.getMonth() ===
                                                    birthDate.getMonth() &&
                                                    now.getDate() >=
                                                        birthDate.getDate());

                                            if (!hasHadBirthdayThisYear) {
                                                age -= 1;
                                            }

                                            return `${formattedDate} - (${age} years old)`;
                                        })()}
                                    </p>

                                    <h3 className={styles.aboutMe}>
                                        About Me
                                        <br></br>
                                        <span className={styles.aboutMeText}>
                                            {pet.aboutMe}
                                        </span>
                                    </h3>

                                    <div className={styles.extraCardContainer}>
                                        <div className={styles.extraCard}>
                                            <p className={styles.extraTitle}>
                                                I go crazy for
                                            </p>
                                            <p className={styles.extraContent}>
                                                {pet.extra1}
                                            </p>
                                        </div>

                                        <div className={styles.extraCard}>
                                            <p className={styles.extraTitle}>
                                                My favorite toy is
                                            </p>
                                            <p className={styles.extraContent}>
                                                {pet.extra2}
                                            </p>
                                        </div>

                                        <div className={styles.extraCard}>
                                            <p className={styles.extraTitle}>
                                                The way to win me over is
                                            </p>
                                            <p className={styles.extraContent}>
                                                {pet.extra3}
                                            </p>
                                        </div>
                                    </div>
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
