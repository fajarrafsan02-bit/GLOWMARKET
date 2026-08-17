import { AlertCircle, MessageCircle } from "lucide-react";
import ChatMessage from "./ChatMessage.jsx";
import useStoreSettings from "../../hooks/useStoreSettings.js";

export default function ChatMessagesArea({ messages, error, userId, messagesEndRef }) {
    const store = useStoreSettings();

    return (
        <div className="flex-1 overflow-y-auto flex flex-col px-3 sm:px-5 py-4 sm:py-5 bg-[#fafafa] dark:bg-gray-950 scrollbar-thin">
            {/* =====================================================
                ERROR
            ====================================================== */}
            {error && (
                <div className="mb-4 flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                    <span className="leading-relaxed">{error}</span>
                </div>
            )}

            {/* =====================================================
                EMPTY STATE
            ====================================================== */}
            {messages.length === 0 ? (
                <div className="flex-1 min-h-full flex items-center justify-center text-center px-6">
                    <div className="max-w-xs">
                        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-amber-500" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Belum ada pesan
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            Mulai percakapan dengan customer service {store.name}.
                        </p>
                    </div>
                </div>
            ) : (
                /* =================================================
                   MESSAGE LIST
                ================================================== */
                <div className="space-y-3 mt-auto flex flex-col">
                    {messages.map((msg, index) => {
                        const isMe =
                            msg.senderRole === "USER" || String(msg.senderId) === String(userId);

                        return (
                            <ChatMessage
                                key={msg.id || `${msg.createdAt}-${index}`}
                                msg={msg}
                                isMe={isMe}
                            />
                        );
                    })}
                </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-px" />
        </div>
    );
}
