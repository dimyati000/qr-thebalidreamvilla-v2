import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import BackIcon from "../components/icons/BackIcon";

const VISIBLE_IMAGES = 3;
const IMAGE_GAP = 2;
const AUTO_SLIDE_DELAY = 5000;
const SWIPE_THRESHOLD = 30;
const SLIDE_DURATION = 1000;
export default function GalleryPage({
  title,
  images = [],
}) {
  const navigate = useNavigate();

  const trackRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const directionRef = useRef(null);
  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);

  const [galleryItems, setGalleryItems] = useState(() =>
    images.map((image, index) => ({
      id: `gallery-${index}`,
      image,
      originalIndex: index,
    }))
  );

  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] =
    useState(false);
  const [isPaused, setIsPaused] = useState(false);

  /*
   * Reset gallery ketika daftar gambar berubah.
   */
  useEffect(() => {
    setGalleryItems(
      images.map((image, index) => ({
        id: `gallery-${index}`,
        image,
        originalIndex: index,
      }))
    );

    setTransitionEnabled(false);
    setTranslateX(0);
    isAnimatingRef.current = false;
    directionRef.current = null;
  }, [images]);

  /*
   * Mengambil lebar satu gambar beserta jaraknya.
   */
  const getImageDistance = useCallback(() => {
    const track = trackRef.current;

    if (!track) return 0;

    const firstImage = track.querySelector(
      "[data-gallery-slide]"
    );

    if (!firstImage) return 0;

    return (
      firstImage.getBoundingClientRect().width +
      IMAGE_GAP
    );
  }, []);

  /*
   * Geser ke gambar berikutnya.
   * Selalu bergerak ke arah kanan secara infinite.
   */
  const slideNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (images.length <= VISIBLE_IMAGES) return;

    const imageDistance = getImageDistance();

    if (!imageDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "next";

    setTransitionEnabled(true);
    setTranslateX(-imageDistance);
  }, [getImageDistance, images.length]);

  /*
   * Geser ke gambar sebelumnya.
   *
   * Dari tampilan awal Spa 1, Spa 2, Spa 3,
   * ketika digeser ke kanan akan menampilkan
   * Spa 5 dari sisi kiri.
   */
  const slidePrevious = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (images.length <= VISIBLE_IMAGES) return;

    const imageDistance = getImageDistance();

    if (!imageDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "previous";

    /*
     * Pindahkan gambar terakhir ke depan
     * tanpa animasi terlebih dahulu.
     */
    flushSync(() => {
      setTransitionEnabled(false);

      setGalleryItems((currentItems) => {
        if (currentItems.length === 0) {
          return currentItems;
        }

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

      setTranslateX(-imageDistance);
    });

    /*
     * Setelah posisi siap, jalankan animasi
     * gambar sebelumnya masuk dari kiri.
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
        setTranslateX(0);
      });
    });
  }, [getImageDistance, images.length]);

  /*
   * Setelah animasi selesai, susun ulang array
   * secara tersembunyi agar slider terus berulang
   * tanpa terlihat melompat kembali.
   */
  const handleTransitionEnd = (event) => {
    if (
      event.target !== trackRef.current ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    if (directionRef.current === "next") {
      flushSync(() => {
        setTransitionEnabled(false);

        setGalleryItems((currentItems) => {
          if (currentItems.length === 0) {
            return currentItems;
          }

          return [
            ...currentItems.slice(1),
            currentItems[0],
          ];
        });

        setTranslateX(0);
      });
    }

    if (directionRef.current === "previous") {
      setTransitionEnabled(false);
    }

    directionRef.current = null;

    window.requestAnimationFrame(() => {
      isAnimatingRef.current = false;
    });
  };

  /*
   * Auto-slide setiap 3 detik.
   * Hanya berjalan pada desktop karena track
   * slider desktop saja yang menggunakan fungsi ini.
   */
  useEffect(() => {
    if (isPaused) return undefined;
    if (images.length <= VISIBLE_IMAGES) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      /*
       * Jangan menjalankan slider desktop
       * ketika viewport masih mobile.
       */
      if (window.innerWidth >= 1024) {
        slideNext();
      }
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [images.length, isPaused, slideNext]);

  /*
   * Mouse drag dan swipe.
   */
  const handlePointerDown = (event) => {
    if (isAnimatingRef.current) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    pointerStartXRef.current = event.clientX;
    pointerIdRef.current = event.pointerId;

    setIsPaused(true);

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  const handlePointerUp = (event) => {
    if (pointerStartXRef.current === null) {
      setIsPaused(false);
      return;
    }

    const swipeDistance =
      event.clientX - pointerStartXRef.current;

    pointerStartXRef.current = null;

    if (
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
    setIsPaused(false);

    if (
      Math.abs(swipeDistance) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    /*
     * Drag ke kiri:
     * menampilkan gambar berikutnya.
     *
     * Drag ke kanan:
     * menampilkan gambar sebelumnya.
     */
    if (swipeDistance < 0) {
      slideNext();
    } else {
      slidePrevious();
    }
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    pointerIdRef.current = null;

    setIsPaused(false);
  };

  return (
    <div className="min-h-screen w-full font-cormorant bg-gradient-to-br from-[#6b5344] to-[#4a3728]">
      {/* NAVBAR */}
      <div
        className="
          sticky
          top-0
          z-20
          flex
          items-center
          gap-5
          px-4
          bg-black/40
          backdrop-blur-md
          border-b
          border-white/10
        "
      >
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
            w-10
            h-10
            flex-shrink-0
            flex
            items-center
            justify-center
            rounded-full
            bg-white/10
            border
            border-white/20
            text-[#f8ebd2]
            hover:bg-white/20
            transition
          "
        >
          <BackIcon />
        </button>

        <h1
          className="
            text-white
            text-[20px]
            pt-[10px]
            font-medium
            tracking-[0.5px]
            leading-tight
          "
        >
          {title}
        </h1>
      </div>

      {/* MOBILE DAN TABLET */}
      {/* Tetap seperti tampilan lama: semua gambar vertikal */}
      <div className="flex flex-col lg:hidden">
        {images.map((img, index) => (
          <div
            key={`mobile-${index}`}
            className="w-full"
          >
            <img
              src={img}
              alt={`${title} ${index + 1}`}
              className="block w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* LAPTOP DAN DESKTOP */}
      {/* Slider horizontal, 3 gambar terlihat */}
      <div
        className="
          hidden
          lg:block
          w-full
          h-[calc(100vh-65px)]
          overflow-hidden
          select-none
        "
        style={{
          touchAction: "pan-y",
          cursor: isPaused ? "grabbing" : "grab",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          className="
            flex
            w-full
            h-full
            will-change-transform
          "
          style={{
            gap: `${IMAGE_GAP}px`,

            transform: `translate3d(${translateX}px, 0, 0)`,

            transition: transitionEnabled
              ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : "none",

            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              data-gallery-slide
              className="
                shrink-0
                h-full
                overflow-hidden
              "
              style={{
                flex: `
                  0 0 calc(
                    (100% - ${
                      IMAGE_GAP *
                      (VISIBLE_IMAGES - 1)
                    }px) /
                    ${VISIBLE_IMAGES}
                  )
                `,
              }}
            >
              <img
                src={item.image}
                alt={`${title} ${
                  item.originalIndex + 1
                }`}
                draggable="false"
                loading="lazy"
                className="
                  block
                  w-full
                  h-[calc(100vh-65px)]
                  object-cover
                  select-none
                  pointer-events-none
                "
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}