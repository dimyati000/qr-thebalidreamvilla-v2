import { useNavigate } from "react-router-dom";
import BackIcon from "../components/icons/BackIcon";

export default function PromotionPage({ title, images = [] }) {
  const navigate = useNavigate();

  return (
    // <div className="min-h-screen w-full font-cormorant bg-gradient-to-br from-[#6b5344] to-[#4a3728]">
    <div className="min-h-[100dvh] w-full font-cormorant bg-black">
      {/* NAVBAR */}
      {/* <div
  className="
    sticky z-20 flex items-center gap-2 px-4 py-2
    bg-black/30 backdrop-blur-lg border-b border-white/10
  "
> */}
      <div
        className="
    sticky top-0 z-20 flex items-center gap-3 px-4 py-2
    bg-black/40 backdrop-blur-xl border-b border-white/10
  "
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
      w-8 h-8 flex-shrink-0 flex items-center justify-center
      rounded-full bg-white/10 border border-white/20
      text-[#f8ebd2] hover:bg-white/20 transition
    "
        >
          <BackIcon />
        </button>

        {/* TITLE */}
        {/* <h1 
    className="
      text-white text-[13px] md:text-[14px]
      tracking-[0.8px] leading-tight font-medium
    "
  > */}
        <h1
          className="
    text-white text-[13px] md:text-[14px]
    tracking-[0.8px] leading-none font-medium
  "
        >
          {title}
        </h1>
      </div>

      {/* GALLERY */}
      {/* <div className="flex flex-col">
        {images.map((img, i) => (
          <div key={i} className="w-full">
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div> */}
      <div className="flex flex-col bg-black">
        {images.map((img, i) => (
          <div key={i} className="w-full bg-black">
            <img
              src={img}
              alt={`${title} ${i + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* FADE BAWAH */}
      <div className="h-20 w-full bg-gradient-to-white from-black to-transparent" />
    </div>
  );
}
