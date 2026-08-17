export const DEFAULT_BULAN = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
];

export function formatCompactRupiah(value) {
    const number = Number(value) || 0;

    if (number >= 1_000_000_000) {
        return `Rp ${(number / 1_000_000_000).toFixed(number % 1_000_000_000 === 0 ? 0 : 1)} M`;
    }

    if (number >= 1_000_000) {
        return `Rp ${(number / 1_000_000).toFixed(number % 1_000_000 === 0 ? 0 : 1)} jt`;
    }

    if (number >= 1_000) {
        return `Rp ${(number / 1_000).toFixed(number % 1_000 === 0 ? 0 : 1)} rb`;
    }

    return `Rp ${number}`;
}

export function deriveChartData(monthlyData) {
    const labels =
        monthlyData.length > 0
            ? monthlyData.map((item) => item.month || item.bulan || "-")
            : DEFAULT_BULAN;

    const salesData =
        monthlyData.length > 0
            ? monthlyData.map((item) => Number(item.sales ?? item.totalPenjualan ?? 0))
            : Array(12).fill(0);

    const productData =
        monthlyData.length > 0
            ? monthlyData.map((item) => Number(item.products ?? item.totalProdukTerjual ?? 0))
            : Array(12).fill(0);

    return { labels, salesData, productData };
}

export function buildSalesChartConfig(monthlyData) {
    const isDark = document.documentElement.classList.contains("dark");

    const textColor = isDark ? "#9ca3af" : "#6b7280";

    const gridColor = isDark ? "rgba(75, 85, 99, 0.18)" : "rgba(156, 163, 175, 0.14)";

    const { labels, salesData, productData } = deriveChartData(monthlyData);

    return {
        type: "bar",

        data: {
            labels,

            datasets: [
                {
                    type: "bar",
                    label: "Penjualan",
                    data: salesData,

                    backgroundColor: isDark
                        ? "rgba(245, 158, 11, 0.72)"
                        : "rgba(245, 158, 11, 0.82)",

                    borderColor: "#f59e0b",

                    borderWidth: 0,

                    borderRadius: 5,

                    borderSkipped: false,

                    maxBarThickness: 32,

                    categoryPercentage: 0.72,

                    barPercentage: 0.78,

                    yAxisID: "sales",
                },

                {
                    type: "line",
                    label: "Produk Terjual",
                    data: productData,

                    borderColor: "#10b981",

                    backgroundColor: "rgba(16, 185, 129, 0.08)",

                    borderWidth: 2.5,

                    pointBackgroundColor: "#10b981",

                    pointBorderColor: isDark ? "#111827" : "#ffffff",

                    pointBorderWidth: 2,

                    pointRadius: 3.5,

                    pointHoverRadius: 5,

                    tension: 0.35,

                    fill: false,

                    yAxisID: "products",
                },
            ],
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false,
            },

            layout: {
                padding: {
                    top: 12,
                    right: 12,
                    bottom: 4,
                    left: 4,
                },
            },

            plugins: {
                legend: {
                    display: true,

                    position: "top",

                    align: "end",

                    maxHeight: 40,

                    labels: {
                        color: textColor,

                        usePointStyle: true,

                        pointStyle: "circle",

                        boxWidth: 8,

                        boxHeight: 8,

                        padding: 18,

                        font: {
                            size: 12,
                            weight: "500",
                        },
                    },
                },

                tooltip: {
                    backgroundColor: "#111827",

                    titleColor: "#ffffff",

                    bodyColor: "#e5e7eb",

                    titleFont: {
                        size: 12,
                        weight: "600",
                    },

                    bodyFont: {
                        size: 11,
                    },

                    padding: 11,

                    cornerRadius: 8,

                    displayColors: true,

                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y;

                            if (context.dataset.yAxisID === "sales") {
                                return ` Penjualan: ${new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(value)}`;
                            }

                            return ` Produk Terjual: ${value} unit`;
                        },
                    },
                },
            },

            scales: {
                x: {
                    offset: true,

                    grid: {
                        display: false,
                    },

                    border: {
                        display: false,
                    },

                    ticks: {
                        color: textColor,

                        padding: 8,

                        font: {
                            size: 11,
                            weight: "500",
                        },

                        maxRotation: 0,

                        minRotation: 0,

                        autoSkip: false,
                    },
                },

                sales: {
                    type: "linear",

                    position: "left",

                    beginAtZero: true,

                    border: {
                        display: false,
                    },

                    grid: {
                        color: gridColor,

                        drawTicks: false,
                    },

                    afterFit: (scale) => {
                        scale.width = 66;
                    },

                    ticks: {
                        color: textColor,

                        padding: 8,

                        maxTicksLimit: 6,

                        font: {
                            size: 11,
                            weight: "500",
                        },

                        callback: (value) => formatCompactRupiah(value),
                    },
                },

                products: {
                    type: "linear",

                    position: "right",

                    beginAtZero: true,

                    border: {
                        display: false,
                    },

                    grid: {
                        drawOnChartArea: false,

                        drawTicks: false,
                    },

                    afterFit: (scale) => {
                        scale.width = 52;
                    },

                    ticks: {
                        color: textColor,

                        padding: 8,

                        maxTicksLimit: 6,

                        precision: 0,

                        font: {
                            size: 11,
                            weight: "500",
                        },

                        callback: (value) => `${value}`,
                    },
                },
            },

            animation: {
                duration: 650,

                easing: "easeOutQuart",
            },
        },
    };
}

