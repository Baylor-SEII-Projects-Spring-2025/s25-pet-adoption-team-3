import Link from "next/link";
import styles from "@/styles/NavbarHome.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <img
            src="/logos/adopt_logo_white_text.png"
            alt="Adopt, Don't Shop Logo"
          />
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/learn">Learn</Link>
        </li>
        <li>
          <Link href="/locations">Locations</Link>
        </li>
        <li>
          <Link href="/gallery">Gallery</Link>
        </li>
      </ul>
      <div className={styles.auth}>
        <Link href="/login" className={styles.loginButton}>
          Log In
        </Link>
      </div>
    </nav>
  );
}
