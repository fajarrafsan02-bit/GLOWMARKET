import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { StrictMode } from "react";

import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminProductsPage from "./pages/AdminProductsPage.jsx";
import AdminOrdersPage from "./pages/AdminOrdersPage.jsx";
import KatalogPage from "./pages/KatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import PesananPage from "./pages/PesananPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import KeranjangPage from "./pages/KeranjangPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import PaymentStatusPage from "./pages/PaymentStatusPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PaymentHistoryPage from "./pages/PaymentHistoryPage.jsx";
import TentangPage from "./pages/TentangPage.jsx";
import KontakPage from "./pages/KontakPage.jsx";
import ScrollToTop from "./components/ScrollToTop";
import DetailPesananPage from "./pages/DetailPesananPage.jsx";
import UserHomePage from "./pages/UserHomePage.jsx";
import AdminCustomersPage from "./pages/AdminCustomersPage.jsx";
import AdminReportsPage from "./pages/AdminReportsPage.jsx";
import AdminAccountingPage from "./pages/AdminAccountingPage.jsx";
import AdminChatPage from "./pages/AdminChatPage.jsx";
import AdminSettingsPage from "./pages/AdminSettingsPage.jsx";
import AdminVouchersPage from "./pages/AdminVouchersPage.jsx";
import AdminPengembalianPage from "./pages/AdminPengembalianPage.jsx";
import PengembalianPage from "./pages/PengembalianPage.jsx";
import PoinPage from "./pages/PoinPage.jsx";
import UserChatPage from "./pages/UserChatPage.jsx";
import UserPresenceProvider from "./components/UserPresenceProvider.jsx";
import RequireAuth from "./components/guards/RequireAuth.jsx";
import RequireAdmin from "./components/guards/RequireAdmin.jsx";
import RedirectAdminHome from "./components/guards/RedirectAdminHome.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { initTheme } from "./utils/theme.js";

initTheme();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <UserPresenceProvider>
                    <ScrollToTop />
                    <Routes>
                        <Route
                            path="/admin/dashboard"
                            element={
                                <RequireAdmin>
                                    <AdminDashboardPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/products"
                            element={
                                <RequireAdmin>
                                    <AdminProductsPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <RequireAdmin>
                                    <AdminOrdersPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/pelanggan"
                            element={
                                <RequireAdmin>
                                    <AdminCustomersPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/laporan"
                            element={
                                <RequireAdmin>
                                    <AdminReportsPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/akuntansi"
                            element={
                                <RequireAdmin>
                                    <AdminAccountingPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/chat"
                            element={
                                <RequireAdmin>
                                    <AdminChatPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/settings"
                            element={
                                <RequireAdmin>
                                    <AdminSettingsPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/vouchers"
                            element={
                                <RequireAdmin>
                                    <AdminVouchersPage />
                                </RequireAdmin>
                            }
                        />
                        <Route
                            path="/admin/pengembalian"
                            element={
                                <RequireAdmin>
                                    <AdminPengembalianPage />
                                </RequireAdmin>
                            }
                        />

                        {/*
                            Seluruh rute area customer dibungkus RedirectAdminHome —
                            akun ADMIN yang sesinya baru dipulihkan lewat refresh
                            token (bukan hanya saat login manual) tidak boleh
                            nyasar ke halaman pembeli, selalu dialihkan ke
                            dashboard admin.
                        */}
                        <Route element={<RedirectAdminHome />}>
                            <Route path="/" element={<UserHomePage />} />
                            <Route path="/katalog" element={<KatalogPage />} />
                            <Route path="/produk/:id" element={<ProductDetailPage />} />
                            <Route path="/tentang" element={<TentangPage />} />
                            <Route path="/kontak" element={<KontakPage />} />
                            <Route
                                path="/payment-status/:externalId"
                                element={<PaymentStatusPage />}
                            />

                            <Route
                                path="/keranjang"
                                element={
                                    <RequireAuth>
                                        <KeranjangPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/wishlist"
                                element={
                                    <RequireAuth>
                                        <WishlistPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <RequireAuth>
                                        <CheckoutPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/payment"
                                element={
                                    <RequireAuth>
                                        <PaymentPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/payment-history"
                                element={
                                    <RequireAuth>
                                        <PaymentHistoryPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/pesanan"
                                element={
                                    <RequireAuth>
                                        <PesananPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/pesanan/:id"
                                element={
                                    <RequireAuth>
                                        <DetailPesananPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <RequireAuth>
                                        <UserProfilePage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <RequireAuth>
                                        <UserChatPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/pengembalian"
                                element={
                                    <RequireAuth>
                                        <PengembalianPage />
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/poin"
                                element={
                                    <RequireAuth>
                                        <PoinPage />
                                    </RequireAuth>
                                }
                            />
                        </Route>
                    </Routes>
                </UserPresenceProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);
