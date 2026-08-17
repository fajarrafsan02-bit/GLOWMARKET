export function isCustomerActive(customer) {
    if (typeof customer.isActive === "boolean") return customer.isActive;
    if (typeof customer.active === "boolean") return customer.active;
    if (typeof customer.terverifikasi === "boolean") return customer.terverifikasi;
    if (typeof customer.is_active === "boolean") return customer.is_active;
    if (customer.status) {
        const s = String(customer.status).toUpperCase();
        return s === "AKTIF" || s === "ACTIVE";
    }
    return true;
}
