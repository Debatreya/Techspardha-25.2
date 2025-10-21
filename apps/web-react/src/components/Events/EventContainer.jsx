import React from "react";
import EventCard from "../../components/Events/EventCard";
import { FetchFormattedEvent } from "./FetchFormattedEvent";
import { useState, useEffect } from "react";
import axios from "axios";
function EventContainer() {
  const [category, setCategory] = useState([{ id: 0, name: "All" }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  // Animation cycle increments to force re-mount and retrigger CSS animations
  const [animCycle, setAnimCycle] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-techspardha-87928.cloudfunctions.net/api2/events/categories"
        );
        const data = res.data;

        if (data.success && data.data?.categories) {
          const formatted = data.data.categories.map((cat, index) => ({
            id: index + 1,
            name: cat.categoryName,
          }));
          setCategory([{ id: 0, name: "All" }, ...formatted]);
        } else {
          console.error("Invalid API response:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchAllEvents = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-techspardha-87928.cloudfunctions.net/api2/events"
        );
        const allEvents = res.data?.data?.events;

        if (!allEvents || !Array.isArray(allEvents)) {
          console.error("Invalid events API response:", res.data);
          return;
        }

        // For each event, fetch its detailed description & format it
        const detailedEvents = await Promise.all(
          allEvents.map(async (ev, index) => {
            try {
              const formatted = await FetchFormattedEvent(
                ev.eventCategory,
                ev.eventName,
                index + 1
              );
              return formatted;
            } catch (err) {
              console.error(`Failed to format ${ev.eventName}`, err);
              return null;
            }
          })
        );

        setEvents(detailedEvents.filter(Boolean));
        // trigger animations on initial load
        setAnimCycle((c) => c + 1);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchCategories();
    fetchAllEvents();
  }, []);

  function onclickHandler(e) {
    const cat = e.target.innerText;
    setSelectedCategory(cat);
    // retrigger animations on filter change
    setAnimCycle((c) => c + 1);
  }
  return (
    <div className=" text-white w-full min-h-[100dvh] m-0 p-0 box-border">
      <h1 className="text-5xl font-extrabold text-center text-[#f77039] font-gta  pt-10 pd-8">
        EVENTS
      </h1>
      <p className="text-center p-4">
        Explore our exciting lineup of events at TECHSPARDHA'25
      </p>
      <hr className="w-[15%] mx-auto border-t-4 border-[#f77039]" />
      {/* Mobile: custom dropdown replicating desktop hover effect */}
      <div className="sm:hidden mt-6 flex justify-center">
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((s) => !s)}
            className="w-56 flex items-center justify-between bg-transparent border border-white/20 text-white p-4 rounded-md transition-colors duration-300 ease-out motion-reduce:transition-none"
          >
            <span className="truncate">{selectedCategory}</span>
            <svg
              className={`ml-2 h-4 w-4 text-white transition-transform duration-300 motion-reduce:transition-none ${dropdownOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul
              role="listbox"
              aria-label="Categories"
              className="absolute left-0 mt-2 w-56 bg-[#15130F] border border-white/20 rounded-md shadow-lg z-50 overflow-hidden"
            >
              {category.map((cat) => (
                <li key={cat.id} role="option">
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setDropdownOpen(false);
                      setAnimCycle((c) => c + 1);
                    }}
                    className={`w-full text-left truncate min-w-[80px] max-w-full p-4 rounded-md transform transition duration-200 ease-out motion-reduce:transition-none hover:scale-[1.02] hover:bg-[#FF5C00] hover:shadow-[0_0_9px_rgba(255,92,0,0.8)]`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop and larger: inline button list with smooth hover animations */}
      <div className="hidden sm:block mt-8 border border-white/20 w-max mx-auto text-center rounded-full drop-shadow-md bg-[#15130F]/70 backdrop-blur-md">
        <ul className="inline-flex items-center p-2 gap-2 xl:gap-3">
          {category.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={onclickHandler}
                className={`
            group relative rounded-full px-4 py-2 
            text-[clamp(0.75rem,1.5vw,1rem)] 
            text-white/90 font-medium 
            transition-all duration-300 ease-in-out 
            hover:bg-[#FF5C00] hover:text-white
            hover:shadow-[0_0_9px_rgba(255,92,0,0.8)]
          `}
              >
                <span
                  className="block max-w-[6rem] truncate transition-all duration-300 ease-in-out group-hover:max-w-[14rem]"
                  style={{ minWidth: "0" }}
                >
                  {cat.name}
                </span>

                {/* Optional subtle underline animation like a focus highlight */}
                <span
                  className="
              absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 
              bg-white/70 transition-all duration-300 ease-in-out 
              group-hover:w-[60%]
            "
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="inline-flex flex-wrap justify-center mt-10 mb-10 align-middle gap-8 px-4 w-full">
        {events
          .filter((event) => {
            if (selectedCategory === "All") return true;
            return event.category === selectedCategory;
          })
          .map((event, idx) => (
            <div
              className="width-[33%] box-border m-4 will-change-[transform,filter,opacity] animate-rushToScreen"
              style={{ animationDelay: `${Math.min(idx * 80, 480)}ms` }}
              key={`${event.id}-${selectedCategory}-${animCycle}`}
            >
              <EventCard
                name={event.name}
                description={event.description}
                venue={event.venue}
                date={event.date}
                category={event.category}
                image={event.image}
                registerlink={event.registerlink}
                detailedlink={event.detailedlink}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default EventContainer;
