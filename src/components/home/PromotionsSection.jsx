import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
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
    path: "/promotion-spa",
  },
  {
    tag: "Romantic Dinner",
    image: romantic,
    path: "/promotion-romantic",
  },
  {
    tag: "Floating Dining Experience",
    image: dining,
    path: "/promotion-dining",
  },
  {
    tag: "Canang Making",
    image: canang,
    path: "/promotion-canang",
  },
  {
    tag: "Balinese Cooking Class",
    image: cooking,
    path: "/promotion-cooking",
  },
];

const sliderGap = 8;
const autoSlideDelay = 3000;
const swipeThreshold = 45;

export default function PromotionsSection({
  labelStyle,
  visible,
}) {
  const navigate = useNavigate();

  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const isAnimatingRef = useRef(false);
  const directionRef = useRef(null);

  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);
  const wasDraggedRef = useRef(false);

  /*
   * Hanya memakai promosData asli.
   * Tidak ada clone atau salinan gambar tambahan.
   */
  const [sliderItems, setSliderItems] = useState(promosData);

  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] =
    useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const getCardDistance = useCallback(() => {
    const track = trackRef.current;

    if (!track) return 0;

    const firstCard = track.querySelector(
      "[data-promo-card]"
    );

    if (!firstCard) return 0;

    return firstCard.getBoundingClientRect().width + sliderGap;
  }, []);

  /*
   * Gerak satu gambar ke kanan.
   */
  const slideRight = useCallback(() => {
    if (isAnimatingRef.current) return;

    const cardDistance = getCardDistance();

    if (!cardDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "right";

    setTransitionEnabled(true);
    setTranslateX(-cardDistance);
  }, [getCardDistance]);

  /*
   * Gerak satu gambar ke kiri.
   *
   * Gambar terakhir dipindahkan ke depan terlebih dahulu
   * tanpa animasi. Setelah itu baru dianimasikan masuk
   * dari sebelah kiri.
   */
  const slideLeft = useCallback(() => {
    if (isAnimatingRef.current) return;

    const cardDistance = getCardDistance();

    if (!cardDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "left";

    flushSync(() => {
      setTransitionEnabled(false);

      setSliderItems((currentItems) => {
        const lastItem =
          currentItems[currentItems.length - 1];

        return [
          lastItem,
          ...currentItems.slice(
            0,
            currentItems.length - 1
          ),
        ];
      });

      /*
       * Posisi ini secara visual masih menampilkan:
       * Canggu, Seminyak, Suite.
       */
      setTranslateX(-cardDistance);
    });

    /*
     * Pada frame berikutnya, gambar terakhir
     * masuk secara smooth dari kiri.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
        setTranslateX(0);
      });
    });
  }, [getCardDistance]);

  /*
   * Setelah animasi kanan selesai:
   * item paling depan dipindahkan ke belakang,
   * lalu transform dikembalikan ke 0 tanpa animasi.
   *
   * Karena posisi visualnya sama, tidak terlihat
   * ada gerakan kembali ke kiri.
   */
  const handleTransitionEnd = (event) => {
    if (
      event.target !== trackRef.current ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    if (directionRef.current === "right") {
      flushSync(() => {
        setTransitionEnabled(false);

        setSliderItems((currentItems) => [
          ...currentItems.slice(1),
          currentItems[0],
        ]);

        setTranslateX(0);

        setActiveIndex(
          (currentIndex) =>
            (currentIndex + 1) % promosData.length
        );
      });
    }

    if (directionRef.current === "left") {
      setTransitionEnabled(false);

      setActiveIndex(
        (currentIndex) =>
          (currentIndex - 1 + promosData.length) %
          promosData.length
      );
    }

    directionRef.current = null;

    window.requestAnimationFrame(() => {
      isAnimatingRef.current = false;
    });
  };

  /*
   * Auto-slide ke kanan setiap 3 detik.
   */
  useEffect(() => {
    if (isInteracting) return undefined;

    const intervalId = window.setInterval(() => {
      slideRight();
    }, autoSlideDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isInteracting, slideRight]);

  /*
   * Mulai swipe atau mouse drag.
   */
  const handlePointerDown = (event) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    pointerStartXRef.current = event.clientX;
    pointerIdRef.current = event.pointerId;
    wasDraggedRef.current = false;

    setIsInteracting(true);

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    }
  };

  const handlePointerMove = (event) => {
    if (pointerStartXRef.current === null) return;

    const distance =
      event.clientX - pointerStartXRef.current;

    if (Math.abs(distance) > 8) {
      wasDraggedRef.current = true;
    }
  };

  /*
   * Swipe ke kiri  = slide berikutnya.
   * Swipe ke kanan = slide sebelumnya.
   */
  const handlePointerUp = (event) => {
    if (pointerStartXRef.current === null) return;

    const distance =
      event.clientX - pointerStartXRef.current;

    pointerStartXRef.current = null;
    setIsInteracting(false);

    if (
      event.currentTarget.releasePointerCapture &&
      pointerIdRef.current !== null &&
      event.currentTarget.hasPointerCapture?.(
        pointerIdRef.current
      )
    ) {
      event.currentTarget.releasePointerCapture(
        pointerIdRef.current
      );
    }

    pointerIdRef.current = null;

    if (Math.abs(distance) < swipeThreshold) return;

    if (distance < 0) {
      slideRight();
    } else {
      slideLeft();
    }
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    pointerIdRef.current = null;
    setIsInteracting(false);
  };

  const handlePromotionClick = (path) => {
    /*
     * Jangan buka link setelah pengguna melakukan swipe.
     */
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }

    if (!path) return;

    navigate(path);
  };

  return (
    <section
      className={`bali-up d3 ${visible ? "on" : ""}`}
    >
      {/* HEADER */}
      <div className="flex items-center gap-[12px]">
        <p
          className="label-jost"
          style={labelStyle}
        >
          Promotions
        </p>

        {/* 
          Indikator garis:
          - Hilang di mobile
          - Muncul di laptop
        */}
        <div
          className="
            hidden
            md:flex
            items-center
            gap-[5px]
            mb-[14px]
          "
          aria-label="Promotion slider indicator"
        >
          {promosData.map((promo, index) => (
            <span
              key={`indicator-${promo.tag}-${index}`}
              className={`
                block
                h-[1px]
                shrink-0
                transition-all
                duration-300
                ${
                  activeIndex === index
                    ? "w-[28px] bg-[rgba(235,210,175,0.95)]"
                    : "w-[14px] bg-[rgba(205,178,138,0.35)]"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* SLIDER VIEWPORT */}
      <div
        ref={viewportRef}
        className="
          promotions-slider
          w-full
          max-w-full
          overflow-hidden
          select-none
        "
        style={{
          touchAction: "pan-y",
          cursor: isInteracting
            ? "grabbing"
            : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* SLIDER TRACK */}
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="
            flex
            gap-[8px]
            w-full
            will-change-transform
          "
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,

            transition: transitionEnabled
              ? "transform 650ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
        >
          {sliderItems.map((promo, index) => (
            <div
              key={`${promo.tag}-${index}`}
              data-promo-card
              className="
                promo-tile
                min-w-0
                shrink-0
                bg-[rgba(255,245,230,0.07)]
                border-[0.5px]
                border-[rgba(255,240,210,0.14)]
                p-[8px]
                min-h-[120px]
                flex
                flex-col
              "
              style={{
                /*
                 * Ukuran tetap sama:
                 * selalu menampilkan tepat 3 card.
                 */
                flex:
                  "0 0 calc((100% - 16px) / 3)",
              }}
            >
              <p className="promo-tag text-center pb-[5px]">
                {promo.tag}
              </p>

              <img
                src={promo.image}
                alt={`${promo.tag} promotion`}
                draggable="false"
                onClick={() =>
                  handlePromotionClick(promo.path)
                }
                className="
                  block
                  w-full
                  h-full
                  object-cover
                  rounded-[6px]
                  cursor-pointer
                  select-none
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}