import AdminLayout from "../components/AdminLayout.jsx";
import useAdminChat from "../hooks/useAdminChat.js";

import ChatSidebar from "../components/adminchat/ChatSidebar.jsx";
import ChatWindow from "../components/adminchat/ChatWindow.jsx";

export default function AdminChat() {
    const {
        selectedCustomer,
        setSelectedCustomer,
        message,
        setMessage,
        searchQuery,
        setSearchQuery,
        messages,
        filteredCustomers,
        formatTime,
        messagesEndRef,
        sendMessage,
    } = useAdminChat();

    return (
        <AdminLayout title="Chat Pelanggan" activeMenu="chat">
            <div className="h-[calc(100vh-64px)] bg-[#f7f7f8] dark:bg-gray-950 p-3 sm:p-4 overflow-hidden">
                <div className="h-full max-w-[1400px] mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex">
                    {/* =================================================
                        CUSTOMER SIDEBAR
                    ================================================== */}

                    <div
                        className={` w-full md:w-[300px] lg:w-[330px] shrink-0 border-r border-gray-200 dark:border-gray-800 ${selectedCustomer ? "hidden md:flex" : "flex"} `}
                    >
                        <ChatSidebar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filteredCustomers={filteredCustomers}
                            selectedCustomer={selectedCustomer}
                            setSelectedCustomer={setSelectedCustomer}
                            formatTime={formatTime}
                        />
                    </div>

                    {/* =================================================
                        CHAT WINDOW
                    ================================================== */}

                    <div
                        className={` flex-1 min-w-0 ${selectedCustomer ? "flex" : "hidden md:flex"} `}
                    >
                        <ChatWindow
                            selectedCustomer={selectedCustomer}
                            messages={messages}
                            messagesEndRef={messagesEndRef}
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                            formatTime={formatTime}
                            onBack={() => setSelectedCustomer(null)}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
