import React from "react";
import styles from "@/styles/SwipeComponent.module.css"

export function SwipeComponent(){
    return (
        <div className={styles.container}>
            <div className={styles.petCard}>
                {/*<Image src={"https://via.placeholder.com/400"} width={400} height={400} className={styles.petImage}/>*/}
                <div className={styles.petDetails}>
                    <h1>PET NAME</h1> {/*put name here*/}
                    <p>📍 LOCATION</p> {/*put location here*/}
                    <p>🏠 ADOPTION CENTER</p> {/*put center here*/}
                    <p>🐾 PET BREED </p> {/*put breed here*/}
                    <p>⚧ PET GENDER</p> {/*put gender here*/}
                    <p>📅 MAY 29, 2003 - UNC STATUS</p> {/*put birthdate here*/}
                    <h2>About Me</h2>
                    <p>about this pet is here </p> {/*put aboutMe here*/}
                    <div className={styles.petCard}>
                        <h3>I Go Crazy For</h3>
                        <p className={styles.highlight}></p> {/*put extra1 here*/}
                    </div>
                    <div>
                        <br>
                        </br>
                    </div>
                    <div className={styles.petCard}>
                        <h3>My Favorite Toy is</h3>
                        <p className={styles.highlight}></p>{/*put extra2 here*/}
                    </div>
                </div>
            </div>
        </div>
    );
};