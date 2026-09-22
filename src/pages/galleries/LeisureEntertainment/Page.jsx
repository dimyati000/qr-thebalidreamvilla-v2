import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import BackIcon from "../../../components/icons/BackIcon";

import villa1 from "../../../assets/villa/villa-1.webp";
import villa2 from "../../../assets/villa/villa-2.webp";

import romantic from "../../../assets/LeisureEntertainment/romantic-dinner.jpg";
import dining from "../../../assets/LeisureEntertainment/dining-experience.jpg";
import canang from "../../../assets/LeisureEntertainment/canang-making.jpg";
import cooking from "../../../assets/LeisureEntertainment/cooking-class.jpg";

const backgroundImages = [villa1, villa2];

const services = [
  {
    id: "curated-experiences",
    name: "CURATED EXPERIENCES",
    description: "Signature dining, wellness, and memorable villa moments.",
    type: "gallery",
    flyers: [
      romantic,
      dining,
    ],
  },
  {
    id: "exclusive-partnerships",
    name: "EXCLUSIVE PARTNERSHIPS",
    description: "Selected benefits and experiences from our trusted partners.",
    type: "gallery",
    flyers: [
      canang,
      cooking,
    ],
  },
  {
    id: "destination-guide",
    name: "DESTINATION GUIDE",
    description: "Explore selected places and activities around Seminyak and Canggu.",
    type: "route",
    path: "/destination-guide",
  },
];

/* Menunggu lima detik sebelum auto-scroll dimulai. */
const AUTO_SCROLL_DELAY = 5000;

/* Kecepatan auto-scroll dalam pixel per detik. */
const AUTO_SCROLL_SPEED = 65;

/* Interval pergantian background. */
const BACKGROUND_DELAY = 5000;

