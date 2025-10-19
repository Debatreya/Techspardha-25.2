import React from 'react';
import { FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa';

const TeamCard = ({ name, role, imageUrl /*, socialLinks*/ }) => {
  return (
    <div className="group relative rounded-2xl p-4 text-center flex-1 min-w-[180px] max-w-[240px] transform transition-all duration-500 hover:scale-105">
      {/* Glassmorphic background */}
      <div className="absolute inset-0 rounded-2xl bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 shadow-lg transition-all duration-300 group-hover:border-orange-500/50 group-hover:bg-gray-900/50"></div>
      
      {/* Subtle star glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-gray-800/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-white/10 group-hover:bg-orange-400/20 blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto mb-4 w-40 h-40 relative">
          <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover border-4 border-gray-700/50 group-hover:border-orange-500/60 transition-all duration-300 shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/FF6600/FFFFFF?text=Error'; }}
          />
          
          {/* Image border glow effect */}
          <div className="absolute inset-0 rounded-full border border-orange-500/0 group-hover:border-orange-500/20 group-hover:blur-sm transition-all duration-500"></div>
        </div>
        
        <h3 className="font-bold text-white mb-1 truncate mt-10 text-xl text-shadow-sm">{name}</h3>
        <p className="text-orange-400 text-sm font-semibold group-hover:text-orange-300 transition-colors duration-300">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;