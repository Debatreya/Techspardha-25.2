import React, { useEffect, useState, forwardRef } from "react";
import bgImg from "../../../assets/photos/Sponsors/Container.png";
import axios from "axios";

const cycleMs = 4000;

const Sponsors = forwardRef(({ ...props }, ref) => {
  // sponsorImages: array of { imageUrl, name, targetUrl }
  const [sponsorImages, setSponsorImages] = useState([]);
  const [groupIndex, setGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://us-central1-techspardha-87928.cloudfunctions.net/api2/sponsors"
        );
        const payload = res.data?.data ?? res.data;

        const sections = payload?.sponsors ?? payload;
        if (!sections || !Array.isArray(sections)) {
          if (mounted) setError("Invalid sponsors response");
          return;
        }

        const flat = [];
        sections.forEach((sec) => {
          const sponsors = sec?.sponsors ?? [];
          sponsors.forEach((s) => {
            if (s?.imageUrl)
              flat.push({
                imageUrl: s.imageUrl,
                name: s.name ?? "",
                targetUrl: s.targetUrl ?? "",
              });
          });
        });

        if (mounted) {
          setSponsorImages(flat);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch sponsors", err);
        if (mounted) setError(err.message || "Failed to fetch sponsors");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSponsors();
    return () => {
      mounted = false;
    };
  }, []);

  // Build groups for cycling UI (each group up to 6 items)
  const groups = [];
  const perGroup = 6;
  const totalGroups =
    sponsorImages.length > 0 ? Math.ceil(sponsorImages.length / perGroup) : 0;
  for (let g = 0; g < totalGroups; g++) {
    const start = g * perGroup;
    const slice = sponsorImages.slice(start, start + perGroup);
    // If last slice is shorter than perGroup, fill by wrapping around the sponsorImages
    if (slice.length < perGroup && sponsorImages.length > 0) {
      const filled = [...slice];
      let idx = 0;
      while (filled.length < perGroup) {
        // take from beginning, but avoid duplicating the exact same items in this slice if possible
        const candidate = sponsorImages[idx % sponsorImages.length];
        filled.push(candidate);
        idx++;
      }
      groups.push(filled);
    } else {
      groups.push(slice);
    }
  }

  useEffect(() => {
    if (groups.length === 0) return;
    const id = setInterval(() => {
      setGroupIndex((i) => (i + 1) % groups.length);
    }, cycleMs);
    return () => clearInterval(id);
  }, [groups.length]);

  const activeGroup = groups.length ? groups[groupIndex] : [];

  return (
    <div
      ref={ref}
      id="sponsors"
      data-section="sponsors"
      className="w-full h-[50vh] md:h-screen flex items-center justify-center relative overflow-hidden"
      {...props}
    >
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-16 font-gta tracking-wide">
          OUR SPONSORS
        </h1>

        {loading ? (
          <div className="text-white text-xl">Loading sponsors...</div>
        ) : error ? (
          <div className="text-red-400 text-lg">
            Error loading sponsors: {error}
          </div>
        ) : sponsorImages.length === 0 ? (
          <div className="text-white text-xl">No sponsors available</div>
        ) : (
          <div className="grid grid-cols-3 gap-x-4 md:gap-x-20 gap-y-14 justify-center items-center md:px-0">
            {activeGroup.map((s, i) => (
              <div
                key={(s.targetUrl || s.imageUrl) + "-" + i}
                className="group flex items-center justify-center animate-rushToScreen will-change-[transform,filter,opacity] min-h-16 min-w-[120px] md:min-h-20 md:min-w-[160px]"
              >
                {s.targetUrl ? (
                  <a
                    href={s.targetUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      src={s.imageUrl}
                      alt={s.name || `Sponsor ${i + 1}`}
                      draggable="false"
                      className="w-24 h-14 md:w-48 md:h-24 object-contain brightness-110 transition-transform duration-[220ms] ease-smoothLift group-hover:-translate-y-1.5 group-hover:scale-[1.04] group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] [backface-visibility:hidden] will-change-transform will-change-filter origin-center [image-rendering:optimizeQuality]"
                    />
                  </a>
                ) : (
                  <img
                    src={s.imageUrl}
                    alt={s.name || `Sponsor ${i + 1}`}
                    draggable="false"
                    className="w-24 h-14 md:w-48 md:h-24 object-contain brightness-110 transition-transform duration-[220ms] ease-smoothLift group-hover:-translate-y-1.5 group-hover:scale-[1.04] group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)] [backface-visibility:hidden] will-change-transform will-change-filter origin-center [image-rendering:optimizeQuality]"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[80vw] max-w-[900px] aspect-square"
        
      />
    </div>
  );
});

Sponsors.displayName = "Sponsors";

export default Sponsors;
