/**
 * PetOptions Component
 * -----------------------------------------------------------
 * This component displays two main adoption categories—dogs and cats—
 * offering users quick visual options to explore available pets.
 *
 * Main Features:
 *  - Showcases separate sections for finding a dog or a cat
 *  - Includes fun images, catchy headings, and playful descriptions
 *  - Visually guides users toward their preferred pet type
 *  - Styled for a welcoming, engaging landing or category page section
 */

import React from "react";
import styles from "@/styles/PetOptions.module.css";

export default function PetOptions() {
    return (
        <section className={styles.petOptionsWrapper}>
            <section className={styles.petOptions}>
                <div className={styles.petOption}>
                    <img
                        src="/images/pet_options_left.png"
                        alt="Find Your Dog"
                    />
                    <h3>Find Your Pooch</h3>
                    <p>
                        Want someone to go fetch your ball, or to constantly
                        keep your feet warm? Look no further!
                    </p>
                </div>

                <div className={styles.petOption}>
                    <img
                        src="/images/pet_options_right.png"
                        alt="Find Your Kitty"
                    />
                    <h3>Find Your Kitty</h3>
                    <p>
                        Perfer someone to completely ignore you unless they want
                        food or cuddles? Cats are waiting!
                    </p>
                </div>
            </section>
        </section>
    );
}
