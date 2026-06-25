import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackIcon from "../../components/icons/BackIcon";

import villa1 from "../../assets/villa/villa-1.webp";
import villa2 from "../../assets/villa/villa-2.webp";
import seminyak from "../../assets/promotions/seminyak.png";
import suite from "../../assets/promotions/suite.png";
import canggu from "../../assets/promotions/canggu.png";
import spa1 from "../../assets/spa/spa-1.webp";
import spa2 from "../../assets/spa/spa-2.webp";
import spa3 from "../../assets/spa/spa-3.webp";
import spa4 from "../../assets/spa/spa-4.webp";
import spa5 from "../../assets/spa/spa-5.webp";


const images = [villa1, villa2];

const services = [
  // { name: "THE BALI DREAM VILLA SEMINYAK", subtitle: "Wellness & Ritual", Icon: SpaIcon },
  { id: "seminyak", name: "THE BALI DREAM VILLA SEMINYAK", flyer: [spa1, spa2, spa3, spa4, spa5]},
  { id: "suite", name: "THE BALI DREAM SUITE VILLA SEMINYAK",  flyer: suite},
  { id: "canggu", name: "THE BALI DREAM VILLA & RESORT ECHO BEACH CANGGU",  flyer: canggu},
  ];

export default function Compendium() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  // State untuk melacak card mana yang sedang dibuka dropdown-nya
  const [expandedId, setExpandedId] = useState(null);
 
  // Fungsi toggle dropdown
  const handleCardClick = (id) => {
    // Logika ini otomatis menutup card lain karena state hanya menyimpan 1 ID
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-cormorant bg-black">
      {/* 1. BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* 2. OVERLAY */}
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] bg-linear-to-b from-black/20 via-transparent to-[#1c140a]" />

      {/* 3. WRAPPER CONTENT */}
      <div className="relative z-20 flex flex-col min-h-screen">
        
        {/* NAVBAR */}
        <div className="flex items-center gap-3 pl-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition backdrop-blur-md"
          >
            <BackIcon />
          </button>
          <h1 className="text-white text-lg tracking-[0.2em] font-light drop-shadow-lg uppercase">
            Guest Experience
          </h1>
        </div>
        {/* CONTENT - RESPONSIVE GRID (3 Bawah di Mobile, 3 Sejajar di Laptop) */}
            <div className="flex-1 px-4 pb-10 flex flex-col justify-center items-center">
              {/* <div className="p-[18px] pt-[20px] px-[16px] 
                flex flex-col items-center text-center 
                gap-[12px]
                bg-white/5 backdrop-blur-md
                border border-white/10
                rounded-xl"> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start bg-white/5 backdrop-blur-md
                border border-white/10
                rounded-xl">
                  {services.map((service, i) => {
                    const isExpanded = expandedId === service.id;

                    return(
                    <div
                      key={service.id}
                      onClick={() => handleCardClick(service.id)}
                      className={`
                        p-6 flex flex-col items-center justify-center text-center gap-4 rounded-lg bg-white/5 border border-white/10 
            
                        /* Animasi Muncul */
                        transition-all duration-500 transform cursor-pointer
                                    
                        /* HOVER HANYA DI CARD INI */
                        hover:bg-white/10 hover:border-white/20 hover:scale-[1.03]
                        active:scale-95
                        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                      `}
                      style={{ 
                        transitionDelay: `${i * 150}ms`,
                        minHeight: "160px" 
                      }}
                    >
                      {/* Location Compandium */}
                      <div className="flex flex-col items-center">
                        <p className="svc-card-name">
                          {service.name}
                        </p>
                      </div>

                      {/* DROPDOWN IMAGE (Flyer) */}
                      <div 
                        className={`
                          overflow-hidden transition-all duration-500 ease-in-out
                          ${isExpanded ? "max-h-250 opacity-100 mt-4" : "max-h-0 opacity-0"}
                        `}
                      >
                        <img 
                          src={service.flyer} 
                          alt="Flyer" 
                          className="w-full h-auto rounded-md shadow-2xl border border-white/20"
                        />
                      </div>

                      {/* Arrow Indicator */}
                      <div className={`text-white/50 text-[10px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                        ▼
                      </div>
                    </div>
                    );
      
                  })}
                </div>
              {/* </div> */}
            </div>

        {/* OPTIONAL FOOTER */}
        <div className="p-6 text-center">
             <p className="text-white/40 text-[10px] tracking-[3px] uppercase">The Bali Dream Villa</p>
        </div>

      </div>
    </div>
  );
}