import { useState, useEffect, useRef } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { User, Mail, Phone, MapPin, Heart, Package, Settings, LogOut, Edit2, CreditCard, Download, Trash2, ShoppingCart, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/Axios.jsx";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function UserProfile() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("user_token"));
    const [showAuth, setShowAuth] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [userName, setUserName] = useState(localStorage.getItem("user_name") || "Member Fajar Gold");
    const [userEmail, setUserEmail] = useState(localStorage.getItem("user_email") || "email@contoh.com");
    const [userPhone, setUserPhone] = useState(localStorage.getItem("user_phone") || "");
    const [notice, setNotice] = useState("");
    const navigate = useNavigate();

    const [addrProvince, setAddrProvince] = useState("");
    const [addrCity, setAddrCity] = useState("");
    const [addrDistrict, setAddrDistrict] = useState("");
    const [addrVillage, setAddrVillage] = useState("");
    const [addrPostal, setAddrPostal] = useState("");
    const [addrLine, setAddrLine] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState("");
    const [selectedDefaultId, setSelectedDefaultId] = useState(null);

    const [editingProfile, setEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userName || "");
    const [editEmail, setEditEmail] = useState(userEmail || "");
    const [editPhone, setEditPhone] = useState(userPhone || "");
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [noticeType, setNoticeType] = useState("success");
    const invoiceRef = useRef(null);

    const formatPrice = (val) => {
        if (typeof val !== "number") return "Rp -";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(val);
    };

    const loadWishlist = async () => {
        const token = localStorage.getItem("user_token");
        if (!token) return;
        try {
            setWishlistLoading(true);
            let res;
            try {
                res = await api.get("/wishlist", { headers: { Authorization: `Bearer ${token}` } });
            } catch {
                res = await api.get("/api/wishlist", { headers: { Authorization: `Bearer ${token}` } });
            }
            const arr = Array.isArray(res.data?.data) ? res.data.data : [];
            setWishlistItems(arr);
        } catch (err) {
            console.error("Gagal memuat wishlist", err);
        } finally {
            setWishlistLoading(false);
        }
    };

    const removeFromWishlist = async (wishlistId) => {
        try {
            const token = localStorage.getItem("user_token");
            try {
                await api.delete(`/wishlist/${wishlistId}`, { headers: { Authorization: `Bearer ${token}` } });
            } catch {
                await api.delete(`/api/wishlist/${wishlistId}`, { headers: { Authorization: `Bearer ${token}` } });
            }
            setNotice("Item dihapus dari wishlist");
            setNoticeType("success");
            window.dispatchEvent(new Event("wishlist:update"));
            setTimeout(() => setNotice(""), 3000);
            loadWishlist();
        } catch {
            setNotice("Gagal menghapus item");
            setNoticeType("error");
            setTimeout(() => setNotice(""), 4000);
        }
    };

    const addToCart = async (produk) => {
        try {
            const token = localStorage.getItem("user_token");
            try {
                await api.post("/keranjang", { produkId: produk.id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
            } catch {
                await api.post("/api/keranjang", { produkId: produk.id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
            }
            setNotice(`${produk.nama} ditambahkan ke keranjang`);
            setNoticeType("success");
            window.dispatchEvent(new Event("cart:update"));
            setTimeout(() => setNotice(""), 3000);
        } catch {
            setNotice("Gagal tambah ke keranjang");
            setNoticeType("error");
            setTimeout(() => setNotice(""), 4000);
        }
    };

    useEffect(() => {
        if (activeTab === "wishlist") {
            loadWishlist();
        }
    }, [activeTab]);

    // Function to download invoice as PDF
    const downloadInvoice = async (payment) => {
        try {
            setNotice("Membuat invoice PDF...");
            setNoticeType("success");

            // Create temporary container for invoice
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '794px'; // A4 width in pixels at 96 DPI
            container.style.backgroundColor = 'white';
            container.style.padding = '0';
            document.body.appendChild(container);

            // Create invoice HTML with better design
            const invoiceHTML = `
                <div style="font-family: 'Arial', 'Helvetica', sans-serif; color: #1a202c; padding: 40px; background: white;">
                    <!-- Header with Company Info -->
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 25px; border-bottom: 4px solid #d97706;">
                        <div style="flex: 1;">
                            <h1 style="font-size: 38px; color: #d97706; margin: 0 0 8px 0; font-weight: bold; letter-spacing: -0.5px;">FAJAR GOLD</h1>
                            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">
                                Toko Emas Terpercaya<br/>
                                Emas Murni Bersertifikat<br/>
                                Jl. Contoh No. 123, Jakarta<br/>
                                Telp: (021) 1234-5678
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="font-size: 32px; color: #1e293b; margin: 0 0 10px 0; font-weight: bold;">INVOICE</h2>
                            <div style="display: inline-block; padding: 10px 24px; background: ${payment.status === 'PAID' || payment.status === 'SETTLED' ? '#10b981' : payment.status === 'PENDING' ? '#f59e0b' : '#ef4444'}; color: white; border-radius: 25px; font-weight: bold; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                ${payment.status || 'PENDING'}
                            </div>
                        </div>
                    </div>

                    <!-- Invoice Details Section -->
                    <div style="display: flex; justify-content: space-between; margin-bottom: 35px;">
                        <div style="flex: 1; padding: 20px; background: #f8fafc; border-radius: 10px; margin-right: 15px;">
                            <h3 style="font-size: 14px; color: #64748b; margin: 0 0 12px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Detail Invoice</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Invoice ID</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${payment.externalId || payment.invoiceId || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Tanggal Dibuat</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${new Date(payment.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                                ${payment.paidAt ? `
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Tanggal Dibayar</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #10b981; font-weight: 600; text-align: right;">${new Date(payment.paidAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                                ` : ''}
                                ${payment.expiredAt ? `
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Kedaluwarsa</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #ef4444; font-weight: 600; text-align: right;">${new Date(payment.expiredAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>

                        <div style="flex: 1; padding: 20px; background: #f8fafc; border-radius: 10px; margin-left: 15px;">
                            <h3 style="font-size: 14px; color: #64748b; margin: 0 0 12px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Informasi Pelanggan</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Nama</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${payment.customerName || userName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 500;">Email</td>
                                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${payment.customerEmail || userEmail}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                    ${payment.alamat ? `
                    <!-- Shipping Address -->
                    <div style="margin-bottom: 35px; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 10px; border-left: 5px solid #d97706;">
                        <h3 style="font-size: 14px; color: #78350f; margin: 0 0 12px 0; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 20px; height: 20px; background: #d97706; border-radius: 50%; margin-right: 8px;"></span>
                            Alamat Pengiriman
                        </h3>
                        <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.6; font-weight: 500;">
                            ${payment.alamat.alamatLengkap || 'N/A'}<br/>
                            ${payment.alamat.kota || ''}, ${payment.alamat.provinsi || ''} ${payment.alamat.kodePos || ''}
                        </p>
                    </div>
                    ` : ''}

                    <!-- Amount Summary -->
                    <div style="margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #d97706; box-shadow: 0 4px 6px rgba(217, 119, 6, 0.1);">
                        <div style="text-align: right;">
                            <p style="font-size: 15px; color: #78350f; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Pembayaran</p>
                            <h2 style="font-size: 42px; color: #d97706; margin: 0; font-weight: bold; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.05);">Rp ${new Intl.NumberFormat('id-ID').format(payment.amount || 0)}</h2>
                            <p style="font-size: 12px; color: #92400e; margin: 8px 0 0 0; font-weight: 500;">(${payment.status === 'PAID' || payment.status === 'SETTLED' ? 'Sudah Dibayar' : 'Menunggu Pembayaran'})</p>
                        </div>
                    </div>

                    <!-- Payment Method Info (if available) -->
                    ${payment.invoiceUrl ? `
                    <div style="margin-bottom: 30px; padding: 15px; background: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1;">
                        <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                            <strong style="color: #1e293b;">Link Invoice Online:</strong><br/>
                            <span style="color: #0891b2; word-break: break-all;">${payment.invoiceUrl}</span>
                        </p>
                    </div>
                    ` : ''}

                    <!-- Notes/Terms -->
                    <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0891b2;">
                        <h3 style="font-size: 13px; color: #0e7490; margin: 0 0 10px 0; font-weight: 600;">Catatan Penting:</h3>
                        <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: #475569; line-height: 1.8;">
                            <li>Invoice ini adalah bukti pembayaran yang sah</li>
                            <li>Simpan invoice ini untuk keperluan administrasi</li>
                            <li>Untuk pertanyaan, hubungi customer service kami</li>
                            <li>Barang yang sudah dibeli tidak dapat dikembalikan</li>
                        </ul>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 50px; padding-top: 25px; border-top: 3px solid #e2e8f0; text-align: center;">
                        <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0; font-weight: 600;">Terima kasih atas kepercayaan Anda berbelanja di Fajar Gold</p>
                        <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.6;">
                            Dokumen ini digenerate secara otomatis pada ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}<br/>
                            <strong>Fajar Gold</strong> - Emas Murni Bersertifikat Sejak 2010
                        </p>
                    </div>
                </div>
            `;

            container.innerHTML = invoiceHTML;

            // Wait for rendering
            await new Promise(resolve => setTimeout(resolve, 500));

            // Convert to canvas with higher quality
            const canvas = await html2canvas(container, {
                scale: 3, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: container.scrollHeight
            });

            // Remove temporary container
            document.body.removeChild(container);

            // Create PDF
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image to PDF
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

            // Add metadata
            pdf.setProperties({
                title: `Invoice ${payment.externalId || payment.invoiceId || 'Fajar Gold'}`,
                subject: 'Invoice Pembayaran',
                author: 'Fajar Gold',
                keywords: 'invoice, payment, fajar gold',
                creator: 'Fajar Gold System'
            });

            // Download
            const fileName = `Invoice_FajarGold_${payment.externalId || payment.invoiceId || Date.now()}.pdf`;
            pdf.save(fileName);

            setNotice("Invoice berhasil diunduh!");
            setNoticeType("success");
            setTimeout(() => setNotice(""), 2500);
        } catch (err) {
            console.error('[UserProfile] Error generating PDF:', err);
            setNotice("Gagal membuat invoice PDF");
            setNoticeType("error");
            setTimeout(() => setNotice(""), 3000);
        }
    };

    // Variants animasi lebih ringan
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
    };

    useEffect(() => {
        const onStorage = () => {
            const token = !!localStorage.getItem("user_token");
            setIsLoggedIn(token);
            if (token) setShowAuth(false);
            setUserName(localStorage.getItem("user_name") || "Member Fajar Gold");
            setUserEmail(localStorage.getItem("user_email") || "email@contoh.com");
            setUserPhone(localStorage.getItem("user_phone") || "");
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (activeTab !== "payments" || !token) return;
        const loadPayments = async () => {
            try {
                setPaymentsLoading(true);
                setPaymentsError("");
                let res;
                try {
                    res = await api.get("/api/payments/user/history", { headers: { Authorization: `Bearer ${token}` } });
                } catch {
                    res = await api.get("/payments/user/history", { headers: { Authorization: `Bearer ${token}` } });
                }
                const arr = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                setPayments(arr);
            } catch (err) {
                setPaymentsError(err.message || "Gagal memuat riwayat pembayaran");
            } finally {
                setPaymentsLoading(false);
            }
        };
        loadPayments();
    }, [activeTab]);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const res = await axios.get("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
                setProvinces(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Error loading provinces:", error);
            }
        };
        loadProvinces();

        const token = localStorage.getItem("user_token");
        const loadAddress = async () => {
            if (!token) return;
            try {
                const res = await api.get("/api/alamat", { headers: { Authorization: `Bearer ${token}` } });
                const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                setAddresses(list);
                const a = Array.isArray(list) ? (list.find(x => x.isDefault || x.is_default) || list[0]) : (res.data?.data || res.data || null);
                if (a) {
                    setSelectedDefaultId(a.id || null);
                    const pName = a.provinsi || a.province || "";
                    const cName = a.kota || a.kabupaten || a.city || "";
                    const dName = a.kecamatan || a.district || "";
                    const vName = a.kelurahan || a.village || "";
                    const p = provinces.find(pr => (pr.name || "").toLowerCase() === (pName || "").toLowerCase());
                    const provinceId = p?.id || "";
                    setAddrProvince(provinceId);
                    if (provinceId) {
                        try {
                            const cRes = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
                            const cArr = Array.isArray(cRes.data) ? cRes.data : [];
                            setCities(cArr);
                            const c = cArr.find(ci => (ci.name || "").toLowerCase() === (cName || "").toLowerCase());
                            const cityId = c?.id || "";
                            setAddrCity(cityId);
                            if (cityId) {
                                const dRes = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${cityId}.json`);
                                const dArr = Array.isArray(dRes.data) ? dRes.data : [];
                                setDistricts(dArr);
                                const d = dArr.find(di => (di.name || "").toLowerCase() === (dName || "").toLowerCase());
                                const districtId = d?.id || "";
                                setAddrDistrict(districtId);
                                if (districtId) {
                                    const vRes = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
                                    const vArr = Array.isArray(vRes.data) ? vRes.data : [];
                                    setVillages(vArr);
                                    const v = vArr.find(vi => (vi.name || "").toLowerCase() === (vName || "").toLowerCase());
                                    const villageId = v?.id || "";
                                    setAddrVillage(villageId);
                                }
                            }
                        } catch (error) {
                            console.error("Error loading address details:", error);
                        }
                    }
                    setAddrPostal(a.kodePos || a.postalCode || "");
                    setAddrLine(a.alamat || a.alamatLengkap || a.shippingAddress || "");
                }
            } catch (error) {
                console.error("Error loading address:", error);
            }
        };
        loadAddress();
    }, []);

    const onProvinceChange = async (id) => {
        setAddrProvince(id);
        setAddrCity(""); setAddrDistrict(""); setAddrVillage("");
        setCities([]); setDistricts([]); setVillages([]);
        if (!id) return;
        try {
            const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`);
            setCities(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading cities:", error);
        }
    };

    const onCityChange = async (id) => {
        setAddrCity(id);
        setAddrDistrict(""); setAddrVillage("");
        setDistricts([]); setVillages([]);
        if (!id) return;
        try {
            const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`);
            setDistricts(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading districts:", error);
        }
    };

    const onDistrictChange = async (id) => {
        setAddrDistrict(id);
        setAddrVillage("");
        setVillages([]);
        if (!id) return;
        try {
            const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${id}.json`);
            setVillages(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading villages:", error);
        }
    };

    const onVillageChange = async (id) => {
        setAddrVillage(id);
        if (!id) return;
        try {
            const village = villages.find(v => String(v.id) === String(id));
            const dName = districts.find(d => String(d.id) === String(addrDistrict))?.name || addrDistrict;
            const cName = cities.find(c => String(c.id) === String(addrCity))?.name || addrCity;
            const pName = provinces.find(p => String(p.id) === String(addrProvince))?.name || addrProvince;
            const q = `${village?.name || id} ${dName} ${cName} ${pName}`;
            const res = await axios.get(`https://kodepos.vercel.app/search?q=${encodeURIComponent(q)}`);
            const list = res.data?.data || [];
            if (Array.isArray(list) && list.length) {
                setAddrPostal(list[0].postalcode || list[0].kodepos || "");
            }
        } catch (error) {
            console.error("Error fetching postal code:", error);
        }
    };

    const saveAddress = async () => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            setShowAuth(true);
            return;
        }
        try {
            const pName = provinces.find(p => String(p.id) === String(addrProvince))?.name || "";
            const cName = cities.find(c => String(c.id) === String(addrCity))?.name || "";
            const dName = districts.find(d => String(d.id) === String(addrDistrict))?.name || "";
            const vName = villages.find(v => String(v.id) === String(addrVillage))?.name || "";

            if (!pName || !cName || !dName || !vName || !addrLine) {
                setNotice("Lengkapi semua field alamat");
                setNoticeType("error");
                setTimeout(() => setNotice(""), 3000);
                return;
            }

            const payload = {
                namaLengkap: userName,
                nomorTelepon: localStorage.getItem("user_phone") || "",
                alamatLengkap: `${addrLine}, ${vName}, ${dName}, ${cName}, ${pName}${addrPostal ? " " + addrPostal : ""}`,
                provinsi: pName,
                kota: cName,
                kecamatan: dName,
                kelurahan: vName,
                kodePos: addrPostal,
                isDefault: true,
                catatan: ""
            };

            const normalize = (s) => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
            const fullNew = normalize(payload.alamatLengkap);
            const match = Array.isArray(addresses) ? addresses.find(a => normalize(a.alamatLengkap || a.alamat || a.shippingAddress) === fullNew) : null;

            if (match?.id) {
                try {
                    await api.put(`/api/alamat/${match.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                } catch {
                    await api.put("/api/alamat", { id: match.id, ...payload }, { headers: { Authorization: `Bearer ${token}` } });
                }
                setNotice("Alamat sudah sama • diperbarui sebagai default");
                setNoticeType("success");
            } else {
                try {
                    await api.post("/api/alamat", payload, { headers: { Authorization: `Bearer ${token}` } });
                    setNotice("Alamat baru ditambahkan");
                    setNoticeType("success");
                } catch {
                    await api.put("/api/alamat", payload, { headers: { Authorization: `Bearer ${token}` } });
                    setNotice("Alamat berhasil disimpan");
                    setNoticeType("success");
                }
            }
            try {
                const res = await api.get("/api/alamat", { headers: { Authorization: `Bearer ${token}` } });
                const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                setAddresses(list);
            } catch (error) {
                console.error("Error reloading addresses:", error);
            }
            setTimeout(() => setNotice(""), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || "Gagal menyimpan alamat";
            setNotice(msg);
            setNoticeType("error");
            setTimeout(() => setNotice(""), 4000);
        }
    };

    const setPrimaryAddress = async (id) => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            setShowAuth(true);
            return;
        }
        try {
            setSelectedDefaultId(id);
            const target = addresses.find(a => String(a.id) === String(id));
            if (!target) return;
            const payload = {
                ...(target || {}),
                isDefault: true,
                is_default: true
            };
            let ok = false;
            try {
                await api.put(`/api/alamat/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
                ok = true;
            } catch {
                try {
                    await api.post(`/api/alamat/default`, { id }, { headers: { Authorization: `Bearer ${token}` } });
                    ok = true;
                } catch {
                    await api.put(`/api/alamat`, { id, isDefault: true }, { headers: { Authorization: `Bearer ${token}` } });
                    ok = true;
                }
            }
            if (ok) {
                const res = await api.get("/api/alamat", { headers: { Authorization: `Bearer ${token}` } });
                const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
                setAddresses(list);
                const a = Array.isArray(list) ? (list.find(x => x.isDefault || x.is_default) || list[0]) : null;
                if (a) {
                    setAddrProvince(a.provinsi || a.province || "");
                    setAddrCity(a.kota || a.kabupaten || a.city || "");
                    setAddrDistrict(a.kecamatan || a.district || "");
                    setAddrVillage(a.kelurahan || a.village || "");
                    setAddrPostal(a.kodePos || a.postalCode || "");
                    setAddrLine(a.alamat || a.alamatLengkap || a.shippingAddress || "");
                }
                setNotice("Alamat utama berhasil diatur");
                setNoticeType("success");
                setTimeout(() => setNotice(""), 2500);
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal mengatur alamat utama";
            setNotice(msg);
            setNoticeType("error");
            setTimeout(() => setNotice(""), 3000);
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        const token = localStorage.getItem("user_token");
        try {
            await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            console.error("Error during logout:", error);
        }

        // Hanya hapus data user, jangan hapus data admin
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_phone");

        // Trigger storage event untuk UserPresenceProvider
        console.log("[UserProfile] User logged out, triggering presence cleanup");
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'user_token',
            oldValue: token,
            newValue: null,
            url: window.location.href
        }));

        setIsLoggedIn(false);
        setShowAuth(false);
        setNotice("Berhasil keluar");
        
        setTimeout(() => {
            setNotice("");
            setLoggingOut(false);
            navigate("/");
        }, 1500);
    };

    const tabs = [
        { id: "profile", label: "Profil Saya", icon: User },
        { id: "address", label: "Alamat", icon: MapPin },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "payments", label: "Riwayat Pembayaran", icon: CreditCard },
        { id: "settings", label: "Pengaturan", icon: Settings },
    ];

    useEffect(() => {
        const token = localStorage.getItem("user_token");
        if (!token) return;
        const loadUserProfile = async () => {
            try {
                let res;
                const candidates = ["/api/user/profile", "/user/profile", "/api/user", "/user"];
                for (const p of candidates) {
                    try {
                        res = await api.get(p, { headers: { Authorization: `Bearer ${token}` } });
                        if (res) break;
                    } catch (error) {
                        console.error(`Error loading profile from ${p}:`, error);
                    }
                }
                const u = res?.data?.data || res?.data || null;
                if (u) {
                    const n = u.namaLengkap || userName;
                    const e = u.email || userEmail;
                    const p = u.noHp || userPhone;
                    setUserName(n);
                    setUserEmail(e);
                    setUserPhone(p || "");
                    localStorage.setItem("user_name", n || "");
                    localStorage.setItem("user_email", e || "");
                    if (p) localStorage.setItem("user_phone", p);
                    setEditName(n || "");
                    setEditEmail(e || "");
                    setEditPhone(p || "");
                }
            } catch (error) {
                console.error("Error loading user profile:", error);
            }
        };
        loadUserProfile();
    }, []);

    const saveProfile = async () => {
        const token = localStorage.getItem("user_token");
        if (!token) {
            setShowAuth(true);
            return;
        }
        try {
            const payload = {
                namaLengkap: editName,
                noHp: editPhone
            };
            let ok = false;
            for (const p of ["/api/user/profile", "/user/profile", "/api/user", "/user"]) {
                if (ok) break;
                try {
                    await api.put(p, payload, { headers: { Authorization: `Bearer ${token}` } });
                    ok = true;
                } catch (error) {
                    console.error(`Error saving profile to ${p}:`, error);
                }
            }
            if (!ok) throw new Error("Endpoint profil tidak tersedia");

            setUserName(editName);
            setUserEmail(editEmail);
            setUserPhone(editPhone);
            localStorage.setItem("user_name", editName || "");
            localStorage.setItem("user_email", editEmail || "");
            if (editPhone) localStorage.setItem("user_phone", editPhone);
            setEditingProfile(false);
            setNotice("Profil berhasil diperbarui");
            setTimeout(() => setNotice(""), 2500);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Gagal memperbarui profil";
            setNotice(msg);
            setTimeout(() => setNotice(""), 3000);
        }
    };

    const getDisplayAddress = () => {
        const active = addresses.find(a => (a.isDefault || a.is_default) || String(a.id) === String(selectedDefaultId)) || addresses[0];
        if (active) {
            if (active.alamatLengkap) return active.alamatLengkap;

            const parts = [
                active.alamat || active.shippingAddress,
                active.kelurahan || active.village,
                active.kecamatan || active.district,
                active.kota || active.kabupaten || active.city,
                active.provinsi || active.province,
                active.kodePos || active.postalCode
            ];
            const constructed = parts.filter(p => p && String(p).trim() !== "").join(", ");
            if (constructed.length > 10) return constructed;

            return active.alamat || active.shippingAddress || addrLine;
        }
        return addrLine || "Belum diatur";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white dark:from-black dark:to-gray-950 overflow-x-hidden"
        >
            <Header setShowAuth={setShowAuth} />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-yellow-700 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
                        Akun Saya
                    </h1>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                        Kelola profil dan pesanan Anda
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {notice && (
                        <div className={`lg:col-span-4 mb-2 p-3 rounded-xl border ${noticeType === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                            {notice}
                        </div>
                    )}
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-900/98 rounded-2xl shadow-xl border border-amber-100 dark:border-yellow-800/40 overflow-hidden">
                            {/* Header Profil */}
                            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 dark:from-amber-600 dark:to-yellow-700 p-6 text-center text-white">
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white/40"
                                >
                                    {userName.charAt(0).toUpperCase()}
                                </motion.div>
                                <h3 className="mt-4 text-lg font-bold">{userName}</h3>
                                <p className="text-xs opacity-90 mt-1">{userEmail}</p>
                            </div>

                            {/* Edit Profil */}
                            <div className="p-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setEditingProfile(true)}
                                    className="w-full py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-600 dark:border-yellow-600 text-amber-600 dark:text-yellow-400 font-medium text-sm flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-gray-700 transition"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profil
                                </motion.button>
                            </div>

                            {/* Menu */}
                            <nav className="border-t border-amber-100 dark:border-yellow-800/40">
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="py-2"
                                >
                                    {tabs.map((tab) => (
                                        <motion.button
                                            key={tab.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 6 }}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-all ${activeTab === tab.id
                                                ? "bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-600 dark:to-yellow-700 text-white shadow"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-800/50 hover:text-amber-600 dark:hover:text-yellow-400"
                                                }`}
                                        >
                                            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-amber-600 dark:text-yellow-500"}`} />
                                            {tab.label}
                                        </motion.button>
                                    ))}

                                    <motion.button
                                        whileHover={{ x: 6 }}
                                        onClick={() => setConfirmLogout(true)}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Keluar
                                    </motion.button>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-gray-900/98 rounded-2xl shadow-xl p-6 border border-amber-100 dark:border-yellow-800/40">
                            {/* Profil Info */}
                            {activeTab === "profile" && !editingProfile && (
                                <div className="space-y-5">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                                        Informasi Profil
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-yellow-700/40">
                                            <User className="w-8 h-8 text-amber-600 dark:text-yellow-500" />
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Nama</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{userName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-yellow-700/40">
                                            <Mail className="w-8 h-8 text-amber-600 dark:text-yellow-500" />
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{userEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-yellow-700/40">
                                            <Phone className="w-8 h-8 text-amber-600 dark:text-yellow-500" />
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Telepon</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{userPhone || "Belum diisi"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-yellow-700/40 md:col-span-2">
                                            <MapPin className="w-8 h-8 text-amber-600 dark:text-yellow-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Alamat</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                                                    {getDisplayAddress()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {Array.isArray(addresses) && addresses.length > 1 && (
                                        <div className="mt-4 p-4 rounded-xl border border-amber-200 dark:border-yellow-700/40 bg-white dark:bg-gray-900/60">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Pilih Alamat Utama</p>
                                            <div className="space-y-3">
                                                {addresses.map((a) => {
                                                    const summary = a.alamatLengkap || a.alamat || a.shippingAddress ||
                                                        `${a.kelurahan || ""}, ${a.kecamatan || ""}, ${a.kota || a.kabupaten || ""}, ${a.provinsi || ""} ${a.kodePos || ""}`.replace(/,\s*,/g, ", ").trim();
                                                    const isDefault = (a.isDefault || a.is_default) || String(a.id) === String(selectedDefaultId);
                                                    return (
                                                        <label key={a.id} className="flex items-start gap-3 p-3 rounded-lg border hover:border-amber-400 dark:hover:border-yellow-500 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="primaryAddress"
                                                                checked={!!isDefault}
                                                                onChange={() => setPrimaryAddress(a.id)}
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{summary}</p>
                                                                {isDefault && <span className="text-xs text-green-600 dark:text-green-400">Alamat utama</span>}
                                                            </div>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Edit Profil */}
                            {activeTab === "profile" && editingProfile && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                                        Edit Profil
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nama Lengkap
                                            </label>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email (Tidak dapat diubah)
                                            </label>
                                            <input
                                                type="email"
                                                value={editEmail}
                                                disabled
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed text-sm"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Nomor Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                value={editPhone}
                                                onChange={(e) => setEditPhone(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-5 flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={saveProfile}
                                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-medium shadow-md hover:shadow-lg transition"
                                        >
                                            Simpan
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setEditingProfile(false);
                                                setEditName(userName);
                                                setEditPhone(userPhone);
                                            }}
                                            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                        >
                                            Batal
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Alamat */}
                            {activeTab === "address" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                                        Alamat Pengiriman
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <select
                                            value={addrProvince}
                                            onChange={(e) => onProvinceChange(e.target.value)}
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                        >
                                            <option value="">Provinsi</option>
                                            {provinces.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={addrCity}
                                            onChange={(e) => onCityChange(e.target.value)}
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                        >
                                            <option value="">Kota/Kabupaten</option>
                                            {cities.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={addrDistrict}
                                            onChange={(e) => onDistrictChange(e.target.value)}
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                        >
                                            <option value="">Kecamatan</option>
                                            {districts.map((d) => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={addrVillage}
                                            onChange={(e) => onVillageChange(e.target.value)}
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                        >
                                            <option value="">Kelurahan</option>
                                            {villages.map((v) => (
                                                <option key={v.id} value={v.id}>{v.name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={addrPostal}
                                            onChange={(e) => setAddrPostal(e.target.value)}
                                            placeholder="Kode Pos"
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition"
                                        />
                                        <input
                                            type="text"
                                            value={addrLine}
                                            onChange={(e) => setAddrLine(e.target.value)}
                                            placeholder="Detail alamat"
                                            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm transition md:col-span-2"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={saveAddress}
                                        className="mt-6 px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-medium shadow-md hover:shadow-lg transition"
                                    >
                                        Simpan Alamat
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Placeholder lainnya tetap sama, tapi ukuran dikecilkan */}
                            {/* Wishlist, Orders, Settings - ukuran dikecilkan sesuai */}
                            {activeTab === "wishlist" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                                        Wishlist Saya
                                    </h2>
                                    
                                    {wishlistLoading && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="aspect-[3/4] rounded-xl bg-amber-50 dark:bg-gray-800 border border-amber-100 dark:border-gray-700 animate-pulse" />
                                            ))}
                                        </div>
                                    )}

                                    {!wishlistLoading && wishlistItems.length === 0 && (
                                        <div className="text-center py-12">
                                            <Heart className="w-16 h-16 text-amber-400 dark:text-yellow-500 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                Wishlist Kosong
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                                Tambahkan produk favorit dari katalog
                                            </p>
                                            <Link
                                                to="/katalog"
                                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-500 dark:to-yellow-500 text-white font-medium shadow hover:shadow-lg transition"
                                            >
                                                Lihat Katalog
                                            </Link>
                                        </div>
                                    )}

                                    {!wishlistLoading && wishlistItems.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {wishlistItems.map((item) => {
                                                const p = item.produk;
                                                if (!p) return null;
                                                return (
                                                    <motion.div
                                                        key={item.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col group"
                                                    >
                                                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                            {p.gambar ? (
                                                                <img
                                                                    src={p.gambar}
                                                                    alt={p.nama}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-4xl text-amber-300">
                                                                    ✦
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={() => removeFromWishlist(item.id)}
                                                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm backdrop-blur-sm"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-amber-600/90 text-white text-[10px] font-bold rounded-md backdrop-blur-sm">
                                                                {p.karatEmas}K
                                                            </div>
                                                        </div>
                                                        <div className="p-3 flex-1 flex flex-col">
                                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-1" title={p.nama}>
                                                                {p.nama}
                                                            </h3>
                                                            <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-3">
                                                                {formatPrice(p.harga)}
                                                            </p>
                                                            <div className="mt-auto">
                                                                <button
                                                                    onClick={() => addToCart(p)}
                                                                    className="w-full py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-500 dark:hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                                                                >
                                                                    <ShoppingCart className="w-3.5 h-3.5" />
                                                                    + Keranjang
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Riwayat Pembayaran */}
                            {activeTab === "payments" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-5">
                                        Riwayat Pembayaran
                                    </h2>
                                    {paymentsError && (
                                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                            {paymentsError}
                                        </div>
                                    )}
                                    {paymentsLoading ? (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-amber-50 dark:bg-gray-800 border border-amber-100 dark:border-gray-700 animate-pulse space-y-3">
                                                    <div className="h-4 bg-amber-200 dark:bg-gray-700 rounded w-1/2" />
                                                    <div className="h-4 bg-amber-200 dark:bg-gray-700 rounded w-1/3" />
                                                    <div className="h-4 bg-amber-200 dark:bg-gray-700 rounded w-2/3" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : payments.length === 0 ? (
                                        <div className="text-center py-10">
                                            <CreditCard className="w-16 h-16 text-amber-400 dark:text-yellow-500 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">Belum ada pembayaran.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {payments.map((p) => (
                                                <div key={p.id || p.externalId} className="p-4 rounded-xl border border-amber-100 dark:border-gray-700">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {(p.externalId || p.invoiceId || p.id || "").toString()}
                                                        </p>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${["PAID", "SETTLED"].includes(String(p.status || "").toUpperCase())
                                                                    ? "bg-green-100 text-green-700"
                                                                    : ["PENDING", "UNPAID"].includes(String(p.status || "").toUpperCase())
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : ["EXPIRED"].includes(String(p.status || "").toUpperCase())
                                                                            ? "bg-gray-200 text-gray-700"
                                                                            : "bg-purple-100 text-purple-700"
                                                                }`}
                                                        >
                                                            {p.status || "UNKNOWN"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        Dibuat: {p.createdAt ? new Date(p.createdAt).toLocaleString("id-ID") : "-"}
                                                        {p.paidAt && (
                                                            <> • Dibayar: {new Date(p.paidAt).toLocaleString("id-ID")}</>
                                                        )}
                                                        {p.expiredAt && (
                                                            <> • Kedaluwarsa: {new Date(p.expiredAt).toLocaleString("id-ID")}</>
                                                        )}
                                                    </p>
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                                            <p className="font-bold text-amber-700 dark:text-yellow-400">
                                                                {new Intl.NumberFormat("id-ID", {
                                                                    style: "currency",
                                                                    currency: "IDR",
                                                                    maximumFractionDigits: 0,
                                                                }).format(typeof p.amount === "number" ? p.amount : 0)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">Invoice</p>
                                                            <div className="flex gap-2">
                                                                {p.invoiceUrl && (
                                                                    <a
                                                                        href={p.invoiceUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="inline-block px-3 py-2 rounded-lg border border-amber-300 dark:border-yellow-600 text-amber-700 dark:text-yellow-400 hover:bg-amber-50 dark:hover:bg-gray-800 text-xs font-semibold transition-colors"
                                                                    >
                                                                        Buka Online
                                                                    </a>
                                                                )}
                                                                {(p.status === 'PAID' || p.status === 'SETTLED') && (
                                                                    <button
                                                                        onClick={() => downloadInvoice(p)}
                                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 text-xs font-semibold transition-all shadow-md hover:shadow-lg"
                                                                    >
                                                                        <Download className="w-3.5 h-3.5" />
                                                                        Download PDF
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center gap-3">
                                                        {(p.externalId || p.invoiceId) && (
                                                            <button
                                                                onClick={async () => {
                                                                    const token = localStorage.getItem("user_token");
                                                                    try {
                                                                        let res;

                                                                        // Log untuk debugging
                                                                        console.log('[UserProfile] Sync payment:', {
                                                                            externalId: p.externalId,
                                                                            invoiceId: p.invoiceId,
                                                                            status: p.status
                                                                        });

                                                                        if (p.externalId) {
                                                                            // Use POST method for sync
                                                                            res = await api.post(`/api/payments/sync/${p.externalId}`, {}, {
                                                                                headers: { Authorization: `Bearer ${token}` }
                                                                            });
                                                                        } else if (p.invoiceId) {
                                                                            // Use POST method for sync
                                                                            res = await api.post(`/api/payments/sync-by-xendit/${p.invoiceId}`, {}, {
                                                                                headers: { Authorization: `Bearer ${token}` }
                                                                            });
                                                                        }

                                                                        console.log('[UserProfile] Sync response:', res.data);

                                                                        if (res?.data?.success) {
                                                                            setNotice("Status pembayaran diperbarui");
                                                                            setNoticeType("success");

                                                                            // refresh history
                                                                            try {
                                                                                const h = await api.get("/api/payments/user/history", {
                                                                                    headers: { Authorization: `Bearer ${token}` }
                                                                                });
                                                                                const arr = Array.isArray(h.data?.data) ? h.data.data : [];
                                                                                setPayments(arr);
                                                                            } catch (refreshErr) {
                                                                                console.error('[UserProfile] Failed to refresh history:', refreshErr);
                                                                            }
                                                                        } else {
                                                                            setNotice(res?.data?.message || "Gagal sinkron status");
                                                                            setNoticeType("error");
                                                                        }

                                                                        setTimeout(() => setNotice(""), 2500);
                                                                    } catch (err) {
                                                                        console.error('[UserProfile] Sync error:', err);
                                                                        console.error('[UserProfile] Error response:', err.response?.data);

                                                                        const errorMsg = err.response?.data?.message || "Gagal sinkron status";
                                                                        setNotice(errorMsg);
                                                                        setNoticeType("error");
                                                                        setTimeout(() => setNotice(""), 3000);
                                                                    }
                                                                }}
                                                                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
                                                            >
                                                                Sinkron Status
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === "settings" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <Settings className="w-16 h-16 text-amber-400 dark:text-yellow-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                        Pengaturan
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Fitur akan segera hadir
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {confirmLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <LogOut className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Konfirmasi Logout</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Anda yakin ingin keluar dari akun?</p>
                                </div>
                            </div>
                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => { setConfirmLogout(false); handleLogout(); }}
                                    disabled={loggingOut}
                                    className="flex-1 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                                >
                                    {loggingOut ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Keluar...</span>
                                        </>
                                    ) : (
                                        "Ya, Keluar"
                                    )}
                                </button>
                                <button
                                    onClick={() => setConfirmLogout(false)}
                                    disabled={loggingOut}
                                    className="flex-1 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setIsLoggedIn(true)} />
        </motion.div>
    );
}
