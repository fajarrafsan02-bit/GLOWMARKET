import { Send, Paperclip } from "lucide-react";

import ChatQuickReplies from "./ChatQuickReplies.jsx";

export default function ChatInput({
    message,
    setMessage,
    sendMessage,
    isConnected,
    quickReplies,
}) {
    const handleSubmit = () => {
        if (!message.trim()) return;
        sendMessage();
    };

    const lineCount = Math.min(4, Math.max(1, String(message).split("\n").length));

    return (
        <div className="px-3 sm:px-4 py-3 bg-white dark:bg-gray-900">
            <ChatQuickReplies replies={quickReplies} onSelect={setMessage} />

            {/* Connection status */}
            {!isConnected && (
                <div className="mb-2 flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Koneksi realtime terputus, pesan tetap dapat dikirim.
                </div>
            )}

            <div className="flex items-end gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                {/* Attachment */}
                <button
                    type="button"
                    disabled
                    className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    title="Lampiran belum tersedia"
                    aria-label="Lampiran"
                >
                    <Paperclip className="w-4 h-4" />
                </button>

                {/* Message input */}
                <textarea
                    rows={lineCount}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    placeholder="Tulis pesan..."
                    className="flex-1 min-h-9 max-h-24 py-2 resize-none overflow-y-auto bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                />

                {/* Send */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    className="w-9 h-9 shrink-0 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 text-white flex items-center justify-center transition-all active:scale-95 disabled:cursor-not-allowed"
                    title={isConnected ? "Kirim pesan" : "Kirim melalui koneksi fallback"}
                    aria-label="Kirim pesan"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
