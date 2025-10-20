import React, { useEffect, useMemo, useState } from "react";
import ProfileCard from "../components/Developers/DeveloperCard";
import Navbar from "../components/Home/navbar/navbar.jsx";
import Footer from "../components/Global/Footer/footer.jsx";
import StarBackground from "../components/Home/StarBackground/StarBackground.jsx";

const API_URL =
  "https://us-central1-techspardha-87928.cloudfunctions.net/api2/about";

const extractHandle = (dev) => {
  // Try explicit fields first
  if (dev.handle) return dev.handle.replace(/^@/, "");
  const candidates = [dev.insta, dev.github, dev.linkedin];
  for (const url of candidates) {
    if (!url) continue;
    try {
      const p = new URL(url).pathname.replace(/\/+$/, "").split("/");
      const last = p[p.length - 1];
      if (last) return last.replace(/^@/, "");
    } catch (e) {
      // ignore malformed urls
    }
  }
  return (dev.name || "user").toLowerCase().replace(/\s+/g, "");
};

export default function Developer() {
  const [groups, setGroups] = useState([]); // [{ year, devs: [] }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const devs = json?.data?.devs ?? [];

        const map = {};
        const order = [];
        devs.forEach((d) => {
          const year = d.year ?? "Unknown";
          if (!map[year]) {
            map[year] = [];
            order.push(year);
          }
          map[year].push(d);
        });

        const grouped = order.map((year) => ({ year, devs: map[year] }));
        setGroups(grouped);
      })
      .catch((err) => {
        console.error("Failed to fetch developers:", err);
        setError(err?.message || "Failed to load");
        setGroups([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Years list for chips
  const years = useMemo(() => ["All", ...groups.map((g) => g.year)], [groups]);

  // Flattened devs for "All" or get by selected year
  const filteredDevs = useMemo(() => {
    if (selectedYear === "All") {
      return groups.flatMap((g) => g.devs);
    }
    return groups.find((g) => g.year === selectedYear)?.devs ?? [];
  }, [groups, selectedYear]);

  return (
    <div
      className="w-full overflow-x-hidden"
      style={{
        background: "linear-gradient(to bottom, #050510, #0c0f14 70%, #05060a)",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Star background */}
      {/* <StarBackground /> */}

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen px-6 py-10">
          {/* Hero Header */}
          <div className="mx-auto max-w-6xl text-center mb-10">
            <h1 className="font-extrabold tracking-tight text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-orange-500 via-amber-300 to-orange-600 bg-clip-text text-transparent font-rationale">
                Our Developers
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/80">
              Meet the builders behind Techspardha ’25
            </p>
            <div className="mt-5 mx-auto h-[3px] w-40 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600" />
          </div>

          {/* Year filter chips */}
          {groups.length > 0 && (
            <div className="mx-auto max-w-6xl mb-8 flex flex-wrap items-center justify-center gap-3">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-4 py-2 rounded-full border transition-all text-sm md:text-base ${
                    selectedYear === y
                      ? "bg-orange-500 border-orange-500 text-black drop-shadow"
                      : "border-white/15 text-white/80 hover:border-orange-500 hover:text-white"
                  }`}
                  type="button"
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full">
                  <div className="h-[380px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="mt-8 text-center text-red-500">
              Failed to load developers: {error}
            </div>
          )}

          {/* Final grid */}
          {!loading && !error && (
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                {filteredDevs.map((dev, idx) => {
                  const handle = extractHandle(dev);
                  return (
                    <div
                      key={`${selectedYear}-${idx}-${dev.name}`}
                      className="w-full animate-rushToScreen"
                      style={{ animationDelay: `${Math.min(idx * 60, 420)}ms` }}
                    >
                      <ProfileCard
                        name={dev.name}
                        title={dev.title ?? "Developer"}
                        handle={handle}
                        github={dev.github}
                        insta={dev.insta}
                        linkedin={dev.linkedin}
                        status={dev.status ?? "Online"}
                        contactText="Contact Me"
                        avatarUrl={(dev.imageUrl ?? dev.image) || ""}
                        showUserInfo={true}
                        enableTilt={true}
                        enableMobileTilt={false}
                        onContactClick={() => {
                          if (dev.github) window.open(dev.github, "_blank");
                          else if (dev.insta) window.open(dev.insta, "_blank");
                          else if (dev.linkedin)
                            window.open(dev.linkedin, "_blank");
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
