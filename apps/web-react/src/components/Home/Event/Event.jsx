// import React from "react";
// import EventCard from "../../Events/EventCard";
// import { EVENTS } from "../../../constants/Event";

// function Event() {
  
//   const event1 = EVENTS[0];
//   const event2 = EVENTS[1];
//   const event3 = EVENTS[2];
  

//   const customBackgroundStyle = {
//     minHeight: "100vh",
//     padding: "40px 0",
//     backgroundColor: "#0d0705", // fallback
//     backgroundImage: `
//       /* Top-left: Dark brown/black subtle */
//       linear-gradient(to bottom right, rgba(53, 35, 20, 0.5) 0%, 
//       /* Middle: slightly transparent black/brown */
//       rgba(13, 7, 5, 0.5) 50%, 
//       /* Bottom-right: orange increasing opacity */
//       rgba(255, 140, 0, 0.) 100%)
//     `,
//   };

//   const getCardProps = (event) => ({
//     name: event.name,
//     description: event.description,
//     venue: event.venue,
//     date: event.date,
//     category: event.category,
//     image: event.image,
//     registerlink: event.registerlink,
//     detailedlink: event.detailedlink,
//   });

//   const viewAllButtonStyle =
//     "text-orange-500 font-semibold flex items-center hover:text-orange-400 transition duration-150";
//   const viewAllContainerClass =
//     "border border-dashed border-gray-600 px-8 py-4 rounded-lg flex bg-[#251f1c] hover:border-orange-500 transition duration-300";

//   return (
//     <div style={customBackgroundStyle} className="font-sans">
//       {/* Header */}
//       <div className="text-center mb-16">
//         <h2 className="text-5xl md:text-7xl font-gta tracking-widest mb-4 uppercase text-orange-500">
//           EVENTS
//         </h2>
//         <p className="text-gray-300 text-lg">
//           Explore our exciting lineup of events at TECHSPARDHA '25
//         </p>
//         <div className="w-20 h-1 bg-orange-500 mx-auto mt-3"></div>
//       </div>

//       {/* Events Grid */}
//       <div className="container mx-auto px-4">
//         <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center">
//           {event1 && <EventCard {...getCardProps(event1)} />}
//           {event2 && <EventCard {...getCardProps(event2)} />}
//           {event3 && <EventCard {...getCardProps(event3)} />}
         
//         </div>
//       </div>

//       {/* Single View All Events Button */}
//       <div className="mt-20 flex justify-center">
//         <div className={viewAllContainerClass}>
//           <a href="/events" className={viewAllButtonStyle}>
//             View All Events
//             <svg
//               className="w-4 h-4 ml-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 5l7 7-7 7"
//               ></path>
//             </svg>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Event;
import React, { useEffect, useState } from "react";
import EventCard from "../../Events/EventCard";
import { FetchFormattedEvent } from "../../Events/FetchFormattedEvent";
import axios from "axios";
import Marquee from "react-fast-marquee";

function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-techspardha-87928.cloudfunctions.net/api2/events"
        );
        const allEvents = res.data?.data?.events;
        if (!allEvents || !Array.isArray(allEvents)) return;

        const detailedEvents = await Promise.all(
          allEvents.map(async (ev, index) => {
            try {
              return await FetchFormattedEvent(
                ev.eventCategory,
                ev.eventName,
                index + 1
              );
            } catch {
              return null;
            }
          })
        );

        // Keep only one event per category
        const uniqueEvents = [];
        const seenCategories = new Set();
        detailedEvents.filter(Boolean).forEach((ev) => {
          if (!seenCategories.has(ev.category)) {
            uniqueEvents.push(ev);
            seenCategories.add(ev.category);
          }
        });

        setEvents(uniqueEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen py-10 font-sans relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-gta tracking-widest mb-4 uppercase text-orange-500">
          EVENTS
        </h2>
        <p className="text-gray-300 text-lg">
          Explore our exciting lineup of events at TECHSPARDHA '25
        </p>
        <div className="w-20 h-1 bg-orange-500 mx-auto mt-3"></div>
      </div>

      {/* React Fast Marquee */}
      <Marquee
        speed={80} // increase speed (default 45)
        gradient={false} // removes fade gradient
        pauseOnHover={true} // pause on hover
        loop={0} // infinite
      >
        {events.map((event, index) => (
          <div key={index} className="inline-block min-w-[320px] mr-6">
            <EventCard {...event} />
          </div>
        ))}
      </Marquee>

      {/* View All Events Button */}
      <div className="mt-20 flex justify-center">
        <div className="border border-dashed border-gray-600 px-8 py-4 rounded-lg flex bg-[#251f1c] hover:border-orange-500 transition duration-300">
          <a
            href="/events"
            className="text-orange-500 font-semibold flex items-center hover:text-orange-400 transition duration-150"
          >
            View All Events
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Event;
