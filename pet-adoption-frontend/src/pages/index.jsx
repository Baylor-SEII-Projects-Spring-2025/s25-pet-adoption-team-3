import NavbarHome from "@/components/homepage/NavbarHome";
import HeroSection from "@/components/homepage/HeroSection";
import AboutSection from "@/components/homepage/AboutSection";
import PetOptions from "@/components/homepage/PetOptions";
import CTASection from "@/components/homepage/CTASection";
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
    </>
    );
}
