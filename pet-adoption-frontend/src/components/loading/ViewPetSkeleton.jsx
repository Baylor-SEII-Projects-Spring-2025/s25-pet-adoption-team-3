/**
 * ViewPetSkeleton
 * -----------------------------------------------------------
 * This component provides a skeleton loader for the "View Pet" page,
 * visually mimicking the pet profile and image carousel while data loads.
 *
 * Main Features:
 *  - Skeleton loader for pet image carousel and navigation buttons
 *  - Placeholder skeletons for pet info, traits, and extra details
 *  - Prevents layout shifts and keeps UI consistent during async fetches
 *  - Styled to match the SwipeComponent/ViewPetComponent layout
 */

import React, { useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import styles from "@/styles/SwipeComponent.module.css";

export default function ViewPetSkeleton() {
  const [imageIndex] = useState(0);

  return (
    <div className={styles.swipeContainer}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.carousel}>
              <div className={styles.carouselContainer}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100vh"
                  className={styles.carouselImage}
                  sx={{ borderRadius: "20px" }}
                />
                <div className={styles.imageCounter}>
                  {imageIndex + 1} / 4
                </div>
                <button
                  className={`${styles.carouselButton} ${styles.prevButton}`}
                  style={{ pointerEvents: "none" }}
                  aria-label="Previous image"
                >
                  &#10094;
                </button>
                <button
                  className={`${styles.carouselButton} ${styles.nextButton}`}
                  style={{ pointerEvents: "none" }}
                  aria-label="Next image"
                >
                  &#10095;
                </button>
              </div>
            </div>

            <div className={styles.petInfo}>
              <Skeleton variant="text" width={150} height={48} sx={{ mb: 2 }} />
              {[...Array(5)].map((_, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                  <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                  <Skeleton variant="text" width={200} height={28} />
                </div>
              ))}
              <h3 className={styles.aboutMe} style={{ marginTop: 18 }}>
                <Skeleton variant="text" width={90} height={28} />
                <span className={styles.aboutMeText}>
                  <Skeleton variant="text" width={300} height={22} />
                  <Skeleton variant="text" width={200} height={22} />
                </span>
              </h3>
              <div className={styles.extraCardContainer}>
                {[...Array(3)].map((_, i) => (
                  <div className={styles.extraCard} key={i}>
                    <Skeleton variant="text" width={120} height={22} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={180} height={28} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
