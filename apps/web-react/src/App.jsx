import { Routes, Route } from "react-router-dom";
import Events from "./pages/Events";
import Developer from "./pages/Developer";
import Schedule from "./pages/Schedule";
import Teams from "./pages/Teams";
import Home from "./pages/Home";
import Navbar from "./components/Home/navbar/navbar.jsx";
import Sponsors from "./pages/Sponsors.jsx";

import FAQ from "./components/Home/FAQ/FAQ";
import ScrollToTop from "./components/Global/ScrollToTop";
const App = () => {
  return (
    <>
      {/* Ensure new routes start at the top of the page */}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/Developer" element={<Developer />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Teams" element={<Teams />} />
      </Routes>
    </>
  );
};
export default App;
