import { useNavigate } from "react-router-dom";
import SpaIcon from "../icons/SpaIcon";
import RoomServiceIcon from "../icons/RoomServiceIcon";
import BookIcon from "../icons/BookIcon";
import ScrollIcon from "../icons/ScrollIcon";
import FacilitiesIcon from "../icons/FacilitiesIcon";
import ServiceCard from "../services/ServiceCard";

const services = [
  { 
    name: "GUEST EXPERIENCE", 
    subtitle: "Hotel information and guest services", 
    Icon: BookIcon, 
    path: "/compendium" 
  },
  { 
    name: "RESORT GUIDELINES", 
    subtitle: "Essential policies for refined stays", 
    Icon: ScrollIcon,
    path: "/rules"
  },
  { 
    name: "LEISURE & ENTERTAINMENT", 
    subtitle: "Curated activities and experiences", 
    Icon: FacilitiesIcon,
    path: "/facilities", 
  },
  { 
    name: "IN-ROOM DINING", 
    subtitle: "Tailored food & beverage", 
    Icon: RoomServiceIcon,
    path: "/food"
  },
  { 
    name: "SPA & WELLNESS", 
    subtitle: "Signature and relaxation treatments", 
    Icon: SpaIcon,
    path: "/spa"
  },
];

export default function ServicesSection({ labelStyle, visible = true }) {
  const navigate = useNavigate();

  return (
    <section className={`bali-up d2 ${visible ? "on" : ""}`}>
      <p className="label-jost text-[10px] md:text-[13px] xl:text-[14px] 2xl:text-[14px]">
        Services
      </p>

      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4 xl:grid-cols-5 md:gap-[14px] xl:gap-[16px] 2xl:gap-[18px] md:pt-[8px]">
        {services.map((service, i) => {
          const isLastItem = i === services.length - 1;
          const isTotalOdd = services.length % 2 !== 0;

          return (
            <div 
              key={service.name}
              // Tambahkan h-full di sini supaya wrapper punya tinggi seragam
              className={`h-full ${isLastItem && isTotalOdd ? "col-span-2 md:col-span-1" : "col-span-1"}`}
            >
              <ServiceCard
                name={service.name}
                subtitle={service.subtitle}
                Icon={service.Icon}
                isVisible={true}
                delayClass={`s${i}`}
                onClick={() => navigate(service.path)}
                // Pastikan komponen ServiceCard menerima class untuk tinggi penuh
                className="h-full" 
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}