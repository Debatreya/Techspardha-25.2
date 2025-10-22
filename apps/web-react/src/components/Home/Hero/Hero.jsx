import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
// Removed local ReactLenis to avoid nested scroll containers causing different scroll behavior
import Navbar from "../navbar/navbar";
import "./hero.css";

const SECTION_HEIGHT = 700;
const Hero = () => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleError = () => setHasError(true);
    const handleCanPlay = () => setHasError(false);

    v.addEventListener("error", handleError);
    v.addEventListener("canplay", handleCanPlay);

    return () => {
      v.removeEventListener("error", handleError);
      v.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [30, 100], [1, 0]); // Dynamically control opacity

  return (
    <>
      {/* === HERO SECTION === */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Navbar */}
        <div className="fixed top-0 left-0 w-full z-[1000]">
          <Navbar />
        </div>
        {/* Scrolling video (using window scroll only) */}
        <div className="relative min-h-screen sm:h-[100vh] flex flex-col items-center justify-center">
          <motion.div
            className="fixed top-0 left-0 w-full flex flex-col items-center justify-center h-screen text-center text-white px-4 sm:px-8"
            style={{ opacity, willChange: "opacity" }}
          >
            <p className="neon-orange-text text-5xl md:text-8xl text-center text-primary font-gta mb-10 ">
              Techspardha
            </p>
            <p className="neon-text text-5xl md:text-7xl text-center font-gta mb-10">
              Transcending Paradigms
            </p>
          </motion.div>
        </div>

        <ScrollExpand videoRef={videoRef} hasError={hasError} />
      </section>
    </>
  );
};

// --- Scroll Expand Animation ---
const ScrollExpand = ({ videoRef, hasError }) => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1000], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1000], [75, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  // Reduce scale amplitude to lower GPU work and jank
  const scale = useTransform(scrollY, [0, 800], [0.98, 1.05]);
  const opacity = useTransform(scrollY, [0, 1000], [1, 0.5]);

  return (
    <motion.div
      className="relative rounded-2xl z-10 top-0 h-[50vh] sm:min-h-screen w-full overflow-hidden -mt-60 sm:-mt-80"
      // class="relative rounded-2xl z-10 top-0 h-[50vh] w-full overflow-hidden -mt-60 sm:-mt-80"
      style={{
        clipPath,
        scale,
        willChange: "transform, clip-path",
        transform: "translateZ(0)",
      }}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src="/videos/hero_video.mp4"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src="/videos/hero_video.gif"
          alt="Expanding Visual"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          decoding="async"
        />
      )}
    </motion.div>
  );
};

export default Hero;
