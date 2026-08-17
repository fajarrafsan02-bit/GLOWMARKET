import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatPrice } from "./format.js";

/* ================================================================
   STATUS
================================================================ */

export const getStatusConfig = (status) => {
    const value = String(status || "").toUpperCase();

    if (["PAID", "SETTLED"].includes(value)) {
        return {
            label: "Berhasil",
            className:
                "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
            dot: "bg-emerald-500",
        };
    }

    if (["PENDING", "UNPAID"].includes(value)) {
        return {
            label: "Menunggu Pembayaran",
            className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
            dot: "bg-amber-500",
        };
    }

    if (["EXPIRED"].includes(value)) {
        return {
            label: "Kedaluwarsa",
            className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
            dot: "bg-gray-400",
        };
    }

    if (["FAILED", "CANCELLED", "CANCELED"].includes(value)) {
        return {
            label: "Gagal",
            className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
            dot: "bg-red-500",
        };
    }

    return {
        label: status || "Tidak Diketahui",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        dot: "bg-gray-400",
    };
};

export const isPaidStatus = (status) =>
    ["PAID", "SETTLED"].includes(String(status || "").toUpperCase());

/* ================================================================
   INVOICE HTML
================================================================ */

const buildInvoiceHtml = (payment, customerName, customerEmail) => {
    const status = String(payment.status || "").toUpperCase();

    const isPaid = isPaidStatus(status);

    const statusColor = isPaid ? "#059669" : status === "PENDING" ? "#d97706" : "#6b7280";

    const invoiceId = payment.externalId || payment.invoiceId || payment.id || "N/A";

    const createdDate = payment.createdAt
        ? new Date(payment.createdAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "-";

    const paidDate = payment.paidAt
        ? new Date(payment.paidAt).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : null;

    return `
        <div
            style="
                width: 794px;
                box-sizing: border-box;
                padding: 48px;
                background: #ffffff;
                color: #111827;
                font-family: Arial, Helvetica, sans-serif;
            "
        >
            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:flex-start;
                    padding-bottom:24px;
                    border-bottom:2px solid #d97706;
                "
            >
                <div>
                    <div
                        style="
                            font-size:30px;
                            font-weight:700;
                            color:#b45309;
                            letter-spacing:-0.5px;
                        "
                    >
                        FAJAR GOLD
                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-size:11px;
                            line-height:1.6;
                            color:#6b7280;
                        "
                    >
                        Toko Perhiasan & Emas<br />
                        Emas dan perhiasan berkualitas
                    </div>
                </div>

                <div style="text-align:right;">
                    <div
                        style="
                            font-size:26px;
                            font-weight:700;
                            color:#111827;
                        "
                    >
                        INVOICE
                    </div>

                    <div
                        style="
                            margin-top:8px;
                            display:inline-block;
                            padding:7px 14px;
                            border-radius:999px;
                            background:${statusColor};
                            color:#ffffff;
                            font-size:10px;
                            font-weight:700;
                        "
                    >
                        ${payment.status || "PENDING"}
                    </div>
                </div>
            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:20px;
                    margin-top:28px;
                "
            >
                <div
                    style="
                        padding:18px;
                        background:#f8fafc;
                        border-radius:8px;
                    "
                >
                    <div
                        style="
                            font-size:10px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            font-weight:700;
                            color:#64748b;
                            margin-bottom:12px;
                        "
                    >
                        Detail Invoice
                    </div>

                    <div style="font-size:11px; line-height:2;">
                        <div>
                            <span style="color:#64748b;">
                                Invoice ID
                            </span>
                            <strong style="float:right;">
                                ${invoiceId}
                            </strong>
                        </div>

                        <div>
                            <span style="color:#64748b;">
                                Dibuat
                            </span>
                            <strong style="float:right;">
                                ${createdDate}
                            </strong>
                        </div>

                        ${
                            paidDate
                                ? `
                            <div>
                                <span style="color:#64748b;">
                                    Dibayar
                                </span>
                                <strong
                                    style="
                                        float:right;
                                        color:#059669;
                                    "
                                >
                                    ${paidDate}
                                </strong>
                            </div>
                        `
                                : ""
                        }
                    </div>
                </div>

                <div
                    style="
                        padding:18px;
                        background:#f8fafc;
                        border-radius:8px;
                    "
                >
                    <div
                        style="
                            font-size:10px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            font-weight:700;
                            color:#64748b;
                            margin-bottom:12px;
                        "
                    >
                        Pelanggan
                    </div>

                    <div
                        style="
                            font-size:11px;
                            line-height:1.8;
                        "
                    >
                        <strong>
                            ${payment.customerName || customerName || "-"}
                        </strong>
                        <br />

                        <span style="color:#64748b;">
                            ${payment.customerEmail || customerEmail || "-"}
                        </span>
                    </div>
                </div>
            </div>

            ${
                payment.alamat
                    ? `
                <div
                    style="
                        margin-top:20px;
                        padding:18px;
                        background:#fffbeb;
                        border-left:4px solid #d97706;
                        border-radius:6px;
                    "
                >
                    <div
                        style="
                            font-size:10px;
                            text-transform:uppercase;
                            letter-spacing:1px;
                            font-weight:700;
                            color:#92400e;
                            margin-bottom:8px;
                        "
                    >
                        Alamat Pengiriman
                    </div>

                    <div
                        style="
                            font-size:11px;
                            line-height:1.7;
                            color:#78350f;
                        "
                    >
                        ${payment.alamat.alamatLengkap || "-"}<br />
                        ${payment.alamat.kota || ""},
                        ${payment.alamat.provinsi || ""}
                        ${payment.alamat.kodePos || ""}
                    </div>
                </div>
            `
                    : ""
            }

            <div
                style="
                    margin-top:30px;
                    padding:22px;
                    border:1px solid #e5e7eb;
                    border-radius:8px;
                "
            >
                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    "
                >
                    <span
                        style="
                            font-size:11px;
                            color:#64748b;
                            font-weight:600;
                            text-transform:uppercase;
                            letter-spacing:.7px;
                        "
                    >
                        Total Pembayaran
                    </span>

                    <strong
                        style="
                            font-size:24px;
                            color:#b45309;
                        "
                    >
                        ${formatPrice(payment.amount)}
                    </strong>
                </div>

                <div
                    style="
                        margin-top:6px;
                        text-align:right;
                        font-size:10px;
                        color:${isPaid ? "#059669" : "#64748b"};
                    "
                >
                    ${isPaid ? "Pembayaran berhasil" : "Status pembayaran"}
                </div>
            </div>

            <div
                style="
                    margin-top:35px;
                    padding-top:20px;
                    border-top:1px solid #e5e7eb;
                    text-align:center;
                "
            >
                <div
                    style="
                        font-size:11px;
                        font-weight:600;
                        color:#475569;
                    "
                >
                    Terima kasih telah berbelanja di GlowMarket.
                </div>

                <div
                    style="
                        margin-top:6px;
                        font-size:9px;
                        color:#94a3b8;
                    "
                >
                    Invoice ini dibuat secara otomatis oleh sistem GlowMarket.
                </div>
            </div>
        </div>
    `;
};

/* ================================================================
   DOWNLOAD PDF
================================================================ */

export const downloadInvoice = async (payment, customerName, customerEmail, notify) => {
    try {
        notify("Membuat invoice PDF...", "success", 0);

        const container = document.createElement("div");

        container.style.position = "absolute";
        container.style.left = "-99999px";
        container.style.top = "0";
        container.style.width = "794px";
        container.style.backgroundColor = "#ffffff";

        document.body.appendChild(container);

        container.innerHTML = buildInvoiceHtml(payment, customerName, customerEmail);

        await new Promise((resolve) => setTimeout(resolve, 250));

        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 794,
        });

        document.body.removeChild(container);

        const imageData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imageWidth = pageWidth;
        const imageHeight = (canvas.height * imageWidth) / canvas.width;

        /*
         * Handle long invoices so they don't
         * overflow a single A4 page.
         */
        let remainingHeight = imageHeight;
        let position = 0;

        pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");

        remainingHeight -= pageHeight;

        while (remainingHeight > 0) {
            position = remainingHeight - imageHeight;

            pdf.addPage();

            pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight, undefined, "FAST");

            remainingHeight -= pageHeight;
        }

        const invoiceId = payment.externalId || payment.invoiceId || payment.id || Date.now();

        pdf.setProperties({
            title: `Invoice GlowMarket ${invoiceId}`,
            subject: "Invoice Pembayaran",
            author: "GlowMarket",
            keywords: "invoice, payment, glowmarket",
            creator: "GlowMarket",
        });

        pdf.save(`Invoice_GlowMarket_${invoiceId}.pdf`);

        notify("Invoice berhasil diunduh.", "success", 2500);
    } catch (error) {
        console.error("[PaymentsSection] PDF Error:", error);

        notify("Gagal membuat invoice PDF.", "error", 3000);
    }
};
