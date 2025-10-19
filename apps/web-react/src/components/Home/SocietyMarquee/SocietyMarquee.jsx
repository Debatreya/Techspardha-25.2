import React from 'react';
import Marquee from 'react-fast-marquee';
import img from '../../../assets/societyLogos/seven.png';
import './SocietyMarquee.css'; // Import the CSS file for the blur effect

// ✅ Static imports (Vite-compatible)
import Aero from '../../../assets/TeamLogos/Aero.svg';
import Anant from '../../../assets/TeamLogos/Anant.png';
import Antariksh from '../../../assets/TeamLogos/Antariksh.svg';
import EMR from '../../../assets/TeamLogos/EMR.svg';
import Erech from '../../../assets/TeamLogos/Ereck.svg';
import Icell from '../../../assets/TeamLogos/Icell.svg';
import Infra from '../../../assets/TeamLogos/Infra.svg';
import MechSoc from '../../../assets/TeamLogos/MechSoc.svg';
import Mexperts from '../../../assets/TeamLogos/Mexperts.svg';
import Startup from '../../../assets/TeamLogos/Startup.svg';
import Technologo from '../../../assets/TeamLogos/technologo.svg';

const societyLogos = [
  Aero, Anant, Antariksh, EMR, Erech, Icell, Infra, MechSoc, Mexperts, Startup, Technologo
];

const SocietyMarquee = () => {
  return (
    <div className="pt-10">
      <p className="text-5xl text-center text-primary font-gta mb-10">Team Techspardha</p>
      <Marquee direction="left" speed={75} gradient={false}>
        {societyLogos.map((logo, index) => (
          <div key={index} className="mx-12">
            <img src={logo} width={180} height={180} alt={`Society Logo ${index + 1}`} />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default SocietyMarquee;
