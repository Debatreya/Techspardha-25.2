import React from "react";
import ProfileCard from "../components/Developers/DeveloperCard";

export default function Developer() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gray-800">
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
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center max-w-7xl mx-auto">
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
    </div>
  );
}
