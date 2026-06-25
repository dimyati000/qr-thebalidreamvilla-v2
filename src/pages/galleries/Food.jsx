import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackIcon from "../../components/icons/BackIcon";

import villa1 from "../../assets/villa/villa-1.webp";
import villa2 from "../../assets/villa/villa-2.webp";

const images = [villa1, villa2];

export default function Compendium() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // ganti tiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
        <div className="relative min-h-screen w-full overflow-hidden font-cormorant bg-black">
    
          {/* 1. BACKGROUND SLIDER (Layer paling bawah) */}
          <div className="absolute inset-0 z-0">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-opacity duration-1000
                  ${i === index ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>
    
          {/* 2. OVERLAY (Layer tengah) */}
          {/* Kita gabung blur dan gradient di sini agar tidak bertumpuk terlalu banyak */}
          <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[2px] bg-linear-to-b from-black/20 via-transparent to-[#342818]" />
    
          {/* 3. WRAPPER CONTENT (Layer paling atas) */}
          {/* Gunakan z-20 untuk memastikan ini di atas overlay */}
          <div className="relative z-20 flex flex-col min-h-screen">
            
            {/* NAVBAR */}
            <div className="flex items-center gap-3 p-6">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 border border-white/40 text-white hover:bg-white/30 transition backdrop-blur-md"
              >
                <BackIcon />
              </button>
    
              <h1 className="text-white text-xl tracking-[0.2em] font-medium drop-shadow-lg">
          IN-ROOM DINING
              </h1>
            </div>
    
            {/* CONTENT (Coming Soon) */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              {/* Judul dengan Gradient Kuning Emas */}
              <h2 className="text-white/80! max-w-xs leading-relaxed tracking-wide drop-shadow-md">
                Coming Soon
              </h2>
    
              {/* Deskripsi dipaksa Putih dengan !important */}
              <p className="text-white/80! max-w-xs leading-relaxed tracking-wide drop-shadow-md">
                For inquiries, please contact us at <span className="font-bold">0</span>.
              </p>
            </div>
          </div>
    
        </div>
      );
}
