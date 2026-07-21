import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import canggu from "../../assets/promotions/canggu.png";
import seminyak from "../../assets/promotions/seminyak.png";
import suite from "../../assets/promotions/suite.png";
import spa from "../../assets/promotions/spa.png";
import romantic from "../../assets/promotions/romantic-dinner.jpg";
import dining from "../../assets/promotions/dining-experience.jpg";
import canang from "../../assets/promotions/canang-making.jpg";
import cooking from "../../assets/promotions/cooking-class.jpg";

const promosData = [
  {
    tag: "Canggu",
    image: canggu,
    path: "/canggu",
  },
  {
    tag: "Seminyak",
    image: seminyak,
    path: "/seminyak",
  },
  {
    tag: "Suite",
    image: suite,
    path: "/suite",
  },
  {
    tag: "Spa",
    image: spa,
    path: "/",
  },
  {
    tag: "Romantic Dinner",
    image: romantic,
    path: "/",
  },
  {
    tag: "Floating Dining Experience",
    image: dining,
    path: "/",
  },
  {
    tag: "Canang Making",
    image: canang,
    path: "/",
  },
  {
    tag: "Balinese Cooking Class",
    image: cooking,
    path: "/",
  },
];

const visibleCards = 3;
const sliderGap = 8;
const autoSlideDelay = 3000;

/*
 * Salin 3 item pertama ke bagian paling akhir.
 * Ini membuat slider bisa terus bergerak ke kanan tanpa terlihat kembali.
 */
const sliderItems = [
  ...promosData.map((promo, index) => ({
    ...promo,
    slideKey: `original-${index}`,
    originalIndex: index,
  })),

  ...promosData.slice(0, visibleCards).map((promo, index) => ({
    ...promo,
    slideKey: `clone-${index}`,
    originalIndex: index,
  })),
];

export default function PromotionsSection({ labelStyle, visible }) {
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const currentIndexRef = useRef(0);
  const scrollEndTimerRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const getCardDistance = () => {
    const slider = sliderRef.current;

    if (!slider) return 0;

    const firstCard = slider.querySelector("[data-promo-card]");

    if (!firstCard) return 0;

    return firstCard.offsetWidth + sliderGap;
  };

  const moveToSlide = (index, behavior = "smooth") => {
    const slider = sliderRef.current;
    const cardDistance = getCardDistance();

    if (!slider || !cardDistance) return;

    currentIndexRef.current = index;

    slider.scrollTo({
      left: index * cardDistance,
      behavior,
    });

    setActiveSlide(index % promosData.length);
  };

  /*
   * Auto slide setiap 3 detik.
   * Selalu bergerak satu card ke kanan.
   */
  useEffect(() => {
    if (isPaused || promosData.length <= visibleCards) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = currentIndexRef.current + 1;

      moveToSlide(nextIndex, "smooth");
    }, autoSlideDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  /*
   * Deteksi ketika scroll selesai.
   *
   * Saat mencapai salinan 3 gambar pertama,
   * posisi langsung dipindahkan ke awal tanpa animasi.
   *
   * Karena tampilan salinan dan gambar awal sama,
   * perpindahan ini tidak terlihat.
   */
  const handleSliderScroll = () => {
    const slider = sliderRef.current;
    const cardDistance = getCardDistance();

    if (!slider || !cardDistance) return;

    const currentIndex = Math.round(
      slider.scrollLeft / cardDistance
    );

    currentIndexRef.current = currentIndex;

    setActiveSlide(
      currentIndex % promosData.length
    );

    if (scrollEndTimerRef.current) {
      window.clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = window.setTimeout(() => {
      /*
       * Index promosData.length merupakan posisi:
       * clone Canggu, clone Seminyak, clone Suite.
       *
       * Tampilannya sama persis dengan index 0.
       */
      if (currentIndexRef.current >= promosData.length) {
        slider.scrollTo({
          left: 0,
          behavior: "auto",
        });

        currentIndexRef.current = 0;
        setActiveSlide(0);
      }
    }, 150);
  };

  /*
   * Bersihkan timer ketika component ditutup.
   */
  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        window.clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  const scrollToIndicator = (index) => {
    moveToSlide(index, "smooth");
  };

  const handlePromotionClick = (path) => {
    if (!path) return;

    navigate(path);
  };

  return (
    <section className={`bali-up d3 ${visible ? "on" : ""}`}>
      {/* HEADER */}
      <div className="flex items-center gap-[12px]">
        <p className="label-jost" style={labelStyle}>
          Promotions
        </p>

        {/* Indikator hilang di mobile, tampil di laptop */}
        {promosData.length > visibleCards && (
          <div
            className="
              hidden
              md:flex
              items-center
              gap-[5px]
              mb-[14px]
            "
            aria-label="Promotion slider navigation"
          >
            {promosData.map((promo, index) => (
              <button
                key={`indicator-${promo.tag}-${index}`}
                type="button"
                aria-label={`Go to ${promo.tag}`}
                onClick={() => scrollToIndicator(index)}
                className={`
                  h-[1px]
                  shrink-0
                  border-0
                  p-0
                  cursor-pointer
                  transition-all
                  duration-300
                  ${
                    activeSlide === index
                      ? "w-[28px] bg-[rgba(235,210,175,0.95)]"
                      : "w-[14px] bg-[rgba(205,178,138,0.35)]"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFINITE SLIDER */}
      <div
        ref={sliderRef}
        onScroll={handleSliderScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="
          promotions-slider
          grid
          grid-flow-col
          gap-[8px]
          w-full
          max-w-full
          overflow-x-auto
          overflow-y-hidden
          scroll-smooth
          snap-x
          snap-mandatory
          touch-pan-x
        "
        style={{
          /*
           * Tetap menampilkan tepat 3 gambar.
           * Ukuran card tidak berubah.
           */
          gridAutoColumns: "calc((100% - 16px) / 3)",
        }}
      >
        {sliderItems.map((promo, index) => (
          <div
            key={promo.slideKey}
            data-promo-card
            className="
              promo-tile
              snap-start
              min-w-0
              bg-[rgba(255,245,230,0.07)]
              border-[0.5px]
              border-[rgba(255,240,210,0.14)]
              p-[8px]
              min-h-[120px]
              flex
              flex-col
            "
          >
            <p className="promo-tag text-center pb-[5px]">
              {promo.tag}
            </p>

            <img
              src={promo.image}
              alt={`${promo.tag} promotion`}
              onClick={() => handlePromotionClick(promo.path)}
              draggable="false"
              className={`
                s${promo.originalIndex}
                block
                w-full
                h-full
                object-cover
                rounded-[6px]
                cursor-pointer
                select-none
              `}
            />
          </div>
        ))}
      </div>
    </section>
  );
}