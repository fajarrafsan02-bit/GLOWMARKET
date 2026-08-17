import useAuthModal from "../hooks/useAuthModal.js";

import AuthModalShell from "./auth/AuthModalShell.jsx";
import AuthTabs from "./auth/AuthTabs.jsx";
import AuthMessages from "./auth/AuthMessages.jsx";
import AuthCodeForm from "./auth/AuthCodeForm.jsx";
import AuthFieldsForm from "./auth/AuthFieldsForm.jsx";
import AuthBottomSwitch from "./auth/AuthBottomSwitch.jsx";
import AuthDivider from "./auth/AuthDivider.jsx";
import GoogleLoginButton from "./auth/GoogleLoginButton.jsx";

export default function AuthModal({ open, onClose, onSuccess }) {
    const auth = useAuthModal({ onClose, onSuccess });

    if (!open) return null;

    return (
        <AuthModalShell
            open={open}
            onClose={onClose}
            isCodeMode={auth.isCodeMode}
            mode={auth.mode}
            email={auth.email}
        >
            {/* MODE TABS — disembunyikan pada layar berbasis kode */}
            {!auth.isCodeMode && <AuthTabs mode={auth.mode} onSwitchMode={auth.switchMode} />}

            {/* MESSAGES */}
            <AuthMessages notice={auth.notice} error={auth.error} />

            {/* GOOGLE LOGIN — sama untuk tab Masuk maupun Daftar */}
            {!auth.isCodeMode && (
                <div className="pt-2.5 space-y-2.5">
                    <div className="px-3.5 xs:px-5">
                        <GoogleLoginButton onCredential={auth.loginWithGoogle} disabled={auth.loading} />
                    </div>
                    <AuthDivider />
                </div>
            )}

            {/* MODE BERBASIS KODE: OTP admin & verifikasi email */}
            {auth.isCodeMode ? (
                <AuthCodeForm
                    mode={auth.mode}
                    otp={auth.otp}
                    timeLeft={auth.timeLeft}
                    canResend={auth.canResend}
                    loading={auth.loading}
                    otpInputRefs={auth.otpInputRefs}
                    formatTime={auth.formatTime}
                    onOtpChange={auth.handleOtpChange}
                    onOtpKeyDown={auth.handleOtpKeyDown}
                    onResendOtp={auth.handleResendOtp}
                    onSubmit={auth.mode === "verify-email" ? auth.handleVerifyEmail : auth.handleVerifyOtp}
                    onBackToLogin={() => auth.switchMode("login")}
                />
            ) : (
                /* REGULAR LOGIN / REGISTER FORM */
                <AuthFieldsForm
                    mode={auth.mode}
                    name={auth.name}
                    onNameChange={(e) => auth.setName(e.target.value)}
                    email={auth.email}
                    onEmailChange={(e) => auth.setEmail(e.target.value)}
                    phone={auth.phone}
                    onPhoneChange={(e) => auth.setPhone(e.target.value)}
                    password={auth.password}
                    onPasswordChange={(e) => auth.setPassword(e.target.value)}
                    showPassword={auth.showPassword}
                    onTogglePassword={() => auth.setShowPassword(!auth.showPassword)}
                    loading={auth.loading}
                    sendingOtp={auth.sendingOtp}
                    onSubmit={auth.submit}
                />
            )}

            {/* BOTTOM SWITCH */}
            {!auth.isCodeMode && (
                <AuthBottomSwitch mode={auth.mode} onSwitchMode={auth.switchMode} />
            )}
        </AuthModalShell>
    );
}
