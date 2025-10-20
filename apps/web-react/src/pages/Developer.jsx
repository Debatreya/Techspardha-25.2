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
  // We are now showing two dedicated sections instead of interactive year filters
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

  // Flattened dev list
  const allDevs = useMemo(() => groups.flatMap((g) => g.devs), [groups]);

  // Helpers to categorize years loosely (case-insensitive)
  const isPrefinal = (year = "") => {
    const y = String(year).toLowerCase();
    return (
      y.includes("prefinal") ||
      y.includes("pre-final") ||
      y.includes("pre final") ||
      y.includes("3rd") ||
      y.includes("third") ||
      y.includes("iii")
    );
  };
  const isSopho = (year = "") => {
    const y = String(year).toLowerCase();
    return (
      y.includes("sopho") ||
      y.includes("sophomore") ||
      y.includes("2nd") ||
      y.includes("second") ||
      y.includes("ii")
    );
  };

  const prefinalDevs = useMemo(
    () => allDevs.filter((d) => isPrefinal(d.year)),
    [allDevs]
  );
  const sophoDevs = useMemo(
    () => allDevs.filter((d) => isSopho(d.year)),
    [allDevs]
  );

  const SectionHeader = ({ title }) => (
    <div className="w-full max-w-6xl mx-auto mb-6">
      <h2 className="text-left font-extrabold tracking-widest uppercase text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-orange-500 via-amber-300 to-orange-600 bg-clip-text text-transparent">
        {title}
      </h2>
      <div className="mt-3 h-[6px] w-48 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 shadow-[0_0_18px_rgba(247,112,57,0.55)]" />
    </div>
  );

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
      <StarBackground />

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

          {/* Two sections: Prefinal (top), Sopho (bottom) */}

          {/* Loading skeletons */}
          {loading && (
            <div className="mx-auto max-w-6xl grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 sm:gap-8 lg:gap-10 xl:gap-12 justify-items-center">
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

          {/* Final grids */}
          {!loading && !error && (
            <div className="mx-auto max-w-6xl space-y-14">
              {prefinalDevs.length > 0 && (
                <section>
                  <h2 className="text-center font-rationale font-extrabold text-3xl sm:text-4xl md:text-5xl text-orange-500 uppercase tracking-wider [text-shadow:0_0_15px_rgba(255,102,0,0.4)]">
                    Pre-Final
                  </h2>
                  <div className="mx-auto mt-2 mb-6 h-[4px] w-40 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 shadow-[0_0_14px_rgba(247,112,57,0.45)]" />
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 sm:gap-6 lg:gap-8 xl:gap-10 justify-items-center">
                    {prefinalDevs.map((dev, idx) => {
                      const handle = extractHandle(dev);
                      return (
                        <div
                          key={`prefinal-${idx}-${dev.name}`}
                          className="w-full flex justify-center animate-rushToScreen"
                          style={{
                            animationDelay: `${Math.min(idx * 60, 420)}ms`,
                          }}
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
                              else if (dev.insta)
                                window.open(dev.insta, "_blank");
                              else if (dev.linkedin)
                                window.open(dev.linkedin, "_blank");
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {sophoDevs.length > 0 && (
                <section>
                  <h2 className="text-center font-rationale font-extrabold text-3xl sm:text-4xl md:text-5xl text-orange-500 uppercase tracking-wider [text-shadow:0_0_15px_rgba(255,102,0,0.4)]">
                    Sophomore
                  </h2>
                  <div className="mx-auto mt-2 mb-6 h-[4px] w-40 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 shadow-[0_0_14px_rgba(247,112,57,0.45)]" />
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 sm:gap-7 lg:gap-9 xl:gap-11 justify-items-center">
                    {sophoDevs.map((dev, idx) => {
                      const handle = extractHandle(dev);
                      return (
                        <div
                          key={`sopho-${idx}-${dev.name}`}
                          className="w-full flex justify-center animate-rushToScreen"
                          style={{
                            animationDelay: `${Math.min(idx * 60, 420)}ms`,
                          }}
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
                              else if (dev.insta)
                                window.open(dev.insta, "_blank");
                              else if (dev.linkedin)
                                window.open(dev.linkedin, "_blank");
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
