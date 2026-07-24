import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import BackIcon from "../../components/icons/BackIcon";

import romantic from "../../assets/LeisureEntertainment/romantic-dinner.jpg";
import dining from "../../assets/LeisureEntertainment/dining-experience.jpg";
import canang from "../../assets/LeisureEntertainment/canang-making.jpg";
import cooking from "../../assets/LeisureEntertainment/cooking-class.jpg";

const LEISURE_IMAGES = [
  {
    id: "romantic-dinner",
    image: romantic,
    alt: "Romantic Dinner",
  },
  {
    id: "floating-dining",
    image: dining,
    alt: "Floating Dining Experience",
  },
  {
    id: "canang-making",
    image: canang,
    alt: "Balinese Canang Making",
  },
  {
    id: "cooking-class",
    image: cooking,
    alt: "Balinese Cooking Class",
  },
];

/*
 * Tiga set dipakai sebagai buffer internal
 * agar slider laptop tidak pernah kehabisan gambar.
 */
const LOOP_ITEMS = Array.from(
  { length: 3 },
  (_, copyIndex) =>
    LEISURE_IMAGES.map((item, imageIndex) => ({
      ...item,
      key: `${copyIndex}-${item.id}`,
      originalIndex: imageIndex,
    }))
).flat();

const IMAGE_COUNT = LEISURE_IMAGES.length;
const START_INDEX = IMAGE_COUNT;

const POSTER_WIDTH = 1414;
const POSTER_HEIGHT = 2000;

/* Slider laptop */
const AUTO_SLIDE_DELAY = 5000;
const SLIDE_DURATION = 1000;
const SWIPE_THRESHOLD = 30;

/* Auto-scroll mobile dan tablet */
const MOBILE_AUTO_SCROLL_DELAY = 5000;
const MOBILE_AUTO_SCROLL_SPEED = 32;
const MOBILE_BREAKPOINT = 1024;

function normalizeIndex(index) {
  return (
    ((index % IMAGE_COUNT) + IMAGE_COUNT) %
    IMAGE_COUNT
  );
}

