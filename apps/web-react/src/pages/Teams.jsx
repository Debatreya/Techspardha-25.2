import React, { useEffect, useState } from 'react';
import TeamCard from '../components/Teams/TeamCard';
import '../components/Teams/TeamCard.css'; 
import Shuffle from '../components/Teams/Shuffle'; 
import Navbar from '../components/Home/navbar/navbar.jsx';
import Footer from '../components/Global/Footer/footer.jsx';
import StarBackground from '../components/Home/StarBackground/StarBackground.jsx';
import axios from 'axios';

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://us-central1-techspardha-87928.cloudfunctions.net/api2/contacts');
        if (res.data.success && res.data.data && res.data.data.contacts) {
          // Create a copy of the array and reverse it
          const reversedTeams = [...res.data.data.contacts].reverse();
          setTeams(reversedTeams);
        } else {
          setError('Failed to fetch teams');
        }
      } catch (err) {
        setError('Error fetching teams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
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
        <div className="min-h-screen w-full text-white font-sans flex justify-center items-start py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-7xl">
            <div className="mb-20 mx-auto relative">
              <h1 className="mx-auto font-rationale font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#ff6600] uppercase tracking-[4px] mb-5 [text-shadow:0_0_20px_rgba(255,102,0,0.5)]">
                <div className="mx-auto w-max">
                  <Shuffle
                    text="TECHSPARDHA TEAMS"
                    shuffleDirection="right"
                  />
                </div>
              </h1>
              <div className="header-underline mx-auto"></div>
            </div>
            {loading && (
              <div className="text-center text-orange-500 text-2xl py-20">Loading teams...</div>
            )}
            {error && (
              <div className="text-center text-red-500 text-2xl py-20">{error}</div>
            )}
            {!loading && !error && teams.map((team, idx) => (
              <div key={team.section || idx} className="team-section mb-20">
                <div className="text-left mb-10 relative flex flex-col items-start">
                  <h2 className="SubTeamHeading font-rationale font-extrabold text-2xl sm:text-3xl text-orange-500 uppercase tracking-wider [text-shadow:0_0_15px_rgba(255,102,0,0.4)]">
                    <Shuffle text={team.section} />
                  </h2>
                  <div className="header-underline mt-1 h-1 w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5 bg-orange-500 rounded"></div>
                </div>
                <div className="flex justify-start gap-4 md:gap-6 flex-wrap">
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