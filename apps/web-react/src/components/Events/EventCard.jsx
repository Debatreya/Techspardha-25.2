import React, { useState } from "react";

const Button = ({ text, redirect }) => {
  return (
    <a
      href={redirect}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center bg-[#3a220c]/80 text-white px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base font-mono tracking-wide hover:bg-[#482d1a] transition-all duration-300 ease-in-out rounded-md w-full sm:w-auto group"
    >
      <span className="relative z-10">{text}</span>

      {/* Cosmic glow on hover */}
      <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-600/0 via-orange-600/10 to-orange-600/0 blur-sm"></span>

      {/* Decorative Corners with enhanced glow */}
      <span className="absolute top-0 left-0 w-3 h-[0.8px] bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>
      <span className="absolute top-0 left-0 w-[0.8px] h-3 bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>

      <span className="absolute top-0 right-0 w-3 h-[0.8px] bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>
      <span className="absolute top-0 right-0 w-[0.8px] h-3 bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>

      <span className="absolute bottom-0 left-0 w-3 h-[0.8px] bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>
      <span className="absolute bottom-0 left-0 w-[0.8px] h-3 bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>

      <span className="absolute bottom-0 right-0 w-3 h-[0.8px] bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>
      <span className="absolute bottom-0 right-0 w-[0.8px] h-3 bg-orange-500 shadow-[0_0_5px_1px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_8px_2px_rgba(249,115,22,0.6)]"></span>
    </a>
  );
};

function EventCard({
  name,
  description,
  venue,
  date,
  category,
  image,
  registerlink,
  detailedlink,
}) {
  const [expanded, setExpanded] = useState(false);
  const tagStyle =
    "bg-[#252525]/70 text-gray-200 border border-gray-600/40 shadow-lg shadow-black/30 backdrop-blur-sm";

  return (
    <div className="bg-[#181818]/70 backdrop-blur-md rounded-lg transform transition duration-500 hover:scale-[1.03] border border-gray-800/50 hover:border-orange-500/60 w-[14rem] sm:w-full sm:max-w-sm mx-auto group lg:min-w-[200px] shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-orange-900/20">
      {/* Subtle cosmic glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent blur-md"></div>

      {/* Image */}
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden rounded-t-lg">
        <img
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          src={image}
          alt={name}
        />

        {/* Image overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-50"></div>

        {category && (
          <span
            className={`absolute top-2 right-2 text-[0.65rem] sm:text-xs font-light px-2 sm:px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-colors uppercase ${tagStyle}`}
          >
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 relative">
        {/* Subtle star particles (small dots) */}
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
        <div className="absolute top-5 right-8 h-1 w-1 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
        <div className="absolute bottom-10 right-3 h-1.5 w-1.5 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-500 mb-2 tracking-wide uppercase transition-colors duration-300 drop-shadow-md">
          {name}
        </h3>

        {/* Description */}
        <div
          className={`text-gray-300 text-sm sm:text-base mb-3 leading-relaxed transition-all duration-500 
            ${expanded
              ? "max-h-40 overflow-y-auto overflow-x-hidden pr-1"
              : "line-clamp-3 overflow-hidden"
            } 
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-orange-600/50
            [&::-webkit-scrollbar-thumb:hover]:bg-orange-500/80
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar]:backdrop-blur-lg
          `}
        >
          {description}
        </div>

        <div className="w-full">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-orange-500 text-sm font-medium hover:text-orange-400 hover:underline mb-4 transition-colors duration-300 flex items-center"
          >
            <span>{expanded ? "Read less" : "Read more"}</span>
            <span className="ml-1 text-xs">
              {expanded ? "↑" : "↓"}
            </span>
          </button>
        </div>

        {/* Venue & Date */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-300 mb-6">
          {venue && (
            <div className="flex items-center group/icon">
              <svg
                className="w-4 h-4 mr-2 text-orange-500 shrink-0 transition-transform duration-300 group-hover/icon:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              <span className="group-hover/icon:text-orange-300 transition-colors duration-300">
                {venue}
              </span>
            </div>
          )}
          {date && (
            <div className="flex items-center group/icon">
              <svg
                className="w-4 h-4 mr-2 text-orange-500 shrink-0 transition-transform duration-300 group-hover/icon:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="group-hover/icon:text-orange-300 transition-colors duration-300">
                {date}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button text="See Details" redirect={detailedlink} />
        </div>
      </div>
    </div>
  );
}

export default EventCard;
