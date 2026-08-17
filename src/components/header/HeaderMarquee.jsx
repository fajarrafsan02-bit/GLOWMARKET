import { Sparkles } from "lucide-react";

export default function HeaderMarquee({ messages = [] }) {
    if (!messages.length) return null;

    return (
        <div className="relative bg-amber-500 dark:bg-amber-600 overflow-hidden">
            <div className="h-8 flex items-center">
                <div className="animate-marquee whitespace-nowrap flex items-center">
                    {[...messages, ...messages].map((msg, i) => (
                        <span key={i} className="mx-6 inline-flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-white/70 shrink-0" />

                            <span className="text-[10px] sm:text-[11px] font-medium text-white tracking-wide">
                                {msg}
                            </span>

                            <span className="text-white/40 text-[10px]">•</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
