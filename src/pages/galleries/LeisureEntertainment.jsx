import GalleryPage from "../GalleryPage";

import romantic from "../../assets/LeisureEntertainment/romantic-dinner.jpg";
import dining from "../../assets/LeisureEntertainment/dining-experience.jpg";
import canang from "../../assets/LeisureEntertainment/canang-making.jpg";
import cooking from "../../assets/LeisureEntertainment/cooking-class.jpg";

/*
 * Diletakkan di luar component agar array
 * tidak dibuat ulang setiap render.
 */
const LeisureEntertainmentImages = [
  romantic,
  dining,
  canang,
  cooking,
];

export default function LeisureEntertainment() {
  return (
    <GalleryPage
      title="LEISURE & ENTERTAINMENT"
      images={LeisureEntertainmentImages}
    />
  );
}