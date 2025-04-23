/**
 * HeroSection
 * -----------------------------------------------------------
 * This component renders the main hero section for the landing page,
 * providing a visually striking introduction and a direct call-to-action.
 *
 * Main Features:
 *  - Prominent headline to invite users to start the pet adoption journey
 *  - Decorative images arranged for visual appeal
 *  - "Start Swiping Now" button links directly to the swipe/adoption flow
 *  - Responsive and styled to be the first thing users see on the homepage
 */

import React from "react";
import Link from "next/link";
import styles from "@/styles/HeroSection.module.css";

export default function HeroSection() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBox}>
                <img
                    src="/images/hero_section_100.png"
                    alt="Hero Image"
                    className={styles.topLeft}
                />
                <img
                    src="/images/hero_section_cloud.png"
                    alt="Hero Image"
                    className={styles.topRight}
                />
                <img
                    src="/images/hero_section_pencil.png"
                    alt="Hero Image"
                    className={styles.bottomLeft}
                />
                <img
                    src="/images/hero_section_star.png"
                    alt="Hero Image"
                    className={styles.bottomRight}
                />
                <h1 className={styles.heroText}>
                    Ready to Meet Your Furry Friend?
                </h1>
                <Link href="/swipe" className={styles.ctaButton}>
                    <strong>Start Swiping Now</strong>
                </Link>
            </div>
        </section>
    );
}
