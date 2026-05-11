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
  { 
    id: "seminyak", 
    name: "THE BALI DREAM VILLA SEMINYAK", 
    // Menggunakan Array untuk menampung lebih dari 1 gambar
    flyer: [spa1, spa2, spa3, spa4, spa5] 
  },
  { id: "suite", name: "THE BALI DREAM SUITE VILLA SEMINYAK", flyer: suite },
  { id: "canggu", name: "THE BALI DREAM VILLA & RESORT ECHO BEACH CANGGU", flyer: canggu },
];

export default function Compendium() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleCardClick = (id) => {
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

      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] bg-gradient-to-b from-black/20 via-transparent to-[#1c140a]" />

      <div className="relative z-20 flex flex-col min-h-screen">
        <div className="flex items-center gap-3 pl-4 pt-4">
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

        <div className="flex-1 px-4 pb-10 flex flex-col justify-center items-center mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start w-full max-w-6xl">
            {services.map((service, i) => {
              const isExpanded = expandedId === service.id;
              // Cek apakah flyer adalah array (untuk Seminyak) atau string tunggal
              const isMultipleImages = Array.isArray(service.flyer);

              return (
                <div
                  key={service.id}
                  onClick={() => handleCardClick(service.id)}
                  className={`
                    p-6 flex flex-col items-center text-center gap-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 
                    transition-all duration-500 transform cursor-pointer
                    hover:bg-white/10 hover:scale-[1.02]
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                  `}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <p className="svc-card-name">{service.name}</p>

                  <div 
                    className={`
                      w-full overflow-y-auto transition-all duration-500 ease-in-out
                      /* Memberikan max-height agar bisa discroll saat terbuka */
                      ${isExpanded ? "max-h-[60vh] opacity-100 mt-4" : "max-h-0 opacity-0"}
                      /* Scrollbar tipis untuk estetika */
                      scrollbar-hide
                    `}
                  >
                    {/* <div className="flex flex-col gap-3"> */}
                    <div className="flex flex-col">
                      {isMultipleImages ? (
                        service.flyer.map((imgUrl, imgIndex) => (
                          <img 
                            key={imgIndex}
                            src={imgUrl} 
                            alt={`Flyer ${imgIndex}`} 
                            className="w-full h-auto rounded-md shadow-xl border border-white/10"
                          />
                        ))
                      ) : (
                        <img 
                          src={service.flyer} 
                          alt="Flyer" 
                          className="w-full h-auto rounded-md shadow-xl border border-white/10"
                        />
                      )}
                    </div>
                  </div>

                  <div className={`text-white/50 text-[10px] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-white/40 text-[10px] tracking-[3px] uppercase">The Bali Dream Villa</p>
        </div>
      </div>
    </div>
  );
}