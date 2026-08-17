import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "google-identity-services";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function loadGoogleScript() {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
        return new Promise((resolve, reject) => {
            if (window.google?.accounts?.id) {
                resolve();
            } else {
                existing.addEventListener("load", resolve);
                existing.addEventListener("error", reject);
            }
        });
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export default function GoogleLoginButton({ onCredential, disabled }) {
    const containerRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!CLIENT_ID) {
            return;
        }

        let cancelled = false;

        const renderBtn = () => {
            if (!window.google?.accounts?.id || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const availableWidth = rect.width || containerRef.current.clientWidth || 280;

            // Wait until container has actual layout width (e.g. after modal open animation)
            if (availableWidth < 100) {
                return;
            }

            // Google renderButton width must be between 200 and 400
            const buttonWidth = Math.max(200, Math.min(Math.floor(availableWidth), 360));

            try {
                containerRef.current.innerHTML = "";
                window.google.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    width: buttonWidth,
                    text: "continue_with",
                    shape: "rectangular",
                    logo_alignment: "left",
                });
                setReady(true);
            } catch (err) {
                console.warn("Google button render error:", err);
            }
        };

        loadGoogleScript()
            .then(() => {
                if (cancelled || !window.google?.accounts?.id) return;

                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: (response) => onCredential(response.credential),
                });

                // Immediate attempt
                renderBtn();

                // Animation retries
                requestAnimationFrame(() => {
                    if (!cancelled) renderBtn();
                });
                setTimeout(() => {
                    if (!cancelled) renderBtn();
                }, 200);
                setTimeout(() => {
                    if (!cancelled) renderBtn();
                }, 500);
            })
            .catch(() => setReady(false));

        let ro;
        if (containerRef.current && typeof ResizeObserver !== "undefined") {
            ro = new ResizeObserver(() => {
                if (!cancelled) {
                    renderBtn();
                }
            });
            ro.observe(containerRef.current);
        }

        const handleResize = () => {
            if (!cancelled) {
                renderBtn();
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelled = true;
            if (ro) ro.disconnect();
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!CLIENT_ID) {
        return null;
    }

    return (
        <div className={`w-full flex flex-col items-center justify-center ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
            {/* Real Google SDK Button Container */}
            <div
                ref={containerRef}
                className={`w-full flex justify-center overflow-hidden [&_iframe]:!max-w-full ${ready ? "block" : "hidden"}`}
            />

            {/* Fallback button when Google script is loading or rendering */}
            {!ready && (
                <button
                    type="button"
                    disabled={disabled}
                    className="w-full max-w-[360px] h-10 px-4 flex items-center justify-center gap-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                    </svg>
                    <span>Lanjutkan dengan Google</span>
                </button>
            )}
        </div>
    );
}
