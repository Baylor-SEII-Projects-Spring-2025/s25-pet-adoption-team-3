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
                        Want someone to go fetch your ball, or
                        to constantly keep your feet warm?
                        Look no further!
                    </p>
                </div>

                <div className={styles.petOption}>
                    <img
                        src="/images/pet_options_right.png"
                        alt="Find Your Kitty"
                    />
                    <h3>Find Your Kitty</h3>
                    <p>
                        Perfer someone to completely ignore
                        you unless they want food or cuddles?
                        Cats are waiting!
                    </p>
                </div>
            </section>
        </section>
    );
}
