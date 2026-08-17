import { motion as Motion } from "framer-motion";

import useSalesChart from "../../hooks/useSalesChart.js";

import SalesChartHeader from "./sales/SalesChartHeader.jsx";
import SalesChartBody from "./sales/SalesChartBody.jsx";
import SalesChartFooter from "./sales/SalesChartFooter.jsx";

export default function SalesChart({ labels = [], salesData = [], productData = [] }) {
    const { canvasRef, canRender, totalSales, totalUnits } = useSalesChart({
        labels,
        salesData,
        productData,
    });

    return (
        <Motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
        >
            <SalesChartHeader totalSales={totalSales} totalUnits={totalUnits} />

            <SalesChartBody canvasRef={canvasRef} canRender={canRender} />

            <SalesChartFooter />
        </Motion.section>
    );
}
