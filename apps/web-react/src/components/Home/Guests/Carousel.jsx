import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  forwardRef,
} from "react";
import axios from "axios";
import ProfileCard from "./ProfileCard";

// Debounce function for resizing
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const Carousel = forwardRef(
  ({ autoSlide = true, interval = 4000, cardWidth = 440, ...props }, ref) => {
    // State for lectures data
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch lectures data from API
    useEffect(() => {
      const fetchLectures = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            "https://us-central1-techspardha-87928.cloudfunctions.net/api2/lectures"
          );
          if (response.data.success) {
            setLectures(response.data.data.lectures);
          } else {
            setError("Failed to fetch lectures data");
          }
        } catch (err) {
          setError("Error fetching lectures: " + err.message);
          console.error("Error fetching lectures:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchLectures();
    }, []);

    // State for the post-loading slide-in animation
    const [show, setShow] = useState(false);

    // States for carousel functionality
    const [paused, setPaused] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const carouselRef = useRef(null);
    const containerWidthRef = useRef(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartXRef = useRef(0);
    const [dragDelta, setDragDelta] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 0
    );

    // Create looped items for infinite scroll effect
    const loopedItems = useMemo(() => {
      if (lectures && lectures.length > 0 && lectures.length > visibleCount) {
        const startClones = lectures.slice(lectures.length - visibleCount);
        const endClones = lectures.slice(0, visibleCount);
        return [...startClones, ...lectures, ...endClones];
      }
      return lectures || [];
    }, [lectures, visibleCount]);

    // State for the current slide index and managing transitions for the loop
    const [current, setCurrent] = useState(visibleCount);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Effect to handle the post-loading animation
    useEffect(() => {
      if (loading) return; // Do nothing if still loading
      const timer = setTimeout(() => {
        setShow(true);
      }, 100); // Small delay to trigger the transition
      return () => clearTimeout(timer);
    }, [loading]);

    // Effect to calculate how many cards are visible on resize
    useEffect(() => {
      const updateOnResize = () => {
        if (carouselRef.current) {
          const containerWidth = carouselRef.current.offsetWidth;
          containerWidthRef.current = containerWidth;
          const newVisibleCount = Math.floor(containerWidth / cardWidth);
          const newCount = Math.max(1, newVisibleCount);
          setVisibleCount(newCount);
          setCurrent(newCount); // Reset position on resize for stability
        }
        // Detect mobile breakpoint (<640px)
        const mobile = window.innerWidth < 640;
        setIsMobile(mobile);
        setViewportWidth(window.innerWidth || 0);
      };
      const debouncedUpdate = debounce(updateOnResize, 250);
      updateOnResize();
      window.addEventListener("resize", debouncedUpdate);
      return () => window.removeEventListener("resize", debouncedUpdate);
    }, [cardWidth]);

    // Navigation functions
    const nextSlide = useCallback(() => {
      if (!isTransitioning) return;
      setCurrent((prev) => prev + 1);
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
      if (!isTransitioning) return;
      setCurrent((prev) => prev - 1);
    }, [isTransitioning]);

    // Handler for the "magic jump" after a transition to a cloned slide ends
    const handleTransitionEnd = () => {
      if (lectures && lectures.length > 0) {
        if (current >= lectures.length + visibleCount) {
          setIsTransitioning(false);
          setCurrent(visibleCount);
        }
        if (current <= visibleCount - 1) {
          setIsTransitioning(false);
          setCurrent(lectures.length + visibleCount - 1);
        }
      }
    };

    // Re-enable transitions after a "magic jump"
    useEffect(() => {
      if (!isTransitioning) {
        const timer = setTimeout(() => setIsTransitioning(true), 50);
        return () => clearTimeout(timer);
      }
    }, [isTransitioning]);

    // Auto-slide functionality
    useEffect(() => {
      // Autoplay enabled on all viewports; skip while paused or dragging
      if (
        !autoSlide ||
        paused ||
        isDragging ||
        !lectures ||
        lectures.length === 0
      )
        return;
      const slideInterval = setInterval(nextSlide, interval);
      return () => clearInterval(slideInterval);
    }, [paused, isDragging, autoSlide, interval, nextSlide, lectures]);

    // Pause when tab/page is hidden, resume when visible
    useEffect(() => {
      const onVisibility = () => {
        if (document.hidden) {
          setPaused(true);
        } else {
          // Small delay to avoid immediate jump on return
          setTimeout(() => setPaused(false), 300);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () =>
        document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    // Passive touch listeners to pause/resume smoothly on touch
    useEffect(() => {
      const el = carouselRef.current;
      if (!el) return;
      let resumeTimeout;

      const onTouchStart = (e) => {
        if (e.touches && e.touches.length > 0) {
          dragStartXRef.current = e.touches[0].clientX;
          setDragDelta(0);
          setIsDragging(true);
          setPaused(true);
        }
      };

      const onTouchMove = (e) => {
        if (e.touches && e.touches.length > 0) {
          const x = e.touches[0].clientX;
          const delta = x - dragStartXRef.current;
          setDragDelta(delta);
        }
      };

      const onTouchEndOrCancel = () => {
        const baseWidth = isMobile
          ? viewportWidth || containerWidthRef.current
          : containerWidthRef.current;
        const threshold = isMobile
          ? Math.max(40, (baseWidth || 0) * 0.25) // 25% of viewport width or 40px on mobile
          : Math.max(30, (baseWidth || 0) * 0.08); // 8% of container or 30px on desktop
        if (dragDelta > threshold) {
          prevSlide();
        } else if (dragDelta < -threshold) {
          nextSlide();
        }
        setDragDelta(0);
        setIsDragging(false);
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => setPaused(false), 1500);
      };

      el.addEventListener("touchstart", onTouchStart, { passive: true });
      el.addEventListener("touchmove", onTouchMove, { passive: true });
      el.addEventListener("touchend", onTouchEndOrCancel, { passive: true });
      el.addEventListener("touchcancel", onTouchEndOrCancel, { passive: true });

      return () => {
        el.removeEventListener("touchstart", onTouchStart);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEndOrCancel);
        el.removeEventListener("touchcancel", onTouchEndOrCancel);
        if (resumeTimeout) clearTimeout(resumeTimeout);
      };
    }, [dragDelta, nextSlide, prevSlide]);

    if (loading) {
      return (
        <div
          ref={ref}
          id="guests"
          data-section="guests"
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="text-5xl md:text-7xl font-gta tracking-wider w-full text-center mb-4 text-[#F77039]">
            Guest Lectures
          </div>
          <div className="text-white text-xl">Loading lectures...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          ref={ref}
          id="guests"
          data-section="guests"
          className="flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="text-5xl md:text-7xl font-gta tracking-wider w-full text-center mb-4 text-[#F77039]">
            Guest Lectures
          </div>
          <div className="text-white text-xl">Error: {error}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        id="guests"
        data-section="guests"
        className={`
          transition-all duration-700 ease-out 
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
        `}
        {...props}
      >
        <div className="flex flex-col gap-8 w-full mx-auto">
          <div className="text-5xl md:text-7xl font-gta tracking-wider w-full text-center mb-4 text-[#F77039] text-shadow-xl text-shadow-[#F77039]">
            Guest Lectures
          </div>

          <div
            ref={carouselRef}
            className="relative w-full overflow-hidden"
            style={{ touchAction: "pan-y" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div
              className="flex w-full"
              onTransitionEnd={handleTransitionEnd}
              style={{
                width: (() => {
                  if (loopedItems.length === 0) return "100%";
                  // On mobile, each item is 100vw, so width is items * 100vw
                  if (isMobile)
                    return `${loopedItems.length * viewportWidth}px`;
                  return `${(100 * loopedItems.length) / visibleCount}%`;
                })(),
                transition:
                  isTransitioning && !isDragging
                    ? "transform 0.7s ease-in-out"
                    : "none",
                willChange: "transform",
                transform: (() => {
                  if (loopedItems.length === 0) return "translateX(0)";
                  if (isMobile) {
                    const stepPx =
                      viewportWidth || containerWidthRef.current || 1;
                    const basePx = current * stepPx;
                    const finalPx = -basePx + (dragDelta || 0);
                    return `translateX(${finalPx}px)`;
                  }
                  const basePercent = (current * 100) / loopedItems.length;
                  const cw = containerWidthRef.current || 1;
                  const totalWidthFactor = loopedItems.length / visibleCount; // inner width vs container
                  const offsetPercent =
                    (dragDelta / (cw * totalWidthFactor)) * 100;
                  const finalPercent = -basePercent + (offsetPercent || 0);
                  return `translateX(${finalPercent}%)`;
                })(),
              }}
            >
              {loopedItems.map((lecture, idx) => (
                <div
                  key={idx}
                  className="box-border p-5"
                  style={{
                    flex: (() => {
                      if (loopedItems.length === 0) return "0 0 100%";
                      if (isMobile) return `0 0 ${viewportWidth}px`;
                      return `0 0 ${100 / loopedItems.length}%`;
                    })(),
                  }}
                >
                  <div className="h-full transform transition-transform duration-500 w-full flex justify-around hover:scale-105 hover:-translate-y-2">
                    <ProfileCard
                      name={lecture.name}
                      description={lecture.desc}
                      imageUrl={lecture.imageUrl}
                      linkedInlink={lecture.linkedin}
                      xlink={lecture.facebook}
                      instagramlink={lecture.insta}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center transition-all duration-300 hover:bg-white/20"
              aria-label="Previous Slide"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white rounded-full h-10 w-10 md:h-12 md:w-12 flex items-center justify-center transition-all duration-300 hover:bg-white/20"
              aria-label="Next Slide"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Carousel.displayName = "Carousel";

export default Carousel;
