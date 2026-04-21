import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import villaImg1 from "../assets/villa/villa-1.webp";
import villaImg2 from "../assets/villa/villa-2.webp";
import logo from "../assets/logo.png";
import ServicesSection from "../components/home/ServicesSection";
import PromotionsSection from "../components/home/PromotionsSection";
import HeadOfficeSection from "../components/home/HeadOfficeSection";
import FollowUsSection from "../components/home/FollowUsSection";
import FooterCopyright from "../components/FooterCopyright";

export default function Home() {
  const footerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const villa = [villaImg1, villaImg2];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % villa.length);
  }, 5000); // 5 detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // PARENT
<div
  className="w-full font-cormorant min-h-screen bg-[#342818] relative"
  style={{
    backgroundImage: `url(${villa[currentIndex]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

  {/* HERO */}
  <div className="relative h-[260px] md:h-[100vh] lg:h-[100vh] w-full overflow-hidden">
  {/* <div className="relative h-[60vh] md:h-[100vh] w-full overflow-hidden flex items-start md:items-center pt-[5vh] md:pt-0"></div>
   <div className="relative h-[260px] md:h-full w-full overflow-hidden"> */}
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
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-transparent" />
</div>

   {/* LOGO */}
      <div className="absolute inset-0 flex items-start justify-center pt-12 md:pt-16 xl:pt-20 2xl:pt-24">          <img
            src={logo}
            alt="The Bali Dream Villa"
            className="
              h-[80px] 
              sm:h-[90px] 
              md:h-[110px] 
              lg:h-[130px] 
              xl:h-[150px] 
              2xl:h-[170px] 
              object-contain
            "
          />
        </div>
      

  {/* BOTTOM SHEET */}
   <div
    className={`relative -mt-16 md:-mt-40 xl:-mt-70 2xl:-mt-80 z-10 rounded-t-[26px]

    bg-gradient-to-b 
    from-transparent 
    via-[rgba(18,10,4,0.6)] 
    to-[rgba(18,10,4,0.9)]

    backdrop-blur-xl

    px-5 md:px-8 xl:px-14 2xl:px-16 
    pt-6 md:pt-10 xl:pt-14 2xl:pt-16 
    pb-7 md:pb-10 2xl:pb-4 

    flex flex-col gap-10 
    transition-all duration-700 
    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
  `}
  >
        <ServicesSection visible={visible} />
        <PromotionsSection visible={visible} />
        <HeadOfficeSection visible={visible} />
        <FollowUsSection visible={visible} />

        <FooterCopyright ref={footerRef} visible={visible} />
      </div>
    </div>
  );
}
