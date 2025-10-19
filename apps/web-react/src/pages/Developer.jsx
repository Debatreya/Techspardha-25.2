import React, { useEffect, useState } from "react";
import ProfileCard from "../components/Developers/DeveloperCard";
import Navbar from "../components/Home/navbar/navbar.jsx";
import Footer from "../components/Global/Footer/footer.jsx";
import StarBackground from '../components/Home/StarBackground/StarBackground.jsx';

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

  return (
    <div className='w-full overflow-x-hidden' style={{
      background: 'linear-gradient(to bottom, #050510, #0c0f14 70%, #05060a)',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Star background */}
      <StarBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen px-6 py-10">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-800">
              <span className="text-orange-500 font-rationale font-extrabold text-6xl tracking-wide">
                OUR DEVELOPERS
              </span>
            </h1>

            {/* Gradient underline bar */}
            <p className="text-xl text-gray-100 mt-6 font-mono">
              Meet the brilliant minds behind TECHSPARDHA '25
            </p>
            <div className="mt-4 mx-auto w-40 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-full"></div>
          </div>

          {/* If no data yet (loading or fetch fail), show original placeholders */}
          {groups.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProfileCard
                  key={index}
                  name="Javi A. Torres"
                  title="Software Engineer"
                  handle="javicodes"
                  status="Online"
                  contactText="Contact Me"
                  avatarUrl="https://th.bing.com/th/id/OIP.Bbz4J3A8nz0a1TcvvvlhQQAAAA?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
                  showUserInfo={true}
                  enableTilt={true}
                  enableMobileTilt={false}
                  onContactClick={() => console.log("Contact clicked")}
                />
              ))}
            </div>
          ) : (
            // Render grouped developers by year
            <div className="space-y-10">
              {groups.map(({ year, devs }) => (
                <section key={year}>
                  <h2 className="text-3xl font-semibold text-center mb-6 text-orange-400">
                    {year}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
                    {devs.map((dev, idx) => {
                      const handle = extractHandle(dev);
                      return (
                        <ProfileCard
                          key={`${year}-${idx}-${dev.name}`}
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
                            else
                              console.log(
                                "No contact link available for",
                                dev.name
                              );
                          }}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          {error && (
            <div className="mt-8 text-center text-red-500">
              Failed to load developers: {error}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
