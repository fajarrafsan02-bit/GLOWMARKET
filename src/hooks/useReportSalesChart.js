import { useEffect, useRef, useState } from "react";

import { buildSalesChartConfig } from "../utils/chartConfig.js";

export default function useReportSalesChart({ monthlyData, externalChartReady }) {
    const canvasRef = useRef(null);
    const chartInstanceRef = useRef(null);

    const [localChartReady, setLocalChartReady] = useState(
        () => typeof window !== "undefined" && !!window.Chart,
    );

    const isChartReady =
        externalChartReady || localChartReady || (typeof window !== "undefined" && !!window.Chart);

    /* ============================================================
       LOAD CHART.JS
    ============================================================ */

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if (window.Chart) {
            return;
        }

        const scriptId = "admin-chartjs";

        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            const handleLoad = () => setLocalChartReady(true);

            existingScript.addEventListener("load", handleLoad, { once: true });

            return () => {
                existingScript.removeEventListener("load", handleLoad);
            };
        }

        const script = document.createElement("script");

        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js";
        script.async = true;

        script.onload = () => setLocalChartReady(true);

        script.onerror = () => console.error("[ReportSalesChart] Gagal memuat Chart.js");

        document.body.appendChild(script);
    }, []);

    /* ============================================================
       CREATE / UPDATE CHART
    ============================================================ */

    useEffect(() => {
        if (!isChartReady || !canvasRef.current || !window.Chart) {
            return;
        }

        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) {
            return;
        }

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }

        chartInstanceRef.current = new window.Chart(ctx, buildSalesChartConfig(monthlyData));

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();

                chartInstanceRef.current = null;
            }
        };
    }, [isChartReady, monthlyData]);

    return { canvasRef, isChartReady };
}
