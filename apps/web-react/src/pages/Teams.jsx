import React, { useEffect, useState } from "react";
import TeamCard from "../components/Teams/TeamCard";
import "../components/Teams/TeamCard.css";
import Shuffle from "../components/Teams/Shuffle";
import Navbar from "../components/Home/navbar/navbar.jsx";
import Footer from "../components/Global/Footer/footer.jsx";
import StarBackground from "../components/Home/StarBackground/StarBackground.jsx";
import axios from "axios";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize role string and map to priority (lower is higher priority)
  // Priority: Convenor (1) > Co‑Convener (2) > Core (3) > Members (4)
  const getRolePriority = (roleRaw) => {
    if (!roleRaw || typeof roleRaw !== "string") return 4;
    const role = roleRaw
      .toLowerCase()
      .replace(/[_\-]/g, " ") // treat hyphen/underscore as space
      .replace(/\s+/g, " ") // collapse spaces
      .trim();

    // Common variants handling
    // Convenor / Convener
    if (role === "convenor" || role === "convener") return 1;

    // Co-Convener / Co Convenor / Co Conveners etc.
    if (
      role === "co convener" ||
      role === "co convenor" ||
      role === "co convener(s)" ||
      role === "co convenor(s)" ||
      role === "co convener(s)"
    ) {
      return 2;
    }
    if (
      role.startsWith("co ") &&
      (role.includes("convener") || role.includes("convenor"))
    )
      return 2;

    // Core / Core Team / Core Member
    if (
      role === "core" ||
      role === "core team" ||
      role === "core member" ||
      role === "core members"
    )
      return 3;

    // Member(s) default bucket
    if (
      role === "member" ||
      role === "members" ||
      role.endsWith(" member") ||
      role.endsWith(" members")
    )
      return 4;

    // Fallback: unknown roles go to the end
    return 4;
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://us-central1-techspardha-87928.cloudfunctions.net/api2/contacts"
        );
        if (res.data.success && res.data.data && res.data.data.contacts) {
          // Create a copy of the array and reverse it
          const reversedTeams = [...res.data.data.contacts].reverse();

          // Sort people in each team by role priority, then by name
          const sortedTeams = reversedTeams.map((team) => {
            const people = Array.isArray(team.people) ? [...team.people] : [];
            people.sort((a, b) => {
              const prioA = getRolePriority(a?.post);
              const prioB = getRolePriority(b?.post);
              if (prioA !== prioB) return prioA - prioB;
              const nameA = (a?.name || "").toString().toLowerCase();
              const nameB = (b?.name || "").toString().toLowerCase();
              if (nameA < nameB) return -1;
              if (nameA > nameB) return 1;
              return 0;
            });
            return { ...team, people };
          });

          setTeams(sortedTeams);
        } else {
          setError("Failed to fetch teams");
        }
      } catch (err) {
        setError("Error fetching teams");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
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
      {/* Star background */}
      <StarBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-screen w-full text-white font-sans flex justify-center items-start py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">
            <div className="mb-20 mx-auto relative">
              <h1 className="mx-auto font-rationale font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#ff6600] uppercase tracking-[4px] mb-5 [text-shadow:0_0_20px_rgba(255,102,0,0.5)]">
                <div className="mx-auto w-max">
                  <Shuffle text="TECHSPARDHA TEAMS" shuffleDirection="right" />
                </div>
              </h1>
              <div className="header-underline mx-auto"></div>
            </div>
            {loading && (
              <div className="text-center text-orange-500 text-2xl py-20">
                Loading teams...
              </div>
            )}
            {error && (
              <div className="text-center text-red-500 text-2xl py-20">
                {error}
              </div>
            )}
            {!loading &&
              !error &&
              teams.map((team, idx) => (
                <div key={team.section || idx} className="team-section mb-20">
                  <div className="text-left mb-10 relative flex flex-col items-start">
                    <h2 className="SubTeamHeading font-rationale font-extrabold text-2xl sm:text-3xl text-orange-500 uppercase tracking-wider [text-shadow:0_0_15px_rgba(255,102,0,0.4)]">
                      <Shuffle text={team.section} />
                    </h2>
                    <div className="header-underline mt-1 h-1 w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5 bg-orange-500 rounded"></div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-5 md:gap-6">
                    {team.people.map((person, index) => (
                      <TeamCard
                        key={person.name + index}
                        name={person.name}
                        role={person.post}
                        imageUrl={person.imageUrl}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default TeamPage;
