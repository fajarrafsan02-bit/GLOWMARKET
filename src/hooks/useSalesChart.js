import { useEffect, useRef } from "react";

import { buildDashboardSalesChartConfig } from "../utils/chartConfig.js";

import useChartJsLoader from "./useChartJsLoader.js";

export default function useSalesChart({ labels = [], salesData = [], productData = [] }) {
    const canvasRef = useRef(null);

    const chartInstanceRef = useRef(null);

    const chartReady = useChartJsLoader();

    useEffect(() => {
        if (!chartReady || !canvasRef.current || !window.Chart || labels.length === 0) {
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

        chartInstanceRef.current = new window.Chart(
            ctx,
            buildDashboardSalesChartConfig({ labels, salesData, productData }),
        );

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();

                chartInstanceRef.current = null;
            }
        };
    }, [chartReady, labels, salesData, productData]);

    const totalSales = salesData.reduce((sum, value) => sum + (Number(value) || 0), 0);

    const totalUnits = productData.reduce((sum, value) => sum + (Number(value) || 0), 0);

    return {
        canvasRef,
        canRender: chartReady && labels.length > 0,
        totalSales,
        totalUnits,
    };
}
