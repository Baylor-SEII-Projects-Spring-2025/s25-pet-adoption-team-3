/**
 * CTASection (Call To Action)
 * -----------------------------------------------------------
 * This component provides a visually engaging call-to-action section,
 * encouraging users to start the adoption process.
 *
 * Main Features:
 *  - Prominent heading and supporting message
 *  - Thematic image to capture attention
 *  - Bold "Start Swiping Now" button to drive user engagement
 *  - Encourages users to take action and join the platform
 *  - Styled for strong visibility on landing or info pages
 */

import React from "react";
import styles from "@/styles/CTASection.module.css";

export default function CTASection() {
    return (
        <section className={styles.ctaSection}>
            <img
                src="/images/CTA_section_smile.png"
                alt="Ready to Meet Your New Best Friend?"
            />
            <h2>Ready to Meet Your New Best Friend?</h2>
            <p>
                Join us at “Adopt don’t Shop” and let’s make the world a better
                place for these lovely creatures. Swipe right for love, swipe
                right for happiness, swipe right for a wagging tail to greet you
                when you get home.
            </p>
            <button className={styles.ctaButton}>Start Swiping Now</button>
        </section>
    );
}
