import React from "react";
import styles from "@/styles/404Component.module.css";

export default function NotFound() {
    return (
        <section className={styles.notFoundFullWidth}>
            <section className={styles.notFoundWrapper}>
                <section className={styles.notFoundBody}>
                    <p className={styles.backHomeText}>
                        <img src="/icons/arrow_left_white.png" alt="Arrow" />
                        <a href="/">Back to Home</a>
                    </p>
                    <section className={styles.notFoundBodyFirst}>
                        <h1>OOPS</h1>
                        <img src="/icons/404_icons/slash_white.png" alt="Slash" />
                        <img src="/icons/404_icons/curve_blue.png" alt="Curve" />
                        <img src="/icons/404_icons/triangle_white.png" alt="Triangle" />
                        <img src="/icons/404_icons/circle_purple.png" alt="Circle" />
                        <img src="/icons/404_icons/curve_white.png" alt="Curve" />
                        <img src="/icons/404_icons/semi_blue.png" alt="Semi" />
                        <img src="/icons/404_icons/square_white.png" alt="Square" />
                        <img src="/icons/404_icons/curve_purple.png" alt="Curve" />
                        <img src="/icons/404_icons/pill_white.png" alt="Pill" />
                    </section>
                    <section className={styles.notFoundBodySecond}>
                        <img src="/icons/404_icons/pill_white.png" alt="Pill" />
                        <img src="/icons/404_icons/circle_blue.png" alt="Circle" />
                        <img src="/icons/404_icons/semi_white.png" alt="Semi" />
                        <img src="/icons/404_icons/triangle_purple.png" alt="Triangle" />
                        <img src="/icons/404_icons/circle_white.png" alt="Circle" />
                        <img src="/icons/404_icons/macaroni_blue.png" alt="Macaroni" />
                        <img src="/icons/404_icons/triangle_white.png" alt="Triangle" />
                        <img src="/icons/404_icons/donut_purple.png" alt="Donut" />
                        <img src="/icons/404_icons/pill_white.png" alt="Pill" />
                        <img src="/icons/404_icons/square_blue.png" alt="Square" />
                        <img src="/icons/404_icons/curve_white.png" alt="Curve" />
                        <img src="/icons/404_icons/spike_purple.png" alt="Spike" />
                    </section>
                    <section className={styles.notFoundBodyThird}>
                        <img src="/icons/404_icons/macaroni_purple.png" alt="Macaroni" />
                        <img src="/icons/404_icons/semi_white.png" alt="Semi" />
                        <img src="/icons/404_icons/spike_blue.png" alt="Spike" />
                        <img src="/icons/404_icons/spike_white.png" alt="Spike" />
                        <img src="/icons/404_icons/pill_purple.png" alt="Pill" />
                        <img src="/icons/404_icons/triangle_white.png" alt="Triangle"  />
                        <img src="/icons/404_icons/hex_blue.png" alt="Hex" />
                        <img src="/icons/404_icons/semi_white.png" alt="Semi" />
                        <img src="/icons/404_icons/hex_purple.png" alt="Hex" />
                        <img src="/icons/404_icons/slash_white.png" alt="Slash" />
                        <img src="/icons/404_icons/curve_blue.png" alt="Curve" />
                        <img src="/icons/404_icons/pill_white.png" alt="Pill" />
                    </section>
                    <section className={styles.notFoundBodyFourth}>
                        <img src="/icons/404_icons/half_white.png" alt="Half" />
                        <img src="/icons/404_icons/slash_purple.png" alt="Slash" />
                        <img src="/icons/404_icons/curve_white.png" alt="Curve" />
                        <img src="/icons/404_icons/triangle_blue.png" alt="Triangle" />
                        <h1> PAGE NOT FOUND</h1>
                    </section>
                </section>
            </section>
        </section>
    );
}
