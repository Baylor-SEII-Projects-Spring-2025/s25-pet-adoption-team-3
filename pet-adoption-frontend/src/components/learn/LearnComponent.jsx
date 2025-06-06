/**
 * LearnPage
 * -----------------------------------------------------------
 * This component educates users about the benefits of pet adoption,
 * using engaging visuals and concise reasons to adopt.
 *
 * Main Features:
 *  - Four themed sections: Save a Life, Reduce Pet Overpopulation,
 *    Find the Perfect Match, and Support Ethical Pet Ownership
 *  - Each section has a compelling image, headline, and supporting text
 *  - Organized in a responsive grid for readability and appeal
 *  - Designed to encourage and inform users on the "Why Adopt?" page
 */

import React from "react";
import styles from "@/styles/LearnPage.module.css";

const LearnPage = () => {
  return (
    <div className={styles.learnBg}>
      <div className={styles.learnContainer}>
        <h1 className={styles.learnHeading}>Why Adopt?</h1>
        
        <div className={styles.learnSectionGrid}>
          <section className={styles.learnSection}>
            <img src="https://wallpaperaccess.com/full/2799120.jpg" alt="Save a life" className={styles.learnImage} />
            <div className={styles.learnSectionText}>
              <h2>Save a life</h2>
              <p>Millions of animals enter shelters each year. By adopting, you are giving one a second chance at life and love.</p>
            </div>
          </section>

          <section className={styles.learnSection}>
            <img src="https://www.jaxhumane.org/wp-content/uploads/2019/12/Group-of-kittens-needing-foster-1024x768.jpg" alt="Reduce Pet Population" className={styles.learnImage} />
            <div className={styles.learnSectionText}>
              <h2>Reduce Pet Overpopulation</h2>
              <p>Adopting helps fight overpopulation and decreases the number of animals euthanized every year.</p>
            </div>
          </section>

          <section className={styles.learnSection}>
            <img src="https://stevedalepetworld.com/wp-content/uploads/2021/05/hab05-11-1536x1025.jpg" alt="Perfect Match" className={styles.learnImage} />
            <div className={styles.learnSectionText}>
              <h2>Find the Perfect Match</h2>
              <p>Shelters and adoption centers have a wide variety of breeds, personalities, and ages to match your lifestyle.</p>
            </div>
          </section>

          <section className={styles.learnSection}>
            <img src="https://th.bing.com/th/id/OIP.j3sv7fUmxnevjLjwppnqrgAAAA?rs=1&pid=ImgDetMain" alt="Ethical Pet Ownership" className={styles.learnImage} />
            <div className={styles.learnSectionText}>
              <h2>Support Ethical Pet Ownership</h2>
              <p>By adopting, you are taking a stand against puppy mills and unethical breeding practices.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;