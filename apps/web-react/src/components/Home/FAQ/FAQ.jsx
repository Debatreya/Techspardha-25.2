import React, { useState, useRef, useEffect } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import axios from "axios";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const itemRefs = useRef({});
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://us-central1-techspardha-87928.cloudfunctions.net/api2/faq');
        
        if (response.data && response.data.success) {
          setFaqs(response.data.data);
        } else {
          setError('Failed to fetch FAQ data');
        }
      } catch (err) {
        setError('Error fetching FAQs: ' + err.message);
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFAQ = (faq, key) => (
    <div
      key={key}
      ref={(el) => (itemRefs.current[key] = el)}
      onClick={() => toggleFAQ(key)}
      className={`cursor-pointer overflow-hidden rounded-lg relative transition-all duration-700 ease-in-out ${openIndex === key
          ? "bg-[rgba(255,92,0,0.1)] border-0"
          : "bg-transparent border-2 border-solid border-[rgba(99,92,92,1)] hover:bg-[rgba(255,92,0,0.1)]"
        }`}
      style={{
        outline: "none",
        boxShadow: "none",
      }}
    >
      <div
        className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[rgba(255,92,0,0.15)] group"
        style={{
          border:
            openIndex === key ? "2px solid #ff5c00" : "none",
          borderRadius: openIndex === key ? "8px" : "0",
          backgroundColor:
            openIndex === key ? "rgba(0,0,0,0.8)" : "transparent",
          transition:
            "box-shadow 0.4s ease, background-color 0.4s ease, transform 0.4s ease",
        }}
      >
        <span className="text-white text-[1.1rem] font-medium leading-snug flex-1">
          {faq.ques}
        </span>

        <div className="flex items-center justify-center text-[#FF5C00] text-2xl rounded-full transition-all duration-300  group-hover:bg-[#FF5C00] group-hover:text-black">
          {openIndex === key ? (
            <CiCircleMinus className="transition-all duration-300 group-hover:text-black" size={30} />
          ) : (
            <CiCirclePlus className="transition-all duration-300 group-hover:text-black" size={30} />
          )}
        </div>
      </div>

      <div
        className={`transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden ${openIndex === key ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-[rgba(26,10,0,0)] rounded mx-5 my-3 p-4 border-l-[3px] border-l-[#FF5C00] border-solid">
          <div className="text-[#d0d0d0] text-[0.95rem] leading-relaxed">
            {faq.ans}
          </div>
        </div>
      </div>
    </div>
  );

  // Split faqs into two arrays for the two columns
  const splitFaqs = () => {
    if (!faqs.length) return { leftFaqs: [], rightFaqs: [] };
    
    const midpoint = Math.ceil(faqs.length / 2);
    return {
      leftFaqs: faqs.slice(0, midpoint),
      rightFaqs: faqs.slice(midpoint)
    };
  };

  const { leftFaqs, rightFaqs } = splitFaqs();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#FF5C00] tracking-widest inline-block pb-2.5 border-b-4 border-b-[#FF5C00] border-solid"
              style={{ fontFamily: "Orbitron" }}>
            FAQ
          </h1>
        </div>
        <div className="text-white text-xl mt-10">Loading FAQs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#FF5C00] tracking-widest inline-block pb-2.5 border-b-4 border-b-[#FF5C00] border-solid"
              style={{ fontFamily: "Orbitron" }}>
            FAQ
          </h1>
        </div>
        <div className="text-white text-xl mt-10">Error loading FAQs: {error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10 gap-12"
    >
      <div className="text-center">
        <h1
          className="text-5xl md:text-7xl font-bold text-[#FF5C00] tracking-widest inline-block pb-2.5 border-b-4 border-b-[#FF5C00] border-solid"
          style={{ fontFamily: "Orbitron" }}
        >
          FAQ
        </h1>
      </div>

      <div className="w-full max-w-[1200px]">
        <div className="flex flex-col gap-[25px] min-h-[600px] md:flex-row md:gap-x-[30px] md:items-stretch">
          <div className="flex-1 flex flex-col gap-4">
            {leftFaqs.map((faq, index) =>
              renderFAQ(faq, `left-${index}`)
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {rightFaqs.map((faq, index) =>
              renderFAQ(faq, `right-${index}`)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
