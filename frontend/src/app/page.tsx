import LandingLayout from "@/components/layout/landing-layout";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import FeaturedCourses from "@/components/sections/featured-courses";
import Testimonials from "@/components/sections/testimonials";
import ContactForm from "@/components/sections/contact-form";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <LandingLayout>
      <Hero />
      <About />
      <FeaturedCourses />
      <Testimonials />
      <ContactForm />
      <Footer />
    </LandingLayout>
  );
}
