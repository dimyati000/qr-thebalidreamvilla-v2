import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import BackIcon from "../../components/icons/BackIcon";

import villa1 from "../../assets/villa/villa-1.webp";
import villa2 from "../../assets/villa/villa-2.webp";

import canggu1 from "../../assets/GuestExperience/canggu/1.jpg";
import canggu2 from "../../assets/GuestExperience/canggu/2.jpg";
import canggu3 from "../../assets/GuestExperience/canggu/3.jpg";
import canggu4 from "../../assets/GuestExperience/canggu/4.jpg";
import canggu5 from "../../assets/GuestExperience/canggu/5.jpg";
import canggu6 from "../../assets/GuestExperience/canggu/6.jpg";
import canggu7 from "../../assets/GuestExperience/canggu/7.jpg";
import canggu8 from "../../assets/GuestExperience/canggu/8.jpg";
import canggu9 from "../../assets/GuestExperience/canggu/9.jpg";
import canggu10 from "../../assets/GuestExperience/canggu/10.jpg";
import canggu11 from "../../assets/GuestExperience/canggu/11.jpg";
import canggu12 from "../../assets/GuestExperience/canggu/12.jpg";

import seminyak1 from "../../assets/GuestExperience/seminyak/1.jpg";
import seminyak2 from "../../assets/GuestExperience/seminyak/2.jpg";
import seminyak3 from "../../assets/GuestExperience/seminyak/3.jpg";
import seminyak4 from "../../assets/GuestExperience/seminyak/4.jpg";
import seminyak5 from "../../assets/GuestExperience/seminyak/5.jpg";
import seminyak6 from "../../assets/GuestExperience/seminyak/6.jpg";
import seminyak7 from "../../assets/GuestExperience/seminyak/7.jpg";
import seminyak8 from "../../assets/GuestExperience/seminyak/8.jpg";
import seminyak9 from "../../assets/GuestExperience/seminyak/9.jpg";
import seminyak10 from "../../assets/GuestExperience/seminyak/10.jpg";
import seminyak11 from "../../assets/GuestExperience/seminyak/11.jpg";
import seminyak12 from "../../assets/GuestExperience/seminyak/12.jpg";

import suite1 from "../../assets/GuestExperience/suite/1.jpg";
import suite2 from "../../assets/GuestExperience/suite/2.jpg";
import suite3 from "../../assets/GuestExperience/suite/3.jpg";
import suite4 from "../../assets/GuestExperience/suite/4.jpg";
import suite5 from "../../assets/GuestExperience/suite/5.jpg";
import suite6 from "../../assets/GuestExperience/suite/6.jpg";
import suite7 from "../../assets/GuestExperience/suite/7.jpg";
import suite8 from "../../assets/GuestExperience/suite/8.jpg";
import suite9 from "../../assets/GuestExperience/suite/9.jpg";
import suite10 from "../../assets/GuestExperience/suite/10.jpg";
import suite11 from "../../assets/GuestExperience/suite/11.jpg";

const backgroundImages = [villa1, villa2];

const services = [
  {
    id: "suite",
    name: "THE BALI DREAM SUITE VILLA SEMINYAK",
    flyers: [
      suite1,
      suite2,
      suite3,
      suite4,
      suite5,
      suite6,
      suite7,
      suite8,
      suite9,
      suite10,
      suite11,
    ],
  },
  {
    id: "seminyak",
    name: "THE BALI DREAM VILLA SEMINYAK",
    flyers: [
      seminyak1,
      seminyak2,
      seminyak3,
      seminyak4,
      seminyak5,
      seminyak6,
      seminyak7,
      seminyak8,
      seminyak9,
      seminyak10,
      seminyak11,
      seminyak12,
    ],
  },
  {
    id: "canggu",
    name: "THE BALI DREAM SUITE VILLA RESORT & ECHO BEACH CANGGU",
    flyers: [
      canggu1,
      canggu2,
      canggu3,
      canggu4,
      canggu5,
      canggu6,
      canggu7,
      canggu8,
      canggu9,
      canggu10,
      canggu11,
      canggu12,
    ],
  },
];

