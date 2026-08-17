import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

import EmailVerificationPanel from "../components/EmailVerificationPanel.jsx";
import ProfileHeaderCard from "../components/userprofile/ProfileHeaderCard.jsx";
import ProfileNotice from "../components/userprofile/ProfileNotice.jsx";
import ProfileContentHeader from "../components/userprofile/ProfileContentHeader.jsx";
import ProfileSettingsPlaceholder from "../components/userprofile/ProfileSettingsPlaceholder.jsx";

import ProfileSidebar from "./userprofile/ProfileSidebar.jsx";
import ProfileInfo from "./userprofile/ProfileInfo.jsx";
import AddressSection from "./userprofile/AddressSection.jsx";
import WishlistSection from "./userprofile/WishlistSection.jsx";
import PaymentsSection from "./userprofile/PaymentsSection.jsx";
import ReviewsSection from "./userprofile/ReviewsSection.jsx";
import LogoutConfirm from "./userprofile/LogoutConfirm.jsx";

import useUserProfile from "../hooks/useUserProfile.js";
import { formatPrice } from "../utils/format.js";

export default function UserProfile() {
    const {
        showAuth,
        setShowAuth,
        userName,
        userEmail,
        userPhone,
        activeTab,
        setActiveTab,
        notice,
        noticeType,
        editingProfile,
        setEditingProfile,
        editName,
        setEditName,
        editEmail,
        editPhone,
        setEditPhone,
        confirmLogout,
        setConfirmLogout,
        loggingOut,
        wishlistItems,
        wishlistLoading,
        payments,
        paymentsLoading,
        paymentsError,
        reviews,
        reviewsLoading,
        reviewsError,
        notify,
        addressForm,
        saveProfile,
        syncPayment,
        handleLogout,
        tabs,
        activeTabData,
        removeFromWishlist,
        addToCart,
        emailTerverifikasi,
        tandaiEmailTerverifikasi,
    } = useUserProfile();

    return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-[#f7f7f7] dark:bg-gray-950"
        >
            <Header setShowAuth={setShowAuth} />

            {/* ========================================================
                PAGE
            ======================================================== */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                    <Link to="/" className="hover:text-amber-600 transition-colors">
                        Beranda
                    </Link>

                    <ChevronRight className="w-3 h-3" />

                    <span className="text-gray-600 dark:text-gray-300">Akun Saya</span>
                </div>

                {/* ====================================================
                    ACCOUNT HEADER
                ===================================================== */}

                <ProfileHeaderCard userName={userName} userEmail={userEmail} userPhone={userPhone} />

                {/* ====================================================
                    NOTICE
                ===================================================== */}

                <ProfileNotice notice={notice} noticeType={noticeType} />

                {/* Satu-satunya tempat pengguna bisa menuntaskan verifikasi
                    tanpa lebih dulu menabrak penolakan di checkout. */}
                {!emailTerverifikasi && (
                    <div className="mb-5">
                        <EmailVerificationPanel
                            email={userEmail}
                            onVerified={tandaiEmailTerverifikasi}
                        />
                    </div>
                )}

                {/* ====================================================
                    ACCOUNT LAYOUT
                ===================================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-4 sm:gap-5">
                    {/* Sidebar */}
                    <ProfileSidebar
                        userName={userName}
                        userEmail={userEmail}
                        tabs={tabs}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        onEditProfile={() => setEditingProfile(true)}
                        onLogoutClick={() => setConfirmLogout(true)}
                    />

                    {/* Content */}
                    <Motion.section
                        key={activeTab}
                        initial={{
                            opacity: 0,
                            x: 10,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.3,
                        }}
                        className="min-w-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                    >
                        <ProfileContentHeader activeTabData={activeTabData} />

                        {/* Content body */}
                        <div className="p-4 sm:p-6">
                            {activeTab === "profile" && (
                                <ProfileInfo
                                    userName={userName}
                                    userEmail={userEmail}
                                    userPhone={userPhone}
                                    editingProfile={editingProfile}
                                    editName={editName}
                                    editEmail={editEmail}
                                    editPhone={editPhone}
                                    onEditName={setEditName}
                                    onEditPhone={setEditPhone}
                                    onSaveProfile={saveProfile}
                                    onCancelEdit={() => {
                                        setEditingProfile(false);

                                        setEditName(userName);

                                        setEditPhone(userPhone);
                                    }}
                                    addresses={addressForm.addresses}
                                    selectedDefaultId={addressForm.selectedDefaultId}
                                    onSetPrimaryAddress={addressForm.setPrimaryAddress}
                                    getDisplayAddress={addressForm.getDisplayAddress}
                                />
                            )}

                            {activeTab === "address" && (
                                <AddressSection
                                    addrProvince={addressForm.addrProvince}
                                    addrCity={addressForm.addrCity}
                                    addrDistrict={addressForm.addrDistrict}
                                    addrVillage={addressForm.addrVillage}
                                    addrPostal={addressForm.addrPostal}
                                    addrLine={addressForm.addrLine}
                                    onProvinceChange={addressForm.onProvinceChange}
                                    onCityChange={addressForm.onCityChange}
                                    onDistrictChange={addressForm.onDistrictChange}
                                    onVillageChange={addressForm.onVillageChange}
                                    onPostalChange={addressForm.onPostalChange}
                                    onLineChange={addressForm.onLineChange}
                                    provinces={addressForm.provinces}
                                    cities={addressForm.cities}
                                    districts={addressForm.districts}
                                    villages={addressForm.villages}
                                    addresses={addressForm.addresses}
                                    selectedDefaultId={addressForm.selectedDefaultId}
                                    onSaveAddress={addressForm.saveAddress}
                                    onSetDefault={addressForm.setPrimaryAddress}
                                />
                            )}

                            {activeTab === "wishlist" && (
                                <WishlistSection
                                    loading={wishlistLoading}
                                    items={wishlistItems}
                                    onRemove={removeFromWishlist}
                                    onAddToCart={addToCart}
                                    formatPrice={formatPrice}
                                />
                            )}

                            {activeTab === "payments" && (
                                <PaymentsSection
                                    error={paymentsError}
                                    loading={paymentsLoading}
                                    items={payments}
                                    customerName={userName}
                                    customerEmail={userEmail}
                                    onSyncPayment={syncPayment}
                                    notify={notify}
                                />
                            )}

                            {activeTab === "reviews" && (
                                <ReviewsSection
                                    loading={reviewsLoading}
                                    error={reviewsError}
                                    items={reviews}
                                />
                            )}

                            {activeTab === "settings" && <ProfileSettingsPlaceholder />}
                        </div>
                    </Motion.section>
                </div>
            </main>

            {/* ========================================================
                LOGOUT CONFIRM
            ========================================================= */}

            <LogoutConfirm
                open={confirmLogout}
                loggingOut={loggingOut}
                onConfirm={() => {
                    setConfirmLogout(false);
                    handleLogout();
                }}
                onCancel={() => setConfirmLogout(false)}
            />

            <Footer />

            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </Motion.div>
    );
}
