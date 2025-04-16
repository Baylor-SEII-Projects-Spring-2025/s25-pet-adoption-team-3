import React from "react";
import PropTypes from "prop-types";
import styles from "@/styles/SwipeComponent.module.css";

export default function ViewPetComponent({ pet }) {
  if (!pet) return null;

  const birthDate = new Date(pet.birthdate);
  const now = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = birthDate.toLocaleDateString("en-US", options);

  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) age--;

  return (
    <div className={styles.swipeContainer}>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.petInfo}>
              <h2 className={styles.petName}>{pet.name}</h2>
              <p>
                <img src="/icons/location_icon.png" alt="Location" className={styles.icon} />
                {pet.location}
              </p>
              <p>
                <img src="/icons/adoption_location_icon.png" alt="Adoption Center" className={styles.icon} />
                {pet.adoptionCenterName}
              </p>
              <p>
                <img src="/icons/breed_icon.png" alt="Breed" className={styles.icon} />
                {pet.breed}
              </p>
              <p>
                <img src="/icons/fertile_status_icon.png" alt="Spayed Status" className={styles.icon} />
                {pet.spayedStatus}
              </p>
              <p>
                <img src="/icons/birthday_icon.png" alt="Birthdate" className={styles.iconBirthdate} />
                {formattedDate} - ({age} years old)
              </p>

              <h3 className={styles.aboutMe}>
                About Me
                <br />
                <span className={styles.aboutMeText}>{pet.aboutMe}</span>
              </h3>

              <div className={styles.extraCardContainer}>
                <div className={styles.extraCard}>
                  <p className={styles.extraTitle}>I go crazy for</p>
                  <p className={styles.extraContent}>{pet.extra1}</p>
                </div>

                <div className={styles.extraCard}>
                  <p className={styles.extraTitle}>My favorite toy is</p>
                  <p className={styles.extraContent}>{pet.extra2}</p>
                </div>

                <div className={styles.extraCard}>
                  <p className={styles.extraTitle}>The way to win me over is</p>
                  <p className={styles.extraContent}>{pet.extra3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ViewPetComponent.propTypes = {
  pet: PropTypes.shape({
    name: PropTypes.string,
    birthdate: PropTypes.string,
    location: PropTypes.string,
    adoptionCenterName: PropTypes.string,
    breed: PropTypes.string,
    spayedStatus: PropTypes.string,
    aboutMe: PropTypes.string,
    extra1: PropTypes.string,
    extra2: PropTypes.string,
    extra3: PropTypes.string,
  }),
};
