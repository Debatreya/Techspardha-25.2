import Gallery from "../components/Home/Gallery/Gallery";
import Carousel from "../components/Home/Guests/Carousel";
import Event from "../components/Home/Event/Event";
import CountdownTimer from "../components/Home/Timer/CountdownTimer.jsx";
import FAQ from "../components/Home/FAQ/FAQ.jsx";
import AboutUs from "../components/Home/AboutUs/AboutUs.jsx";
import Footer from "../components/Global/Footer/footer.jsx";
import Sponsors from "../components/Home/Sponsors/Sponsors.jsx";
import SocietyMarquee from "../components/Home/SocietyMarquee/SocietyMarquee.jsx";
import Hero from "../components/Home/Hero/Hero.jsx";
import StarBackground from "../components/Home/StarBackground/StarBackground.jsx";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";

function Home() {
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      className="w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #050510, #0c0f14 70%, #05060a)",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {pageLoading && <Loader label="Loading home" />}
      {/* Star background - fixed position behind all content */}
      <StarBackground />

      {/* Content - all with position relative to appear above the star background */}
      <div className="relative z-10">
        <Hero />
        <CountdownTimer />
        <SocietyMarquee />
        <AboutUs />
        <Event />
        <Carousel />
        <Gallery />
        <Sponsors />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
