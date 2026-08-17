import { useState } from "react";

export default function useAddressSection({ onSaveAddress }) {
    const [showForm, setShowForm] = useState(false);

    const handleAddAddress = () => setShowForm(true);

    const handleCancel = () => setShowForm(false);

    const handleSave = () => {
        onSaveAddress?.();
        setShowForm(false);
    };

    return { showForm, handleAddAddress, handleCancel, handleSave };
}
