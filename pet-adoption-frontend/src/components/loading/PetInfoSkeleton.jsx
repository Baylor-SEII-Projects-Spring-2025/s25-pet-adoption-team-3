import React from "react";
import { Skeleton } from "@mui/material";
import styles from "@/styles/PetInfoComponent.module.css";

export default function PetInfoSkeleton() {
    return (
        <div className={styles.dashboardWrapper}>
            <Skeleton
                variant="text"
                width={160}
                height={36}
                sx={{ mb: 2 }}
            />

            <div className={styles.petInfoContainer}>
                <Skeleton
                    variant="rounded"
                    width={300}
                    height={300}
                    className={styles.petInfoImage}
                />

                <div className={styles.petDetailsContent}>
                    {[...Array(6)].map((_, i) => (
                        <Skeleton
                            key={i}
                            variant="text"
                            width="100%"
                            height={24}
                        />
                    ))}
                </div>
            </div>

            <Skeleton
                variant="text"
                width={180}
                height={30}
                sx={{ mt: 3, mb: 1 }}
            />

            <div className={styles.eventsGrid}>
                {[...Array(3)].map((_, i) => (
                    <div className={styles.eventCard} key={i}>
                        <Skeleton
                            variant="rectangular"
                            height={180}
                            width="100%"
                            className={styles.eventImage}
                        />
                        <div className={styles.eventDetails}>
                            <Skeleton variant="text" height={24} width="60%" />
                            <Skeleton variant="text" height={20} width="80%" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
