import React, { useEffect, useRef, useState, forwardRef } from "react";

const contentBlocks = [
  {
    title: "Legacy Since 1995",
    description:
      "Started as ‘Technospect’, later renamed to ‘Literati’, and finally rebranded as Techspardha during NIT Kurukshetra’s Golden Jubilee in 2013, celebrating decades of innovation and excellence.",
    iconColor: "text-orange-400",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Clock-history icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    key: "legacy",
  },
  {
    title: "12,000+ Attendees, 30+ NITs & Top Universities",
    description:
      "Techspardha unites tech enthusiasts, innovators, and creators from across India—fostering a spirit of collaboration, competition, and creativity.",
    iconColor: "text-orange-400",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Users-group icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a4 4 0 00-3-3.87V9a7 7 0 10-14 0v5.13A4 4 0 002 18v2h5m5 0v-2a2 2 0 012-2h0a2 2 0 012 2v2h-4z"
        />
      </svg>
    ),
    key: "reach",
  },
  {
    title: "Events, Workshops & Guest Lectures",
    description:
      "From robotics and coding challenges to management simulations, exhibitions, and guest sessions by industry pioneers—Techspardha is a melting pot of innovation and opportunity.",
    iconColor: "text-orange-400",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Spark or circuit-icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    key: "events",
  },
  {
    title: "Technological & Managerial Excellence",
    description:
      "A convergence of engineering brilliance and strategic innovation—Techspardha bridges the gap between technology and management for holistic growth.",
    iconColor: "text-orange-400",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Trophy icon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 21h8m-4-4v4m6-15h3v3a5 5 0 01-5 5H6a5 5 0 01-5-5V6h3m12 0V3H6v3"
        />
      </svg>
    ),
    key: "excellence",
  },
];

const allContentBlocks = [
  ...contentBlocks,
  ...contentBlocks.map((b) => ({ ...b, key: b.key + "-clone1" })),
];

const AboutUs = forwardRef((props, ref) => {
  const carouselContainerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cardGlowPos, setCardGlowPos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  // ---- Auto-scroll ----
  useEffect(() => {
    const container = carouselContainerRef.current;
    const wrapper = contentWrapperRef.current;
    if (!container || !wrapper) return;

    const originals = wrapper.querySelectorAll('[data-original-block="true"]');
    if (!originals.length) return;

    let totalHeight = 0;
    originals.forEach((block) => (totalHeight += block.offsetHeight));

    let y = 0;
    const speed = 0.4;
    let raf;

    const loop = () => {
      if (!isCarouselHovered) {
        y += speed;
        if (y >= totalHeight) {
          y = 0;
          container.scrollTop = 0;
        }
        container.scrollTop = y;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isCarouselHovered]);

  // ---- 3D Depth Push-Pull ----
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = -((y - centerY) / centerY) * 5;
    const depth = ((x - centerX) / centerX) * 10;

    setCardGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(${depth}px)
      scale(1.03)
    `;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      id="aboutus"
      data-section="aboutus"
      className="relative overflow-hidden min-h-[70vh] text-white bg-[#05070B] flex items-center justify-center py-4 px-4 sm:px-10 mt-16"
    >
      {/* Main Tilt Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative z-10 max-w-7xl w-full rounded-2xl p-10 md:p-14 bg-gradient-to-br from-[#0A0D14] to-[#080B10] backdrop-blur-md transition-transform duration-300 ease-out ${
          isHovered
            ? "border-2 border-orange-500 shadow-[0_0_25px_5px_rgba(255,140,0,0.4)]"
            : "border border-[#1f2937]/60 shadow-[0_0_40px_rgba(255,140,0,0.1)]"
        }`}
        style={{
          transformStyle: "preserve-3d",
          transition: "all 0.3s ease-out",
        }}
      >
        {/* Inner Orange Glow */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle at ${cardGlowPos.x}% ${cardGlowPos.y}%, rgba(255,140,0,0.25), transparent 70%)`,
            mixBlendMode: "screen",
            filter: "blur(60px)",
          }}
        ></div>

        <div className="flex flex-col lg:flex-row gap-12 items-center relative z-10">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5 text-center lg:text-left">
            <p className="text-orange-500 text-lg font-semibold tracking-wider uppercase">
              About Techspardha
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tighter">
              Celebrating Innovation & <br className="hidden md:block" /> Inspiring Competition
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-lg mx-auto lg:mx-0">
              <strong>Techspardha</strong> is the annual techno-managerial festival of{" "}
              <strong>National Institute of Technology, Kurukshetra</strong>.  
              Since its inception in 1995, it has served as a dynamic platform for innovation,
              creativity, and collaboration, hosting thousands of brilliant minds from across India.
            </p>
            <button className="w-fit bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg mx-auto lg:mx-0 hover:shadow-[0_0_25px_5px_rgba(255,140,0,0.4)] transform hover:scale-[1.03] active:scale-[0.97]">
              Explore More
            </button>
          </div>

          {/* Right Carousel */}
          <div
            ref={carouselContainerRef}
            className="w-full lg:w-1/2 h-[350px] relative overflow-y-hidden rounded-2xl bg-[#0A0D14]/50 backdrop-blur-md border border-[#1f2937]/60 shadow-[0_0_40px_rgba(255,140,0,0.08)]"
            onMouseEnter={() => setIsCarouselHovered(true)}
            onMouseLeave={() => setIsCarouselHovered(false)}
          >
            <div className="absolute top-0 left-0 w-full h-1/4 z-30 bg-gradient-to-b from-[#05070B] to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/4 z-30 bg-gradient-to-t from-[#05070B] to-transparent pointer-events-none"></div>

            <div ref={contentWrapperRef} className="flex flex-col min-h-full relative z-10">
              {allContentBlocks.map((block, index) => (
                <div
                  key={block.key}
                  data-original-block={index < contentBlocks.length ? "true" : "false"}
                  className={`w-full p-5 md:p-7 flex items-start gap-5 bg-transparent rounded-xl transition-all duration-500 hover:bg-[#1a0e07]/60 hover:shadow-[0_0_30px_rgba(255,140,0,0.2)] ${
                    index < contentBlocks.length - 1 || index >= contentBlocks.length
                      ? "border-b border-[#1f2937]/70"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-orange-500/10">
                    <span className={block.iconColor}>{block.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-white">{block.title}</h3>
                    <p className="text-gray-400 text-sm">{block.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AboutUs.displayName = 'AboutUs';

export default AboutUs;