import { motion as Motion, AnimatePresence } from "framer-motion";

import useAddressSection from "../../hooks/useAddressSection.js";

import AddressHeader from "../../components/userprofile/address/AddressHeader.jsx";
import AddressCard from "../../components/userprofile/address/AddressCard.jsx";
import AddressEmptyState from "../../components/userprofile/address/AddressEmptyState.jsx";
import AddressForm from "../../components/userprofile/address/AddressForm.jsx";

export default function AddressSection({
    addrProvince,
    addrCity,
    addrDistrict,
    addrVillage,
    addrPostal,
    addrLine,
    onProvinceChange,
    onCityChange,
    onDistrictChange,
    onVillageChange,
    onPostalChange,
    onLineChange,
    provinces,
    cities,
    districts,
    villages,
    onSaveAddress,

    addresses = [],
    selectedDefaultId,
    onSetPrimaryAddress,
    onEditAddress,
    onDeleteAddress,
}) {
    const { showForm, handleAddAddress, handleCancel, handleSave } = useAddressSection({
        onSaveAddress,
    });

    return (
        <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <AddressHeader onAdd={handleAddAddress} />

            {addresses.length > 0 ? (
                <div className="space-y-4">
                    {addresses.map((address) => {
                        const isPrimary =
                            selectedDefaultId === address.id ||
                            address.isDefault ||
                            address.isPrimary;

                        return (
                            <AddressCard
                                key={address.id}
                                address={address}
                                isPrimary={isPrimary}
                                onSetPrimary={() => onSetPrimaryAddress?.(address.id)}
                                onEdit={() => onEditAddress?.(address)}
                                onDelete={() => onDeleteAddress?.(address.id)}
                            />
                        );
                    })}
                </div>
            ) : (
                <AddressEmptyState onAdd={handleAddAddress} />
            )}

            <AnimatePresence>
                {showForm && (
                    <Motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <AddressForm
                            addrProvince={addrProvince}
                            addrCity={addrCity}
                            addrDistrict={addrDistrict}
                            addrVillage={addrVillage}
                            addrPostal={addrPostal}
                            addrLine={addrLine}
                            onProvinceChange={onProvinceChange}
                            onCityChange={onCityChange}
                            onDistrictChange={onDistrictChange}
                            onVillageChange={onVillageChange}
                            onPostalChange={onPostalChange}
                            onLineChange={onLineChange}
                            provinces={provinces}
                            cities={cities}
                            districts={districts}
                            villages={villages}
                            onCancel={handleCancel}
                            onSave={handleSave}
                        />
                    </Motion.div>
                )}
            </AnimatePresence>
        </Motion.div>
    );
}