export default function LeisureEntertainment() {
  const navigate = useNavigate();

  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const currentIndexRef = useRef(START_INDEX);
  const isAnimatingRef = useRef(false);

  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);

  const loadedImagesRef = useRef(new Set());

  /*
   * Refs khusus auto-scroll mobile/tablet.
   */
  const mobileScrollTimeoutRef = useRef(null);
  const mobileScrollFrameRef = useRef(null);

  const [currentIndex, setCurrentIndex] =
    useState(START_INDEX);

  const [slideDistance, setSlideDistance] =
    useState(0);

  const [transitionEnabled, setTransitionEnabled] =
    useState(false);

  const [isInteracting, setIsInteracting] =
    useState(false);

  const [isPositionReady, setIsPositionReady] =
    useState(false);

  const [loadedImageCount, setLoadedImageCount] =
    useState(0);

  const allImagesLoaded =
    loadedImageCount >= IMAGE_COUNT;

  /*
   * =====================================================
   * AUTO-SCROLL MOBILE DAN TABLET
   * =====================================================
   */

  /*
   * Menghentikan timeout dan animasi auto-scroll.
   */
  const stopMobileAutoScroll = useCallback(() => {
    if (mobileScrollTimeoutRef.current !== null) {
      window.clearTimeout(
        mobileScrollTimeoutRef.current
      );

      mobileScrollTimeoutRef.current = null;
    }

    if (mobileScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(
        mobileScrollFrameRef.current
      );

      mobileScrollFrameRef.current = null;
    }
  }, []);

  /*
   * Menunggu lima detik, lalu halaman bergerak
   * perlahan ke bawah.
   */
  const scheduleMobileAutoScroll =
    useCallback(() => {
      stopMobileAutoScroll();

      /*
       * Hanya aktif di mobile dan tablet.
       * Tailwind lg juga dimulai dari 1024px.
       */
      if (
        window.innerWidth >= MOBILE_BREAKPOINT
      ) {
        return;
      }

      mobileScrollTimeoutRef.current =
        window.setTimeout(() => {
          const scrollingElement =
            document.scrollingElement ||
            document.documentElement;

          let previousTime =
            window.performance.now();

          const animateScroll = (currentTime) => {
            /*
             * Hentikan jika ukuran layar berubah
             * menjadi laptop.
             */
            if (
              window.innerWidth >=
              MOBILE_BREAKPOINT
            ) {
              stopMobileAutoScroll();
              return;
            }

            /*
             * Hentikan sementara ketika tab browser
             * sedang tidak aktif.
             */
            if (document.hidden) {
              stopMobileAutoScroll();
              return;
            }

            const deltaTime =
              (currentTime - previousTime) /
              1000;

            previousTime = currentTime;

            /*
             * Dihitung ulang setiap frame karena
             * gambar lazy dapat menambah tinggi page.
             */
            const maximumScroll =
              scrollingElement.scrollHeight -
              window.innerHeight;

            const currentScroll =
              scrollingElement.scrollTop;

            if (
              maximumScroll <= 0 ||
              currentScroll >=
                maximumScroll - 1
            ) {
              scrollingElement.scrollTop =
                Math.max(maximumScroll, 0);

              mobileScrollFrameRef.current =
                null;

              return;
            }

            const nextScroll =
              currentScroll +
              MOBILE_AUTO_SCROLL_SPEED *
                deltaTime;

            scrollingElement.scrollTop =
              Math.min(
                nextScroll,
                maximumScroll
              );

            mobileScrollFrameRef.current =
              window.requestAnimationFrame(
                animateScroll
              );
          };

          mobileScrollFrameRef.current =
            window.requestAnimationFrame(
              animateScroll
            );
        }, MOBILE_AUTO_SCROLL_DELAY);
    }, [stopMobileAutoScroll]);

  /*
   * Mengaktifkan auto-scroll ketika page dibuka.
   *
   * Saat user menyentuh, scroll manual, atau
   * menekan keyboard:
   * - auto-scroll berhenti
   * - menunggu lima detik
   * - berjalan kembali
   */
  useEffect(() => {
    const handleManualInteraction = () => {
      scheduleMobileAutoScroll();
    };

    const handleResize = () => {
      scheduleMobileAutoScroll();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopMobileAutoScroll();
      } else {
        scheduleMobileAutoScroll();
      }
    };

    scheduleMobileAutoScroll();

    window.addEventListener(
      "wheel",
      handleManualInteraction,
      { passive: true }
    );

    window.addEventListener(
      "touchstart",
      handleManualInteraction,
      { passive: true }
    );

    window.addEventListener(
      "pointerdown",
      handleManualInteraction,
      { passive: true }
    );

    window.addEventListener(
      "keydown",
      handleManualInteraction
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      stopMobileAutoScroll();

      window.removeEventListener(
        "wheel",
        handleManualInteraction
      );

      window.removeEventListener(
        "touchstart",
        handleManualInteraction
      );

      window.removeEventListener(
        "pointerdown",
        handleManualInteraction
      );

      window.removeEventListener(
        "keydown",
        handleManualInteraction
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    scheduleMobileAutoScroll,
    stopMobileAutoScroll,
  ]);

  /*
   * =====================================================
   * SLIDER LAPTOP DAN DESKTOP
   * =====================================================
   */

  /*
   * Menghitung lebar satu poster berdasarkan
   * tinggi area gallery laptop.
   */
  const measureSlider = useCallback(() => {
    const track = trackRef.current;

    if (!track) return;

    const firstSlide = track.querySelector(
      "[data-leisure-slide]"
    );

    if (!firstSlide) return;

    const measuredDistance =
      firstSlide.getBoundingClientRect().width;

    if (!measuredDistance) return;

    const logicalIndex = normalizeIndex(
      currentIndexRef.current
    );

    const safeMiddleIndex =
      START_INDEX + logicalIndex;

    setTransitionEnabled(false);
    setSlideDistance(measuredDistance);
    setCurrentIndex(safeMiddleIndex);

    currentIndexRef.current =
      safeMiddleIndex;

    setIsPositionReady(true);
  }, []);

  /*
   * Posisi awal berada di buffer tengah sebelum
   * browser menampilkan slider.
   */
  useLayoutEffect(() => {
    const frameId =
      window.requestAnimationFrame(() => {
        measureSlider();
      });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [measureSlider]);

  /*
   * Hitung ulang slider saat ukuran viewport berubah.
   */
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return undefined;

    const resizeObserver = new ResizeObserver(
      () => {
        setIsPositionReady(false);
        measureSlider();
      }
    );

    resizeObserver.observe(viewport);

    return () => {
      resizeObserver.disconnect();
    };
  }, [measureSlider]);

  /*
   * Menghitung hanya empat file unik,
   * bukan semua salinan buffer.
   */
  const markImageLoaded = useCallback(
    (imageId) => {
      if (
        loadedImagesRef.current.has(imageId)
      ) {
        return;
      }

      loadedImagesRef.current.add(imageId);

      setLoadedImageCount(
        loadedImagesRef.current.size
      );
    },
    []
  );

  /*
   * direction:
   *  1 = berikutnya
   * -1 = sebelumnya
   */
  const moveSlider = useCallback(
    (direction) => {
      if (!allImagesLoaded) return;
      if (!isPositionReady) return;
      if (!slideDistance) return;
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      const nextIndex =
        currentIndexRef.current +
        direction;

      currentIndexRef.current =
        nextIndex;

      setTransitionEnabled(true);
      setCurrentIndex(nextIndex);
    },
    [
      allImagesLoaded,
      isPositionReady,
      slideDistance,
    ]
  );

  const slideNext = useCallback(() => {
    moveSlider(1);
  }, [moveSlider]);

  const slidePrevious = useCallback(() => {
    moveSlider(-1);
  }, [moveSlider]);

  /*
   * Setelah memasuki buffer luar, slider
   * dipindahkan diam-diam ke buffer tengah.
   */
  const handleTransitionEnd = (event) => {
    if (
      event.target !== trackRef.current ||
      event.propertyName !== "transform"
    ) {
      return;
    }

    let normalizedIndex =
      currentIndexRef.current;

    if (
      normalizedIndex >=
      START_INDEX + IMAGE_COUNT
    ) {
      normalizedIndex -= IMAGE_COUNT;
    }

    if (normalizedIndex < START_INDEX) {
      normalizedIndex += IMAGE_COUNT;
    }

    if (
      normalizedIndex !==
      currentIndexRef.current
    ) {
      flushSync(() => {
        setTransitionEnabled(false);
        setCurrentIndex(normalizedIndex);

        currentIndexRef.current =
          normalizedIndex;
      });
    }

    /*
     * Memaksa browser menyelesaikan posisi reset
     * sebelum gerakan berikutnya.
     */
    trackRef.current?.getBoundingClientRect();

    window.requestAnimationFrame(() => {
      isAnimatingRef.current = false;
    });
  };

  /*
   * Auto-slide laptop setiap lima detik.
   */
  useEffect(() => {
    if (!allImagesLoaded) {
      return undefined;
    }

    if (!isPositionReady) {
      return undefined;
    }

    if (isInteracting) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      /*
       * Auto-slide horizontal hanya aktif
       * pada ukuran laptop.
       */
      if (
        window.innerWidth >=
        MOBILE_BREAKPOINT
      ) {
        slideNext();
      }
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    allImagesLoaded,
    isPositionReady,
    isInteracting,
    slideNext,
  ]);

  const handlePointerDown = (event) => {
    if (!allImagesLoaded) return;
    if (!isPositionReady) return;
    if (isAnimatingRef.current) return;

    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    pointerStartXRef.current =
      event.clientX;

    pointerIdRef.current =
      event.pointerId;

    setIsInteracting(true);

    event.currentTarget.setPointerCapture?.(
      event.pointerId
    );
  };

  const handlePointerUp = (event) => {
    if (
      pointerStartXRef.current === null
    ) {
      setIsInteracting(false);
      return;
    }

    const swipeDistance =
      event.clientX -
      pointerStartXRef.current;

    pointerStartXRef.current = null;
    setIsInteracting(false);

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

    if (
      Math.abs(swipeDistance) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    if (swipeDistance < 0) {
      slideNext();
    } else {
      slidePrevious();
    }
  };

  const handlePointerCancel = () => {
    pointerStartXRef.current = null;
    pointerIdRef.current = null;

    setIsInteracting(false);
  };

  const trackIsReady =
    isPositionReady &&
    allImagesLoaded &&
    slideDistance > 0;

  return (
    <div
      className="
        min-h-screen
        w-full
        font-cormorant
        bg-gradient-to-br
        from-[#6b5344]
        to-[#4a3728]

        lg:h-[100svh]
        lg:min-h-0
        lg:flex
        lg:flex-col
        lg:overflow-hidden
      "
    >
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
          lg:shrink-0
        "
      >
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
          LEISURE &amp; ENTERTAINMENT
        </h1>
      </div>

      {/* MOBILE DAN TABLET */}
      <div className="flex flex-col lg:hidden">
        {LEISURE_IMAGES.map(
          (item, index) => (
            <div
              key={`mobile-${item.id}`}
              className="w-full"
            >
              <img
                src={item.image}
                alt={item.alt}
                width={POSTER_WIDTH}
                height={POSTER_HEIGHT}
                loading={
                  index === 0
                    ? "eager"
                    : "lazy"
                }
                decoding="async"
                fetchPriority={
                  index === 0
                    ? "high"
                    : "low"
                }
                /*
                 * Setelah gambar pertama siap,
                 * hitung ulang timer auto-scroll.
                 */
                onLoad={
                  index === 0
                    ? scheduleMobileAutoScroll
                    : undefined
                }
                className="
                  block
                  w-full
                  h-auto
                  object-cover
                "
              />
            </div>
          )
        )}
      </div>

      {/* LAPTOP DAN DESKTOP */}
      <div
        ref={viewportRef}
        className="
          hidden
          lg:block
          lg:flex-1
          lg:min-h-0
          w-full
          overflow-hidden
          select-none
          bg-[#17100c]
        "
        style={{
          touchAction: "pan-y",

          cursor: trackIsReady
            ? isInteracting
              ? "grabbing"
              : "grab"
            : "default",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={
          handlePointerCancel
        }
      >
        {/* INFINITE BUFFER TRACK */}
        <div
          ref={trackRef}
          onTransitionEnd={
            handleTransitionEnd
          }
          className="
            flex
            h-full
            w-max
            will-change-transform
          "
          style={{
            opacity: trackIsReady ? 1 : 0,

            transform: slideDistance
              ? `translate3d(${
                  -currentIndex *
                  slideDistance
                }px, 0, 0)`
              : "translate3d(0, 0, 0)",

            transition: transitionEnabled
              ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : "none",

            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility:
              "hidden",
          }}
        >
          {LOOP_ITEMS.map(
            (item, index) => (
              <div
                key={item.key}
                data-leisure-slide
                className="
                  h-full
                  shrink-0
                  overflow-hidden
                  bg-[#17100c]
                "
                style={{
                  aspectRatio: `${POSTER_WIDTH} / ${POSTER_HEIGHT}`,
                  flex: "0 0 auto",
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  width={POSTER_WIDTH}
                  height={POSTER_HEIGHT}
                  draggable="false"
                  loading="eager"
                  decoding="async"
                  fetchPriority={
                    index >= START_INDEX &&
                    index <
                      START_INDEX +
                        IMAGE_COUNT
                      ? "high"
                      : "auto"
                  }
                  onLoad={() =>
                    markImageLoaded(item.id)
                  }
                  onError={() =>
                    markImageLoaded(item.id)
                  }
                  className="
                    block
                    h-full
                    w-full
                    object-contain
                    select-none
                    pointer-events-none
                  "
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}