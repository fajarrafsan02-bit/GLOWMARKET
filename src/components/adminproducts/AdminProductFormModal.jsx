import { motion as Motion, AnimatePresence } from "framer-motion";

import useProductForm from "../../hooks/useProductForm.js";

import ProductFormHeader from "./ProductFormHeader.jsx";
import ProductBasicInfoFields from "./ProductBasicInfoFields.jsx";
import ProductImageField from "./ProductImageField.jsx";
import ProductPriceFields from "./ProductPriceFields.jsx";
import ProductVariantFields from "./ProductVariantFields.jsx";
import ProductAvailabilityFields from "./ProductAvailabilityFields.jsx";
import ProductFormFooter from "./ProductFormFooter.jsx";

export default function AdminProductFormModal({
    editingId,
    form,
    onChange,
    onImageUpload,
    onError,
    loading,
    onSubmit,
    onClose,
}) {
    const {
        uploading,
        isEdit,
        modalBerubah,
        handlePriceChange,
        handleCostChange,
        handleImageChange,
        removeImage,
        moveImage,
        setVarian,
        addVarian,
        removeVarian,
    } = useProductForm({ form, onChange, onError, onImageUpload, editingId });

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/35 backdrop-blur-sm"
            >
                <Motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                    className="w-full max-w-2xl max-h-[95vh] flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
                >
                    <ProductFormHeader isEdit={isEdit} loading={loading} onClose={onClose} />

                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
                        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                            <ProductBasicInfoFields form={form} onChange={onChange} />

                            <ProductImageField
                                form={form}
                                loading={loading}
                                uploading={uploading}
                                onImageChange={handleImageChange}
                                onRemoveImage={removeImage}
                                onMoveImage={moveImage}
                            />

                            <ProductPriceFields
                                form={form}
                                isEdit={isEdit}
                                modalBerubah={modalBerubah}
                                onChange={onChange}
                                onPriceChange={handlePriceChange}
                                onCostChange={handleCostChange}
                            />

                            <ProductVariantFields
                                form={form}
                                onSetVarian={setVarian}
                                onAddVarian={addVarian}
                                onRemoveVarian={removeVarian}
                            />

                            <ProductAvailabilityFields form={form} onChange={onChange} />
                        </div>

                        <ProductFormFooter
                            isEdit={isEdit}
                            loading={loading}
                            uploading={uploading}
                            onClose={onClose}
                        />
                    </form>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
}
