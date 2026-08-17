import { ArrowLeft, MoreVertical, Paperclip, Send, MessageCircle, Bot } from "lucide-react";

export default function ChatWindow({
    selectedCustomer,
    messages,
    messagesEndRef,
    message,
    setMessage,
    sendMessage,
    formatTime,
    onBack,
}) {
    return (
        <div className="flex flex-1 min-w-0 flex-col bg-gray-50 dark:bg-gray-950">
            {/* =====================================================
                EMPTY STATE
            ====================================================== */}

            {!selectedCustomer ? (
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-xs">
                        <div className="w-12 h-12 mx-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-gray-400" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Pilih percakapan
                        </h3>

                        <p className="mt-1 text-[10px] leading-relaxed text-gray-400">
                            Pilih pelanggan dari daftar untuk melihat dan membalas pesan.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* =================================================
                        CHAT HEADER
                    ================================================== */}

                    <header className="h-14 shrink-0 px-3 sm:px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {/* Back mobile */}
                            {onBack && (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="md:hidden w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    aria-label="Kembali"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}

                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[11px] font-semibold">
                                    {(selectedCustomer.userName || "P").charAt(0).toUpperCase()}
                                </div>

                                {selectedCustomer.isOnline && (
                                    <span className="absolute right-[-1px] bottom-[-1px] w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                                )}
                            </div>

                            {/* Customer info */}
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                    {selectedCustomer.userName || "Pelanggan"}
                                </p>

                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                        className={` w-1.5 h-1.5 rounded-full ${selectedCustomer.isOnline ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"} `}
                                    />

                                    <span className="text-[9px] text-gray-400">
                                        {selectedCustomer.isOnline ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            type="button"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            aria-label="Opsi percakapan"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </header>

                    {/* =================================================
                        MESSAGE AREA
                    ================================================== */}

                    <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-5">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center max-w-xs">
                                    <div className="w-9 h-9 mx-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                        <MessageCircle className="w-4 h-4 text-gray-400" />
                                    </div>

                                    <p className="mt-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                                        Belum ada pesan
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400">
                                        Mulai percakapan dengan pelanggan ini.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg, index) => {
                                    const isAdmin = msg.senderRole === "ADMIN";

                                    return (
                                        <div
                                            key={msg.id || index}
                                            className={` flex ${isAdmin ? "justify-end" : "justify-start"} `}
                                        >
                                            <div
                                                className={` max-w-[78%] sm:max-w-[65%] ${isAdmin ? "items-end" : "items-start"} flex flex-col `}
                                            >
                                                <div
                                                    className={` px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] leading-relaxed ${isAdmin ? ` bg-amber-500 text-white rounded-br-sm ` : ` bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-bl-sm `} `}
                                                >
                                                    {/* Agar admin tahu mana yang sudah dijawab bot */}
                                                    {msg.dariBot && (
                                                        <span className="inline-flex items-center gap-1 mb-1.5 px-1.5 py-0.5 rounded bg-white/25 text-[9px] font-semibold">
                                                            <Bot className="w-3 h-3" />
                                                            Balasan otomatis
                                                        </span>
                                                    )}

                                                    <p className="whitespace-pre-wrap break-words">
                                                        {msg.message}
                                                    </p>
                                                </div>

                                                <span
                                                    className={` mt-1 px-1 text-[9px] ${isAdmin ? "text-gray-400" : "text-gray-400"} `}
                                                >
                                                    {formatTime(msg.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* =================================================
                        MESSAGE COMPOSER
                    ================================================== */}

                    <div className="shrink-0 px-3 sm:px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            {/* Attachment */}
                            <button
                                type="button"
                                className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition"
                                aria-label="Lampirkan file"
                            >
                                <Paperclip className="w-4 h-4" />
                            </button>

                            {/* Input */}
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Tulis pesan..."
                                className="flex-1 min-w-0 h-8 px-1 bg-transparent text-xs text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
                            />

                            {/* Send */}
                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={!message.trim()}
                                className="w-8 h-8 shrink-0 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                                aria-label="Kirim pesan"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <p className="mt-1.5 text-[9px] text-gray-400 px-1">
                            Tekan Enter untuk mengirim
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
