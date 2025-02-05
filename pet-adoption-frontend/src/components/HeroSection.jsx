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
                <button className={styles.ctaButton}>
                    <strong>Start Exploring Now</strong>
                </button>
            </div>
        </section>
    );
}
