/**
 * Home Page
 * -----------------------------------------------------------
 * This is the main landing page of the application, welcoming users and
 * introducing them to the pet adoption platform.
 *
 * Main Features:
 *  - Renders the homepage navigation bar (NavbarHome)
 *  - Displays a hero section with headline and call-to-action
 *  - Provides an about section, pet adoption options, and a prominent CTA
 *  - Includes a footer with social links and copyright
 *  - Designed to orient users and guide them to explore or begin adopting
 */

import React from "react";
import NavbarHome from "@/components/homepage/NavbarHome";
import HeroSection from "@/components/homepage/HeroSection";
import AboutSection from "@/components/homepage/AboutSection";
import PetOptions from "@/components/homepage/PetOptions";
import CTASection from "@/components/homepage/CTASection";
import FloatingEventFAB from "@/components/homepage/FloatingEventFAB";
import Footer from "@/components/homepage/Footer";

export default function HomePage() {
    return (
        <>
            <NavbarHome />
            <HeroSection />
            <AboutSection />
            <PetOptions />
            <CTASection />
            <Footer />
            <FloatingEventFAB />
        </>
    );
}
