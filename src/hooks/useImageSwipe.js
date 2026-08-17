import { useRef } from "react";

const SWIPE_PX = 40;

export default function useImageSwipe({ enabled, onSwipe }) {
    const start = useRef({ x: null, y: null });
    const swiped = useRef(false);
    const clearSwipe = useRef(null);

    const onTouchStart = (event) => {
        const touch = event.changedTouches?.[0];
        start.current = {
            x: touch?.clientX ?? null,
            y: touch?.clientY ?? null,
        };
    };

    const onTouchEnd = (event) => {
        if (!enabled || start.current.x == null) return;

        const touch = event.changedTouches?.[0];
        const dx = (touch?.clientX ?? 0) - start.current.x;
        const dy = (touch?.clientY ?? 0) - start.current.y;
        start.current = { x: null, y: null };

        if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;

        swiped.current = true;
        event.stopPropagation();
        onSwipe(dx < 0 ? 1 : -1, event);

        if (clearSwipe.current) window.clearTimeout(clearSwipe.current);
        clearSwipe.current = window.setTimeout(() => {
            swiped.current = false;
        }, 400);
    };

    const onClickCapture = (event) => {
        if (!swiped.current) return;
        event.preventDefault();
        event.stopPropagation();
        swiped.current = false;
        if (clearSwipe.current) window.clearTimeout(clearSwipe.current);
    };

    return { onTouchStart, onTouchEnd, onClickCapture };
}
