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
