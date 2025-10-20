import React, { useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import StarBackground from "../components/Home/StarBackground/StarBackground.jsx";

function Schedule() {
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(id);
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
      {pageLoading && <Loader label="Loading schedule" />}
      <StarBackground />
      <div className="relative z-10">{/* Schedule content goes here */}</div>
    </div>
  );
}

export default Schedule;
