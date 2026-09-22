import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

import BackIcon from "../components/icons/BackIcon";

const IMAGE_GAP = 0;

/* Jeda sebelum slider desktop berpindah */
const AUTO_SLIDE_DELAY = 5000;

/* Durasi animasi slider desktop */
const SLIDE_DURATION = 1000;

/* Minimal drag untuk berpindah slide */
const SWIPE_THRESHOLD = 30;

function createGalleryItems(images) {
  return images.map((image, index) => ({
    id: `gallery-${index}`,
    image,
    originalIndex: index,
  }));
}

export default function GalleryPage({
  title,
  images = [],

  /*
   * Default null:
   * halaman lain tetap menggunakan background lama.
   *
   * Contoh Resort Guidelines:
   * desktopViewportBackground="#ffffff"
   */
  desktopViewportBackground = null,

  /*
   * Default false:
   * auto-scroll mobile tidak aktif kecuali diminta.
   *
   * Contoh Spa:
   * mobileAutoScroll
   */
  mobileAutoScroll = false,
  mobileAutoScrollDelay = 5000,
  mobileAutoScrollSpeed = 32,
}) {
  const navigate = useNavigate();

  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const isAnimatingRef = useRef(false);
  const directionRef = useRef(null);

  const pointerStartXRef = useRef(null);
  const pointerIdRef = useRef(null);

  /*
   * Auto-scroll mobile dan tablet.
   */
  const mobileScrollTimeoutRef = useRef(null);
  const mobileScrollFrameRef = useRef(null);
  const isMobileAutoScrollingRef = useRef(false);

  const [galleryItems, setGalleryItems] = useState(() =>
    createGalleryItems(images)
  );

  const [translateX, setTranslateX] = useState(0);

  const [transitionEnabled, setTransitionEnabled] =
    useState(false);

  const [isInteracting, setIsInteracting] =
    useState(false);

  const [canSlide, setCanSlide] = useState(false);

  /*
   * =====================================================
   * MOBILE DAN TABLET AUTO-SCROLL
   * =====================================================
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

    isMobileAutoScrollingRef.current = false;
  }, []);

  const scheduleMobileAutoScroll =
    useCallback(() => {
      stopMobileAutoScroll();

      if (!mobileAutoScroll) return;

      /*
       * Hanya aktif di bawah ukuran laptop.
       */
      if (window.innerWidth >= 1024) return;

      mobileScrollTimeoutRef.current =
        window.setTimeout(() => {
          const scrollingElement =
            document.scrollingElement ||
            document.documentElement;

          const maximumScroll =
            scrollingElement.scrollHeight -
            window.innerHeight;

          if (maximumScroll <= 0) return;

          let previousTime =
            window.performance.now();

          isMobileAutoScrollingRef.current = true;

          const animateScroll = (currentTime) => {
            /*
             * Berhenti jika viewport berubah
             * menjadi ukuran laptop.
             */
            if (window.innerWidth >= 1024) {
              stopMobileAutoScroll();
              return;
            }

            const deltaTime =
              (currentTime - previousTime) / 1000;

            previousTime = currentTime;

            const currentMaximumScroll =
              scrollingElement.scrollHeight -
              window.innerHeight;

            const currentScroll =
              scrollingElement.scrollTop;

            const nextScroll =
              currentScroll +
              mobileAutoScrollSpeed * deltaTime;

            /*
             * Berhenti ketika sudah mencapai
             * bagian paling bawah.
             */
            if (
              currentMaximumScroll <= 0 ||
              nextScroll >= currentMaximumScroll
            ) {
              scrollingElement.scrollTop =
                currentMaximumScroll;

              mobileScrollFrameRef.current = null;
              isMobileAutoScrollingRef.current =
                false;

              return;
            }

            scrollingElement.scrollTop = nextScroll;

            mobileScrollFrameRef.current =
              window.requestAnimationFrame(
                animateScroll
              );
          };

          mobileScrollFrameRef.current =
            window.requestAnimationFrame(
              animateScroll
            );
        }, mobileAutoScrollDelay);
    }, [
      mobileAutoScroll,
      mobileAutoScrollDelay,
      mobileAutoScrollSpeed,
      stopMobileAutoScroll,
    ]);

  useEffect(() => {
    if (!mobileAutoScroll) {
      stopMobileAutoScroll();
      return undefined;
    }

    /*
     * Saat pengguna melakukan interaksi manual:
     * - auto-scroll berhenti
     * - menunggu lagi sesuai delay
     * - kemudian berjalan kembali
     */
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
    mobileAutoScroll,
    scheduleMobileAutoScroll,
    stopMobileAutoScroll,
  ]);

  /*
   * =====================================================
   * DESKTOP GALLERY SLIDER
   * =====================================================
   */

  const checkCanSlide = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) return;

    const slides = Array.from(
      track.querySelectorAll(
        "[data-gallery-slide]"
      )
    );

    if (slides.length === 0) {
      setCanSlide(false);
      return;
    }

    const totalImagesWidth = slides.reduce(
      (total, slide) =>
        total +
        slide.getBoundingClientRect().width,
      0
    );

    const totalGap =
      Math.max(slides.length - 1, 0) *
      IMAGE_GAP;

    const contentWidth =
      totalImagesWidth + totalGap;

    const viewportWidth =
      viewport.getBoundingClientRect().width;

    const shouldSlide =
      contentWidth > viewportWidth + 2;

    setCanSlide(shouldSlide);

    /*
     * Jika seluruh gambar sudah muat,
     * kembalikan ke posisi awal dan center.
     */
    if (!shouldSlide) {
      setTransitionEnabled(false);
      setTranslateX(0);

      isAnimatingRef.current = false;
      directionRef.current = null;
    }
  }, []);

  /*
   * Reset gallery jika images berubah.
   */
  useEffect(() => {
    setGalleryItems(
      createGalleryItems(images)
    );

    setTransitionEnabled(false);
    setTranslateX(0);
    setCanSlide(false);

    isAnimatingRef.current = false;
    directionRef.current = null;

    const firstFrame =
      window.requestAnimationFrame(() => {
        const secondFrame =
          window.requestAnimationFrame(() => {
            checkCanSlide();
          });

        return secondFrame;
      });

    return () => {
      window.cancelAnimationFrame(firstFrame);
    };
  }, [images, checkCanSlide]);

  /*
   * Periksa ulang ukuran slider ketika
   * ukuran browser berubah.
   */
  useEffect(() => {
    const handleResize = () => {
      setTransitionEnabled(false);
      setTranslateX(0);

      isAnimatingRef.current = false;
      directionRef.current = null;

      window.requestAnimationFrame(() => {
        checkCanSlide();
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [checkCanSlide]);

  const getFirstSlideDistance =
    useCallback(() => {
      const track = trackRef.current;

      if (!track) return 0;

      const firstSlide = track.querySelector(
        "[data-gallery-slide]"
      );

      if (!firstSlide) return 0;

      return (
        firstSlide.getBoundingClientRect().width +
        IMAGE_GAP
      );
    }, []);

  const getLastSlideDistance =
    useCallback(() => {
      const track = trackRef.current;

      if (!track) return 0;

      const slides = track.querySelectorAll(
        "[data-gallery-slide]"
      );

      const lastSlide =
        slides[slides.length - 1];

      if (!lastSlide) return 0;

      return (
        lastSlide.getBoundingClientRect().width +
        IMAGE_GAP
      );
    }, []);

  /*
   * Geser ke gambar berikutnya.
   */
  const slideNext = useCallback(() => {
    if (!canSlide) return;
    if (isAnimatingRef.current) return;

    const slideDistance =
      getFirstSlideDistance();

    if (!slideDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "next";

    setTransitionEnabled(true);
    setTranslateX(-slideDistance);
  }, [canSlide, getFirstSlideDistance]);

  /*
   * Geser ke gambar sebelumnya.
   */
  const slidePrevious = useCallback(() => {
    if (!canSlide) return;
    if (isAnimatingRef.current) return;

    const slideDistance =
      getLastSlideDistance();

    if (!slideDistance) return;

    isAnimatingRef.current = true;
    directionRef.current = "previous";

    flushSync(() => {
      setTransitionEnabled(false);

      setGalleryItems((currentItems) => {
        if (currentItems.length <= 1) {
          return currentItems;
        }

        const lastItem =
          currentItems[
            currentItems.length - 1
          ];

        return [
          lastItem,
          ...currentItems.slice(
            0,
            currentItems.length - 1
          ),
        ];
      });

      setTranslateX(-slideDistance);
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
        setTranslateX(0);
      });
    });
  }, [canSlide, getLastSlideDistance]);

  /*
   * Susun ulang item setelah animasi selesai.
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
          if (currentItems.length <= 1) {
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

    if (
      directionRef.current === "previous"
    ) {
      setTransitionEnabled(false);
    }

    directionRef.current = null;

    window.requestAnimationFrame(() => {
      isAnimatingRef.current = false;
    });
  };

  /*
   * Auto-slide desktop.
   */
  useEffect(() => {
    if (!canSlide) return undefined;
    if (isInteracting) return undefined;

    const intervalId = window.setInterval(() => {
      if (window.innerWidth >= 1024) {
        slideNext();
      }
    }, AUTO_SLIDE_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    canSlide,
    isInteracting,
    slideNext,
  ]);

  const handlePointerDown = (event) => {
    if (!canSlide) return;
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
    if (pointerStartXRef.current === null) {
      setIsInteracting(false);
      return;
    }

    const swipeDistance =
      event.clientX -
      pointerStartXRef.current;

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
    setIsInteracting(false);

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
            gallery-page-title
            text-white
            font-medium
            tracking-[0.5px]
            leading-tight
          "
        >
          {title}
        </h1>
      </div>

      {/* MOBILE DAN TABLET */}
      <div className="flex flex-col lg:hidden">
        {images.map((img, index) => (
          <div
            key={`mobile-${index}`}
            className="w-full"
          >
            <img
              src={img}
              alt={`${title} ${index + 1}`}
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
              onLoad={
                index === 0 &&
                mobileAutoScroll
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
        ))}
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
        "
        style={{
          touchAction: "pan-y",

          /*
           * Hanya berubah pada page yang
           * memberikan prop background.
           */
          backgroundColor:
            desktopViewportBackground ||
            undefined,

          cursor: canSlide
            ? isInteracting
              ? "grabbing"
              : "grab"
            : "default",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* SLIDER TRACK */}
        <div
          ref={trackRef}
          onTransitionEnd={
            handleTransitionEnd
          }
          className="
            flex
            h-full
            will-change-transform
          "
          style={{
            width: "max-content",

            minWidth: canSlide
              ? "max-content"
              : "100%",

            justifyContent: canSlide
              ? "flex-start"
              : "center",

            gap: `${IMAGE_GAP}px`,

            transform: `translate3d(
              ${translateX}px,
              0,
              0
            )`,

            transition: transitionEnabled
              ? `transform ${SLIDE_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`
              : "none",

            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility:
              "hidden",
          }}
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              data-gallery-slide
              className="
                inline-flex
                h-full
                shrink-0
                overflow-hidden
              "
              style={{
                flex: "0 0 auto",
              }}
            >
              <img
                src={item.image}
                alt={`${title} ${
                  item.originalIndex + 1
                }`}
                draggable="false"
                loading="eager"
                decoding="async"
                onLoad={checkCanSlide}
                className="
                  block
                  h-full
                  w-auto
                  max-w-none
                  object-contain
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