export default function LeisureEntertainment() {
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);
  const autoScrollFrameRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const clearAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) {
      window.clearTimeout(autoScrollTimeoutRef.current);
      autoScrollTimeoutRef.current = null;
    }

    if (autoScrollFrameRef.current) {
      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }

    isAutoScrollingRef.current = false;
  }, []);

  const scheduleAutoScroll = useCallback(() => {
    clearAutoScroll();

    autoScrollTimeoutRef.current = window.setTimeout(() => {
      const container = scrollContainerRef.current;

      if (!container) return;

      const maxScroll = container.scrollHeight - container.clientHeight;

      if (maxScroll <= 0) return;

      isAutoScrollingRef.current = true;

      let previousTime = window.performance.now();

      const animateScroll = (currentTime) => {
        const currentContainer = scrollContainerRef.current;

        if (!currentContainer) {
          clearAutoScroll();
          return;
        }

        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        const currentMaxScroll =
          currentContainer.scrollHeight - currentContainer.clientHeight;

        const nextPosition =
          currentContainer.scrollTop + AUTO_SCROLL_SPEED * deltaTime;

        if (nextPosition >= currentMaxScroll) {
          currentContainer.scrollTop = currentMaxScroll;
          autoScrollFrameRef.current = null;
          isAutoScrollingRef.current = false;
          return;
        }

        currentContainer.scrollTop = nextPosition;
        autoScrollFrameRef.current =
          window.requestAnimationFrame(animateScroll);
      };

      autoScrollFrameRef.current =
        window.requestAnimationFrame(animateScroll);
    }, AUTO_SCROLL_DELAY);
  }, [clearAutoScroll]);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (backgroundImages.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setBackgroundIndex(
        (currentIndex) => (currentIndex + 1) % backgroundImages.length,
      );
    }, BACKGROUND_DELAY);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    clearAutoScroll();

    if (!expandedId) return undefined;

    const firstFrame = window.requestAnimationFrame(() => {
      const secondFrame = window.requestAnimationFrame(() => {
        const container = scrollContainerRef.current;

        if (!container) return;

        container.scrollTop = 0;
        scheduleAutoScroll();
      });

      autoScrollFrameRef.current = secondFrame;
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      clearAutoScroll();
    };
  }, [expandedId, clearAutoScroll, scheduleAutoScroll]);

  useEffect(() => {
    return () => {
      clearAutoScroll();
    };
  }, [clearAutoScroll]);

  const handleServiceClick = (service) => {
    clearAutoScroll();

    if (service.type === "route") {
      navigate(service.path);
      return;
    }

    setExpandedId((currentId) =>
      currentId === service.id ? null : service.id,
    );
  };

  const handleManualInteraction = () => {
    scheduleAutoScroll();
  };

  const handleFirstImageLoad = () => {
    if (!expandedId) return;
    scheduleAutoScroll();
  };

  return (
    <div
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-black
        font-cormorant
      "
    >
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <img
            key={`background-${index}`}
            src={image}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "low"}
            className={`
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-opacity
              duration-1000
              ${index === backgroundIndex ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}
      </div>

      {/* BACKGROUND OVERLAY */}
      <div
        className="
          absolute
          inset-0
          z-10
          bg-black/40
          bg-linear-to-b
          from-black/20
          via-transparent
          to-[#1c140a]
          backdrop-blur-[2px]
        "
      />

      {/* CONTENT */}
      <div className="relative z-20 flex min-h-screen flex-col">
        {/* HEADER */}
        <div className="flex items-center gap-3 pl-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/20
              bg-white/10
              text-white
              backdrop-blur-md
              transition
              hover:bg-white/20
            "
          >
            <BackIcon />
          </button>

          <h1
            className="
              gallery-page-title
              leading-tight
              font-light
              uppercase
              tracking-[0.2em]
              text-white
              drop-shadow-lg
            "
          >
            Guest Experience
          </h1>
        </div>

        {/* SERVICES */}
        <div
          className="
            mt-10
            flex
            flex-1
            flex-col
            items-center
            justify-center
            px-4
            pb-10
          "
        >
          <div
            className="
              grid
              w-full
              max-w-6xl
              grid-cols-1
              items-start
              gap-4
              md:grid-cols-3
            "
          >
            {services.map((service, serviceIndex) => {
              const isGallery = service.type === "gallery";
              const isExpanded = isGallery && expandedId === service.id;

              return (
                <div
                  key={service.id}
                  className={`
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    p-6
                    text-center
                    backdrop-blur-md
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#e9c98b]/30
                    hover:bg-white/10
                    ${
                      visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }
                  `}
                  style={{
                    transitionDelay: `${serviceIndex * 150}ms`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleServiceClick(service)}
                    aria-expanded={isGallery ? isExpanded : undefined}
                    aria-controls={
                      isGallery ? `gallery-${service.id}` : undefined
                    }
                    className="
                      flex
                      w-full
                      flex-col
                      items-center
                      gap-3
                      bg-transparent
                      text-center
                    "
                  >
                    {/* <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#e9c98b]/80">
                      {String(serviceIndex + 1).padStart(2, "0")}
                    </span> */}

                    <p className="svc-card-name">{service.name}</p>

                    {/* <p className="max-w-xs text-xs font-light leading-relaxed text-white">
                      {service.description}
                    </p>
 */}
                    <span
                      aria-hidden="true"
                      className={`
                        mt-1
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        text-[11px]
                        text-[#e9c98b]/80
                        transition-all
                        duration-300
                        ${isExpanded ? "rotate-180 bg-white/10" : ""}
                      `}
                    >
                      {isGallery ? "⌄" : "→"}
                    </span>
                  </button>

                  {isGallery && (
                    <div
                      id={`gallery-${service.id}`}
                      className={`
                        w-full
                        overflow-hidden
                        transition-all
                        duration-500
                        ease-in-out
                        ${
                          isExpanded
                            ? "mt-5 max-h-[65vh] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      {isExpanded && (
                        <div
                          ref={scrollContainerRef}
                          onWheel={handleManualInteraction}
                          onPointerDown={handleManualInteraction}
                          onTouchStart={handleManualInteraction}
                          onKeyDown={handleManualInteraction}
                          onScroll={() => {
                            if (!isAutoScrollingRef.current) {
                              handleManualInteraction();
                            }
                          }}
                          tabIndex={0}
                          className="
                            max-h-[65vh]
                            w-full
                            overflow-y-auto
                            overscroll-contain
                            rounded-lg
                            outline-none
                            [scrollbar-width:none]
                            [-ms-overflow-style:none]
                            [&::-webkit-scrollbar]:hidden
                          "
                          style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                          }}
                        >
                          <div className="flex flex-col">
                            {service.flyers.map((image, imageIndex) => (
                              <img
                                key={`${service.id}-${imageIndex}`}
                                src={image}
                                alt={`${service.name} flyer ${imageIndex + 1}`}
                                loading={imageIndex === 0 ? "eager" : "lazy"}
                                decoding="async"
                                fetchPriority={
                                  imageIndex === 0 ? "high" : "low"
                                }
                                draggable="false"
                                onLoad={
                                  imageIndex === 0
                                    ? handleFirstImageLoad
                                    : undefined
                                }
                                className="
                                  block
                                  h-auto
                                  w-full
                                  flex-none
                                  object-contain
                                "
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 text-center">
          <p className="text-[10px] uppercase tracking-[3px] text-white/40">
            The Bali Dream Villa
          </p>
        </div>
      </div>
    </div>
  );
}
