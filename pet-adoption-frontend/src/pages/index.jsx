import NavbarHome from "@/components/NavbarHome";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PetOptions from "@/components/PetOptions";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
    return (
    <>
        <NavbarHome />
        <HeroSection />
        <AboutSection />
        <PetOptions />
        <CTASection />
        {/* <Footer />  */}
    </>
    );
}
