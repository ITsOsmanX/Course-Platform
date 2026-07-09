import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import FeaturedCourses from "@/components/sections/featured-courses";
import Pricing from "@/components/sections/pricing";
import Testimonials from "@/components/sections/testimonials";
import ContactForm from "@/components/sections/contact-form";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Hero />
        <About />
        <FeaturedCourses />
        <Pricing />
        <Testimonials />
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}