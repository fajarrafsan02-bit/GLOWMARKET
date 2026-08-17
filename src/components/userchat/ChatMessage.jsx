import { Bot } from "lucide-react";

function formatTime(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ChatMessage({ msg, isMe }) {
    return (
        <div className={` flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in-up `}>
            <div
                className={` flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[75%] `}
            >
                {/* Message bubble */}
                <div
                    className={` px-3.5 py-2.5 text-[13px] sm:text-sm leading-relaxed break-words ${isMe ? ` bg-amber-500 text-white rounded-2xl rounded-br-md ` : ` bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md `} `}
                >
                    {/* Image */}
                    {msg.image && (
                        <img
                            src={msg.image}
                            alt="Attachment"
                            loading="lazy"
                            className="max-w-full max-h-72 object-cover rounded-xl mb-2.5"
                        />
                    )}

                    {/* Penanda bahwa ini dijawab mesin, bukan admin */}
                    {msg.dariBot && (
                        <span className="inline-flex items-center gap-1 mb-1.5 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            <Bot className="w-3 h-3" />
                            Balasan otomatis
                        </span>
                    )}

                    {/* Text */}
                    {msg.message && (
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    )}
                </div>

                {/* Time */}
                <span
                    className={` mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500 ${isMe ? "text-right" : "text-left"} `}
                >
                    {formatTime(msg.createdAt)}
                </span>
            </div>
        </div>
    );
}
