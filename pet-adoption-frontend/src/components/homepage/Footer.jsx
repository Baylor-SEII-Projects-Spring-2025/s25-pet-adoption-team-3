import React from "react";
import styles from "@/styles/Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <section className={styles.footerContent}>
                <div className={styles.socialMedia}>
                    <a href="https://github.com/Baylor-SEII-Projects-Spring-2025/s25-pet-adoption-team-3">
                        <img src="/icons/github_icon.png" alt="Github" />
                    </a>
                    <a href="#">
                        <img src="/icons/instagram_icon.png" alt="Instagram" />
                    </a>
                    <a href="#">
                        <img src="/icons/facebook_icon.png" alt="Facebook" />
                    </a>
                </div>
                <p>© {new Date().getFullYear()} Adopt, Don’t Shop</p>
            </section>
        </footer>
    );
}
