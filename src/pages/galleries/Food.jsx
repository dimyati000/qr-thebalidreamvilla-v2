import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackIcon from "../../components/icons/BackIcon";

import villa1 from "../../assets/villa/villa-1.jpg";
import villa2 from "../../assets/villa/villa-2.jpg";

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
    <div className="relative min-h-screen w-full overflow-hidden font-cormorant">

      {/* BACKGROUND SLIDER */}
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

      {/* BLUR + DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[#342818]" />

      {/* NAVBAR */}
      <div className="relative z-10 flex items-center gap-3 p-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
        >
          <BackIcon />
        </button>

        <h1 className="text-white text-xl tracking-wide">
          IN-ROOM DINING
        </h1>
      </div>

      {/* CONTENT (Coming Soon) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[80vh] px-6">
        
        <h2 className="text-white text-3xl md:text-4xl mb-4">
          Coming Soon
        </h2>

        <p className="text-[#f8ebd2] opacity-80">
          For inquiries, please contact us at 0.
        </p>

      </div>
    </div>
  );
}