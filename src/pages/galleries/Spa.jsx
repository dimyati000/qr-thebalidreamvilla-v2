import GalleryPage from "../GalleryPage";

import spa1 from "../../assets/spa/spa-1.webp";
import spa2 from "../../assets/spa/spa-2.webp";
import spa3 from "../../assets/spa/spa-3.webp";
import spa4 from "../../assets/spa/spa-4.webp";
import spa5 from "../../assets/spa/spa-5.webp";

/*
 * Diletakkan di luar component agar array
 * tidak dibuat ulang setiap render.
 */
const spaImages = [
  spa1,
  spa2,
  spa3,
  spa4,
  spa5,
];

export default function Spa() {
  return (
    <GalleryPage
      title="SPA & WELLNESS"
      images={spaImages}
      mobileAutoScroll
      mobileAutoScrollDelay={5000}
      mobileAutoScrollSpeed={32}
    />
  );
}