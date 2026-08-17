import { motion as Motion } from "framer-motion";

import ProfileView from "../../components/userprofile/profile/ProfileView.jsx";
import ProfileEdit from "../../components/userprofile/profile/ProfileEdit.jsx";

export default function ProfileInfo({
    userName,
    userEmail,
    userPhone,
    editingProfile,
    editName,
    editEmail,
    editPhone,
    onEditName,
    onEditPhone,
    onSaveProfile,
    onCancelEdit,
    addresses,
    selectedDefaultId,
    onSetPrimaryAddress,
    getDisplayAddress,
}) {
    const motionProps = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
    };

    if (!editingProfile) {
        return (
            <Motion.div {...motionProps}>
                <ProfileView
                    userName={userName}
                    userEmail={userEmail}
                    userPhone={userPhone}
                    addresses={addresses}
                    selectedDefaultId={selectedDefaultId}
                    onSetPrimaryAddress={onSetPrimaryAddress}
                    getDisplayAddress={getDisplayAddress}
                />
            </Motion.div>
        );
    }

    return (
        <Motion.div {...motionProps}>
            <ProfileEdit
                editName={editName}
                editEmail={editEmail}
                editPhone={editPhone}
                onEditName={onEditName}
                onEditPhone={onEditPhone}
                onSaveProfile={onSaveProfile}
                onCancelEdit={onCancelEdit}
            />
        </Motion.div>
    );
}
