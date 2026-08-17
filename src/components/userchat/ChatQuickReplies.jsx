export default function ChatQuickReplies({ replies, onSelect }) {
    if (!replies?.length) return null;

    return (
        <div className="mb-2 -mx-0.5 overflow-x-auto">
            <div className="flex gap-2 pb-0.5 min-h-11" role="list" aria-label="Pesan cepat">
                {replies.map((reply) => (
                    <button
                        key={reply.id}
                        type="button"
                        role="listitem"
                        onClick={() => onSelect(reply.text)}
                        className="shrink-0 h-9 min-w-[44px] px-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-200 hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                    >
                        {reply.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
