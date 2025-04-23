/**
 * AboutSection
 * -----------------------------------------------------------
 * This component displays an overview of the "Adopt, Don't Shop" platform.
 * It introduces users to the app's mission, experience, and pet-matching features.
 *
 * Main Features:
 *  - Welcoming heading and engaging introduction text
 *  - Explains how the service connects adopters to pets
 *  - Highlights unique features (swipe, match, and meet)
 *  - Styled as a distinct section for landing or about pages
 */

import React from "react";
import styles from "@/styles/AboutSection.module.css";

export default function AboutSection() {
    return (
        <section className={styles.aboutSection}>
            <section className={styles.aboutSectionText}>
                <h2>
                    <strong>Find Your New BFF</strong>
                </h2>
                <p>
                    Welcome to &quot;Adopt, Don&apos;t Shop&quot; – the
                    evolutionary way to find your new furry friend. From
                    shelters to wagging tails, we&apos;ve got the pet love you
                    could ask for and more.
                </p>
                <br />
                <p>
                    Think of us as a pet matchmaking service. We pair you up
                    with adorable animals from various adoption centers. You can
                    swipe, play, and get to know them virtually. Once
                    you&apos;ve matched, meet them offline and let the snuggles
                    roll!
                </p>
                <br />
                <p>
                    So why wait? Get ready to swipe your way to unconditional
                    love!
                </p>
            </section>
        </section>
    );
}
