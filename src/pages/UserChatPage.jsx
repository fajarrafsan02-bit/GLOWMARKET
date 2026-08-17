import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import useUserChat from "../hooks/useUserChat.js";
import { getQuickReplies } from "../utils/orderChat.js";

import ChatHeader from "../components/userchat/ChatHeader.jsx";
import ChatMessagesArea from "../components/userchat/ChatMessagesArea.jsx";
import ChatInput from "../components/userchat/ChatInput.jsx";
import ChatLoginPrompt from "../components/userchat/ChatLoginPrompt.jsx";

export default function UserChat() {
    const location = useLocation();
    const [showAuth, setShowAuth] = useState(false);

    const {
        messages,
        message,
        setMessage,
        chatContext,
        userProfile,
        isConnected,
        loading,
        error,
        sendMessage,
        messagesEndRef,
    } = useUserChat({
        defaultMessage: location.state?.defaultMessage,
        chatContext: location.state?.chatContext,
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!userProfile && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Header setShowAuth={setShowAuth} />
                <ChatLoginPrompt onLogin={() => setShowAuth(true)} />
                <Footer />
                <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header setShowAuth={setShowAuth} />

            <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
                {/* Chat Card */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
                    <ChatHeader isConnected={isConnected} />

                    <ChatMessagesArea
                        messages={messages}
                        error={error}
                        userId={userProfile.id}
                        messagesEndRef={messagesEndRef}
                    />

                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        isConnected={isConnected}
                        quickReplies={getQuickReplies(chatContext)}
                    />
                </div>
            </div>

            <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
    );
}
