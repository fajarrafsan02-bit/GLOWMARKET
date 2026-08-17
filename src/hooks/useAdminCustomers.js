import { useState, useEffect, useMemo } from "react";

import api from "../api/Axios.jsx";
import { isCustomerActive } from "../utils/customer.js";

export default function useAdminCustomers() {
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");

    const [error, setError] = useState("");

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [showFeatureNotice, setShowFeatureNotice] = useState(false);

    const [showDetailModal, setShowDetailModal] = useState(false);

    const [detailCustomer, setDetailCustomer] = useState(null);

    const [statusModalCustomer, setStatusModalCustomer] = useState(null);

    const [togglingStatus, setTogglingStatus] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/api/user/customers");

                const data = Array.isArray(response?.data?.data)
                    ? response.data.data
                    : Array.isArray(response?.data)
                      ? response.data
                      : [];

                setCustomers(data);
            } catch (err) {
                console.error("[AdminCustomers]", err);

                setError(
                    err?.response?.data?.message || err?.message || "Gagal memuat data pelanggan",
                );

                setCustomers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const filtered = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) {
            return customers;
        }

        return customers.filter((customer) => {
            const name = customer.nama || customer.name || "";
            const email = customer.email || "";
            const phone = customer.phone || customer.nomorTelepon || "";

            return `${name} ${email} ${phone}`.toLowerCase().includes(query);
        });
    }, [customers, searchTerm]);

    const summary = useMemo(() => {
        const total = customers.length;

        const active = customers.filter(isCustomerActive).length;

        return {
            total,
            active,
        };
    }, [customers]);

    const handleViewDetail = (customer) => {
        setDetailCustomer(customer);
        setShowDetailModal(true);
        setSelectedCustomer(null);
    };

    const handleOpenToggleStatusModal = (customer) => {
        setStatusModalCustomer(customer);
        setSelectedCustomer(null);
    };

    const handleConfirmToggleStatus = async () => {
        if (!statusModalCustomer) return;

        const customerId = statusModalCustomer.id || statusModalCustomer.userId;

        const currentActive = isCustomerActive(statusModalCustomer);

        const nextActiveState = !currentActive;

        try {
            setTogglingStatus(true);

            const response = await api.put(`/api/user/customers/${customerId}/toggle-status`);

            const updatedCustomer = response?.data?.data;

            const finalIsActive =
                updatedCustomer && typeof updatedCustomer.isActive === "boolean"
                    ? updatedCustomer.isActive
                    : updatedCustomer && typeof updatedCustomer.active === "boolean"
                      ? updatedCustomer.active
                      : nextActiveState;

            setCustomers((prev) =>
                prev.map((c) => {
                    const cId = c.id || c.userId;
                    if (String(cId) === String(customerId)) {
                        return {
                            ...c,
                            ...(updatedCustomer || {}),
                            isActive: finalIsActive,
                            active: finalIsActive,
                            terverifikasi: finalIsActive,
                        };
                    }
                    return c;
                }),
            );

            setStatusModalCustomer(null);
        } catch (err) {
            console.error("[AdminCustomers] Toggle status error:", err);

            alert(err?.response?.data?.message || err?.message || "Gagal mengubah status pengguna");
        } finally {
            setTogglingStatus(false);
        }
    };

    const handleFeatureComingSoon = () => {
        setShowFeatureNotice(true);
        setSelectedCustomer(null);

        setTimeout(() => {
            setShowFeatureNotice(false);
        }, 3000);
    };

    return {
        customers,
        loading,
        searchTerm,
        setSearchTerm,
        error,
        selectedCustomer,
        setSelectedCustomer,
        showFeatureNotice,
        setShowFeatureNotice,
        showDetailModal,
        setShowDetailModal,
        detailCustomer,
        statusModalCustomer,
        setStatusModalCustomer,
        togglingStatus,
        filtered,
        summary,
        handleViewDetail,
        handleOpenToggleStatusModal,
        handleConfirmToggleStatus,
        handleFeatureComingSoon,
    };
}
