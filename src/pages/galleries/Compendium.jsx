import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackIcon from "../../components/icons/BackIcon";

// Import Icon yang dibutuhkan
import SpaIcon from "../../components/icons/SpaIcon";
import RoomServiceIcon from "../../components/icons/RoomServiceIcon";
import BookIcon from "../../components/icons/BookIcon";
import ScrollIcon from "../../components/icons/ScrollIcon";
import FacilitiesIcon from "../../components/icons/FacilitiesIcon";

import villa1 from "../../assets/villa/villa-1.webp";
import villa2 from "../../assets/villa/villa-2.webp";

const images = [villa1, villa2];

const services = [
  // { name: "THE BALI DREAM VILLA SEMINYAK", subtitle: "Wellness & Ritual", Icon: SpaIcon },
  { name: "THE BALI DREAM VILLA SEMINYAK", Icon: SpaIcon },
  { name: "THE BALI DREAM SUITE VILLA SEMINYAK", Icon: RoomServiceIcon },
  { name: "THE BALI DREAM VILLA & RESORT ECHO BEACH CANGGU", Icon: BookIcon },
  ];

export default function Compendium() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

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
      <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] bg-gradient-to-b from-black/20 via-transparent to-[#1c140a]" />

      {/* 3. WRAPPER CONTENT */}
      <div className="relative z-20 flex flex-col min-h-screen">
        
        {/* NAVBAR */}
        <div className="flex items-center gap-3 p-6 pt-12">
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
              <div className="p-[18px] pt-[20px] px-[16px] 
flex flex-col items-center text-center 
gap-[12px]
bg-white/5 backdrop-blur-md
border border-white/10
rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {services.map((service, i) => (
                    <div
                      key={i}
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
    

                      {/* TEXT */}
                      <div className="flex flex-col items-center">
                        <p className="svc-card-name">
                          {service.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

        {/* OPTIONAL FOOTER */}
        <div className="p-6 text-center">
             <p className="text-white/40 text-[10px] tracking-[3px] uppercase">The Bali Dream Villa</p>
        </div>

      </div>
    </div>
  );
}