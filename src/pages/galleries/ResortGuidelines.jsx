import GalleryPage from "../GalleryPage";

import first from "../../assets/ResortGuidelines/1.jpg";
import second from "../../assets/ResortGuidelines/2.jpg";
import third from "../../assets/ResortGuidelines/3.jpg";
/*
 * Diletakkan di luar component agar array
 * tidak dibuat ulang setiap render.
 */
const ResortGuidelinesImages = [
  first,
  second,
  third,
];

export default function ResortGuidelines() {
  return (
    <GalleryPage
      title="RESORT GUIDELINES"
      images={ResortGuidelinesImages}
        desktopViewportBackground="#ffffff"
      mobileAutoScroll
  mobileAutoScrollDelay={5000}
  mobileAutoScrollSpeed={32}
    />
  );
}