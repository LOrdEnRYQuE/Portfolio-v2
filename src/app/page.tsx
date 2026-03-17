import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ContactCta from "@/components/sections/ContactCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <FeaturedProjects />
      <ContactCta />
    </>
  );
}
