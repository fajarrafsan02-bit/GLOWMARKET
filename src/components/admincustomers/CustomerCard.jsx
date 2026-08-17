import { motion as Motion } from "framer-motion";

import useCustomerCard from "../../hooks/useCustomerCard.js";

import DesktopRow from "./customer/DesktopRow.jsx";
import MobileCard from "./customer/MobileCard.jsx";

export default function CustomerCard({
    customer,
    i,
    selectedCustomer,
    setSelectedCustomer,
    handleViewDetail,
    handleFeatureComingSoon,
    handleToggleStatus,
}) {
    const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        totalOrders,
        totalSpent,
        isActive,
        isMenuOpen,
    } = useCustomerCard({ customer, selectedCustomer });

    const onDisable = () => {
        if (handleToggleStatus) {
            handleToggleStatus(customer);
        } else {
            handleFeatureComingSoon();
        }
    };

    return (
        <Motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-visible transition-colors hover:border-gray-300 dark:hover:border-gray-700"
        >
            <DesktopRow
                customerName={customerName}
                customerId={customerId}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                totalOrders={totalOrders}
                totalSpent={totalSpent}
                isActive={isActive}
                lastLogin={customer.lastLogin}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setSelectedCustomer(isMenuOpen ? null : customer)}
                onCloseMenu={() => setSelectedCustomer(null)}
                onView={() => handleViewDetail(customer)}
                onEdit={handleFeatureComingSoon}
                onDisable={onDisable}
            />

            <MobileCard
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                totalOrders={totalOrders}
                totalSpent={totalSpent}
                isActive={isActive}
                createdAt={customer.createdAt}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setSelectedCustomer(isMenuOpen ? null : customer)}
                onCloseMenu={() => setSelectedCustomer(null)}
                onView={() => handleViewDetail(customer)}
                onEdit={handleFeatureComingSoon}
                onDisable={onDisable}
            />
        </Motion.div>
    );
}
