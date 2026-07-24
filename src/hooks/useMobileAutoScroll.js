import {
    useCallback,
    useEffect,
    useRef,
} from "react";

export default function useMobileAutoScroll({
    enabled = false,
    delay = 5000,
    speed = 32,
    breakpoint = 1024,
} = {}) {
    const timeoutRef = useRef(null);
    const animationFrameRef = useRef(null);
    const isRunningRef = useRef(false);

    const stopAutoScroll = useCallback(() => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        if (animationFrameRef.current !== null) {
            window.cancelAnimationFrame(
                animationFrameRef.current
            );

            animationFrameRef.current = null;
        }

        isRunningRef.current = false;
    }, []);

    const startAutoScroll = useCallback(() => {
        stopAutoScroll();

        if (!enabled) return;

        /*
         * Hanya aktif pada mobile dan tablet.
         */
        if (window.innerWidth >= breakpoint) return;

        timeoutRef.current = window.setTimeout(() => {
            const scrollingElement =
                document.scrollingElement ||
                document.documentElement;

            let previousTime = window.performance.now();

            isRunningRef.current = true;

            const animateScroll = (currentTime) => {
                /*
                 * Hentikan jika ukuran berubah menjadi laptop.
                 */
                if (window.innerWidth >= breakpoint) {
                    stopAutoScroll();
                    return;
                }

                const deltaTime =
                    (currentTime - previousTime) / 1000;

                previousTime = currentTime;

                const maxScroll =
                    scrollingElement.scrollHeight -
                    window.innerHeight;

                const currentScroll =
                    scrollingElement.scrollTop;

                /*
                 * Berhenti saat sudah sampai paling bawah.
                 */
                if (
                    maxScroll <= 0 ||
                    currentScroll >= maxScroll - 1
                ) {
                    scrollingElement.scrollTop = maxScroll;

                    animationFrameRef.current = null;
                    isRunningRef.current = false;

                    return;
                }

                scrollingElement.scrollTop = Math.min(
                    maxScroll,
                    currentScroll + speed * deltaTime
                );

                animationFrameRef.current =
                    window.requestAnimationFrame(
                        animateScroll
                    );
            };

            animationFrameRef.current =
                window.requestAnimationFrame(
                    animateScroll
                );
        }, delay);
    }, [
        breakpoint,
        delay,
        enabled,
        speed,
        stopAutoScroll,
    ]);

    useEffect(() => {
        if (!enabled) {
            stopAutoScroll();
            return undefined;
        }

        const handleManualInteraction = () => {
            /*
             * Saat pengguna menyentuh atau scroll manual:
             * hentikan, lalu tunggu lima detik lagi.
             */
            startAutoScroll();
        };

        const handleResize = () => {
            startAutoScroll();
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        };

        startAutoScroll();

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
            stopAutoScroll();

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
        enabled,
        startAutoScroll,
        stopAutoScroll,
    ]);
}