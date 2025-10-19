import { useEffect, useRef } from "react";
import GalleryImage from "./GalleryImage";

export default function Gallery() {
  const images = [
    "https://i.postimg.cc/cJ5NrsbY/1.jpg",
    "https://i.postimg.cc/rm024vBH/2.jpg",
    "https://i.postimg.cc/8cL8KLPB/4.jpg",
    "https://i.postimg.cc/tggjq12p/8.jpg",
    "https://i.postimg.cc/VkmwhZtS/5.jpg",
    "https://i.postimg.cc/4xPGRvvW/6.jpg",
    "https://i.postimg.cc/Ss3qtyLq/7.jpg",
    "https://i.postimg.cc/50hdSs12/3.jpg",
    "https://i.postimg.cc/7PJqJ2DL/9.jpg",
  ];

  const smallHeight = "h-56";
  const largeHeight = "h-[26.5rem]";

  const getAnimationStyle = (delay) => ({
    animationDelay: `${delay}s`,
  });

  const containerHover =
    "transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-[0_0_20px_#f77039]";

  const imageHover = "hover:animate-glitch";

  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll("[data-anim]");
    // store timeouts so we can clear them if the component unmounts
    const timers = [];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const node = entry.target;
          if (entry.isIntersecting) {
            const animName = node.getAttribute("data-anim");

            // determine animation delay from inline style or computed style (e.g., "0.2s")
            const inlineDelay = node.style && node.style.animationDelay;
            const computedDelay = window.getComputedStyle
              ? window.getComputedStyle(node).animationDelay
              : inlineDelay;
            const delayStr = inlineDelay || computedDelay || "0s";
            const delay = parseFloat(delayStr) || 0;

            // schedule the class addition according to the delay so animations are staggered
            const t = setTimeout(() => {
              node.classList.add(`animate-${animName}`);
              node.classList.remove("opacity-0", "translate-y-6");
            }, Math.max(0, Math.round(delay * 1000)));

            timers.push(t);
            obs.unobserve(node);
          }
        });
      },
      { threshold: 0.15, root: null, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((n) => obs.observe(n));
    return () => {
      obs.disconnect();
      timers.forEach((tt) => clearTimeout(tt));
    };
  }, []);

  return (
    <div className="min-h-screen p-4 flex justify-center items-center flex-col">
      <p className="text-5xl md:text-7xl text-center text-primary font-gta mb-10">
        Gallery
      </p>

      <div ref={containerRef} className="w-[95vw] rounded-xl">
        <div className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`md:col-span-2 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
              data-anim="slideInLeft"
              style={getAnimationStyle(0.1)}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[0]} alt="Top Left" />
              </div>
            </div>
            <div
              className={`md:col-span-1 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
              data-anim="slideInRight"
              style={getAnimationStyle(0.2)}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[1]} alt="Top Right" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`md:col-span-1 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
              data-anim="slideInLeft"
              style={getAnimationStyle(0.3)}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[2]} alt="Middle Left" />
              </div>
            </div>
            <div
              className={`md:col-span-2 border-2 border-customGrey p-0 rounded-xl ${smallHeight} overflow-hidden ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
              data-anim="slideInRight"
              style={getAnimationStyle(0.4)}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[3]} alt="Middle Right" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`border-2 border-customGrey p-0 rounded-xl ${largeHeight} overflow-hidden ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
              data-anim="slideInLeft"
              style={getAnimationStyle(0.5)}
            >
              <div className={`w-full h-full overflow-hidden ${imageHover}`}>
                <GalleryImage src={images[4]} alt="Large Left" />
              </div>
            </div>

            <div className="grid grid-cols-2 col-span-2 gap-3">
              {[5, 6, 7, 8].map((idx, i) => (
                <div
                  key={idx}
                  className={`border-2 border-customGrey rounded-xl overflow-hidden h-52 ${containerHover} opacity-0 translate-y-6 transition-all duration-700`}
                  data-anim="slideInRight"
                  style={getAnimationStyle(0.6 + i * 0.1)}
                >
                  <div
                    className={`w-full h-full overflow-hidden ${imageHover}`}
                  >
                    <GalleryImage src={images[idx]} alt={`Right ${idx}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