export function buildDashboardSalesChartConfig({ labels, salesData, productData }) {
    const isDark = document.documentElement.classList.contains("dark");

    const textColor = isDark ? "#9ca3af" : "#6b7280";

    const gridColor = isDark ? "rgba(75,85,99,0.18)" : "rgba(156,163,175,0.16)";

    return {
        type: "bar",

        data: {
            labels,

            datasets: [
                {
                    label: "Penjualan",
                    data: salesData,

                    backgroundColor: isDark
                        ? "rgba(245,158,11,0.75)"
                        : "rgba(245,158,11,0.85)",

                    borderColor: "#f59e0b",

                    borderWidth: 1,

                    borderRadius: 5,

                    borderSkipped: false,

                    yAxisID: "sales",
                },

                {
                    label: "Produk Terjual",
                    data: productData,

                    backgroundColor: isDark
                        ? "rgba(59,130,246,0.65)"
                        : "rgba(59,130,246,0.75)",

                    borderColor: "#3b82f6",

                    borderWidth: 1,

                    borderRadius: 5,

                    borderSkipped: false,

                    yAxisID: "units",
                },
            ],
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false,
            },

            plugins: {
                legend: {
                    position: "top",
                    align: "end",

                    labels: {
                        color: textColor,

                        boxWidth: 8,
                        boxHeight: 8,

                        usePointStyle: true,

                        pointStyle: "circle",

                        padding: 18,

                        font: {
                            size: 11,
                            weight: "500",
                        },
                    },
                },

                tooltip: {
                    backgroundColor: "#111827",

                    titleColor: "#ffffff",

                    bodyColor: "#e5e7eb",

                    borderColor: "rgba(255,255,255,0.08)",

                    borderWidth: 1,

                    padding: 10,

                    cornerRadius: 7,

                    displayColors: true,

                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y;

                            if (context.dataset.yAxisID === "sales") {
                                return ` Penjualan: ${new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(value)}`;
                            }

                            return ` Produk: ${new Intl.NumberFormat("id-ID").format(
                                value,
                            )} unit`;
                        },
                    },
                },
            },

            scales: {
                x: {
                    stacked: false,

                    grid: {
                        display: false,
                    },

                    border: {
                        display: false,
                    },

                    ticks: {
                        color: textColor,

                        font: {
                            size: 10,
                        },

                        maxRotation: 0,

                        autoSkip: true,
                    },
                },

                sales: {
                    type: "linear",
                    position: "left",

                    beginAtZero: true,

                    grid: {
                        color: gridColor,
                    },

                    border: {
                        display: false,
                    },

                    ticks: {
                        color: textColor,

                        font: {
                            size: 10,
                        },

                        callback: (value) =>
                            new Intl.NumberFormat("id-ID", {
                                notation: "compact",

                                style: "currency",

                                currency: "IDR",

                                maximumFractionDigits: 1,
                            }).format(value),
                    },
                },

                units: {
                    type: "linear",
                    position: "right",

                    beginAtZero: true,

                    grid: {
                        drawOnChartArea: false,
                    },

                    border: {
                        display: false,
                    },

                    ticks: {
                        color: textColor,

                        font: {
                            size: 10,
                        },

                        precision: 0,

                        callback: (value) => `${value}`,
                    },
                },
            },

            animation: {
                duration: 650,
                easing: "easeOutQuart",
            },
        },
    };
}
