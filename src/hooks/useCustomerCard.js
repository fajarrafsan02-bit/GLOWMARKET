export default function useCustomerCard({ customer, selectedCustomer }) {
    const customerId = customer.id || customer.userId;

    const customerName = customer.nama || customer.name || "Pelanggan Tanpa Nama";

    const customerEmail = customer.email || "-";

    const customerPhone = customer.phone || customer.nomorTelepon || "";

    const totalOrders = Number(customer.totalOrders ?? customer.orderCount ?? 0) || 0;

    const totalSpent = Number(customer.totalSpent ?? 0) || 0;

    const isActive = (() => {
        if (typeof customer.isActive === "boolean") return customer.isActive;
        if (typeof customer.active === "boolean") return customer.active;
        if (typeof customer.terverifikasi === "boolean") return customer.terverifikasi;
        if (typeof customer.is_active === "boolean") return customer.is_active;
        if (customer.status) {
            const s = String(customer.status).toUpperCase();
            return s === "AKTIF" || s === "ACTIVE";
        }
        return true;
    })();

    const selectedId = selectedCustomer ? (selectedCustomer.id ?? selectedCustomer.userId) : null;

    const isMenuOpen =
        selectedId != null && customerId != null && String(selectedId) === String(customerId);

    return {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        totalOrders,
        totalSpent,
        isActive,
        isMenuOpen,
    };
}
