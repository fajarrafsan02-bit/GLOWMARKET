import { useEffect, useState } from "react";

export default function useChartJsLoader(scriptId = "chartjs-cdn-script") {
    const [chartReady, setChartReady] = useState(
        () => typeof window !== "undefined" && !!window.Chart,
    );

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (window.Chart) {
            return;
        }

        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            const handleLoad = () => setChartReady(true);

            existingScript.addEventListener("load", handleLoad, { once: true });

            return () => {
                existingScript.removeEventListener("load", handleLoad);
            };
        }

        const script = document.createElement("script");

        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";
        script.async = true;

        script.onload = () => setChartReady(true);

        script.onerror = () => console.error("[SalesChart] Gagal memuat Chart.js");

        document.body.appendChild(script);
    }, [scriptId]);

    return chartReady;
}