export default function Compendium() {
  const navigate = useNavigate();

  const scrollContainerRef = useRef(null);
  const autoScrollTimeoutRef = useRef(null);
  const autoScrollFrameRef = useRef(null);

  const [backgroundIndex, setBackgroundIndex] =
    useState(0);

  const [visible, setVisible] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  /*
   * Hentikan timer dan animasi auto-scroll
   * yang sedang berjalan.
   */
  const clearAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) {
      window.clearTimeout(
        autoScrollTimeoutRef.current
      );

      autoScrollTimeoutRef.current = null;
    }

    if (autoScrollFrameRef.current) {
      window.cancelAnimationFrame(
        autoScrollFrameRef.current
      );

      autoScrollFrameRef.current = null;
    }
  }, []);

  /*
   * Jadwalkan auto-scroll setelah 5 detik.
   */
  const scheduleAutoScroll = useCallback(() => {
    clearAutoScroll();

    const container = scrollContainerRef.current;

    if (!container) return;

    autoScrollTimeoutRef.current =
      window.setTimeout(() => {
        const maxScroll =
          container.scrollHeight -
          container.clientHeight;

        /*
         * Tidak perlu auto-scroll apabila semua
         * gambar sudah terlihat tanpa scroll.
         */
        if (maxScroll <= 0) return;

        let previousTime =
          window.performance.now();

        const animateScroll = (currentTime) => {
          const deltaTime =
            (currentTime - previousTime) / 1000;

          previousTime = currentTime;

          const currentMaxScroll =
            container.scrollHeight -
            container.clientHeight;

          const nextPosition =
            container.scrollTop +
            AUTO_SCROLL_SPEED * deltaTime;

          /*
           * Berhenti ketika sudah mencapai
           * gambar paling bawah.
           */
          if (
            nextPosition >= currentMaxScroll
          ) {
            container.scrollTop =
              currentMaxScroll;

            autoScrollFrameRef.current = null;
            return;
          }

          container.scrollTop = nextPosition;

          autoScrollFrameRef.current =
            window.requestAnimationFrame(
              animateScroll
            );
        };

        autoScrollFrameRef.current =
          window.requestAnimationFrame(
            animateScroll
          );
      }, AUTO_SCROLL_DELAY);
  }, [clearAutoScroll]);

  /*
   * Animasi card masuk.
   */
  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  /*
   * Background otomatis berubah setiap 5 detik.
   */
  useEffect(() => {
    if (backgroundImages.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setBackgroundIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          backgroundImages.length
      );
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  /*
   * Ketika card dibuka:
   * - posisi dimulai dari atas
   * - tunggu 5 detik
   * - mulai scroll perlahan
   */
  useEffect(() => {
    clearAutoScroll();

    if (!expandedId) return undefined;

    const frameId =
      window.requestAnimationFrame(() => {
        const container =
          scrollContainerRef.current;

        if (!container) return;

        container.scrollTop = 0;
        scheduleAutoScroll();
      });

    return () => {
      window.cancelAnimationFrame(frameId);
      clearAutoScroll();
    };
  }, [
    expandedId,
    clearAutoScroll,
    scheduleAutoScroll,
  ]);

  const handleCardToggle = (serviceId) => {
    setExpandedId((currentId) =>
      currentId === serviceId
        ? null
        : serviceId
    );
  };

  /*
   * Saat pengguna melakukan scroll manual,
   * hentikan auto-scroll sementara.
   *
   * Setelah 5 detik tidak ada interaksi,
   * auto-scroll akan berjalan lagi.
   */
  const handleManualInteraction = () => {
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
        {backgroundImages.map(
          (image, index) => (
            <img
              key={`background-${index}`}
              src={image}
              alt=""
              aria-hidden="true"
              className={`
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-opacity
                duration-1000
                ${
                  index === backgroundIndex
                    ? "opacity-100"
                    : "opacity-0"
                }
              `}
            />
          )
        )}
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
              text-lg
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
            {services.map(
              (service, serviceIndex) => {
                const isExpanded =
                  expandedId === service.id;

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
                      hover:bg-white/10
                      ${
                        visible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }
                    `}
                    style={{
                      transitionDelay: `${
                        serviceIndex * 150
                      }ms`,
                    }}
                  >
                    {/* CARD TOGGLE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCardToggle(
                          service.id
                        )
                      }
                      aria-expanded={isExpanded}
                      className="
                        flex
                        w-full
                        flex-col
                        items-center
                        gap-4
                        bg-transparent
                        text-center
                      "
                    >
                      <p className="svc-card-name">
                        {service.name}
                      </p>

                      <span
                        className={`
                          text-[10px]
                          text-white/50
                          transition-transform
                          duration-300
                          ${
                            isExpanded
                              ? "rotate-180"
                              : ""
                          }
                        `}
                      >
                        ▼
                      </span>
                    </button>

                    {/* EXPANDED CONTENT */}
                    <div
                      className={`
                        w-full
                        overflow-hidden
                        transition-all
                        duration-500
                        ease-in-out
                        ${
                          isExpanded
                            ? "mt-4 max-h-[65vh] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      {/* SCROLL CONTAINER */}
                      <div
                        ref={
                          isExpanded
                            ? scrollContainerRef
                            : null
                        }
                        onWheel={
                          handleManualInteraction
                        }
                        onPointerDown={
                          handleManualInteraction
                        }
                        onTouchStart={
                          handleManualInteraction
                        }
                        onScroll={() => {
                          /*
                           * Jangan terus reset timer ketika
                           * scroll berasal dari auto-scroll.
                           */
                          if (
                            !autoScrollFrameRef.current
                          ) {
                            handleManualInteraction();
                          }
                        }}
                        className="
                          scrollbar-hide
                          max-h-[65vh]
                          w-full
                          overflow-y-auto
                          overscroll-contain
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
                          {service.flyers.map(
                            (
                              image,
                              imageIndex
                            ) => (
                              <img
                                key={`${service.id}-${imageIndex}`}
                                src={image}
                                alt={`${service.name} flyer ${
                                  imageIndex + 1
                                }`}
                                loading={
                                  imageIndex < 2
                                    ? "eager"
                                    : "lazy"
                                }
                                draggable="false"
                                className="
                                  block
                                  h-auto
                                  w-full
                                  flex-none
                                  object-contain
                                "
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 text-center">
          <p
            className="
              text-[10px]
              uppercase
              tracking-[3px]
              text-white/40
            "
          >
            The Bali Dream Villa
          </p>
        </div>
      </div>
    </div>
  );
}