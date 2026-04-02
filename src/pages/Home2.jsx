import { useEffect, useState } from "react";
import villaImg1 from "../assets/view-1.jpeg";
import villaImg2 from "../assets/view-2.jpeg";
import logo from "../assets/logo.png";

import ServicesSection from "../components/home/ServicesSection";
import PromotionsSection from "../components/home/PromotionsSection";
import HeadOfficeSection from "../components/home/HeadOfficeSection";
import FollowUsSection from "../components/home/FollowUsSection";
import FooterCopyright from "../components/FooterCopyright";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const villa = [villaImg1, villaImg2];
  const [currentIndex, setCurrentIndex] = useState(0);

  // slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % villa.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full font-cormorant bg-[#342818]">

      {/* HERO */}
      <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden">
        {villa.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`
              absolute top-0 left-0 w-full h-full object-cover brightness-75
              transition-opacity duration-1000
              ${index === currentIndex ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />

        {/* LOGO */}
        <div className="absolute inset-0 flex items-start justify-center pt-12 md:pt-16 xl:pt-20">
          <img
            src={logo}
            alt="The Bali Dream Villa"
            className="h-[90px] md:h-[120px] xl:h-[150px] object-contain"
          />
        </div>
      </section>

      {/* CONTENT (NO NEGATIVE MARGIN 🔥) */}
      <section
  className={`
    relative z-20

    -mt-20 md:-mt-32 xl:-mt-40
    rounded-t-[40px]

    bg-white/5
    backdrop-blur-xl
    border border-white/10

    px-6 md:px-20 xl:px-15
    pt-16 md:pt-20 xl:pt-15
    pb-16 md:pb-20 xl:pb-15

    flex flex-col
    gap-16 md:gap-20 xl:gap-15

    transition-all duration-700
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
  `}
>
    
        <ServicesSection visible={visible} />
        <PromotionsSection visible={visible} />
        <HeadOfficeSection visible={visible} />
        <FollowUsSection visible={visible} />
        <FooterCopyright visible={visible} />
      </section>
    </div>
  );
}