import { useEffect, useState } from "react";

/**
 * Delays propagating `value` until it has stopped changing for `delay` ms.
 * Used to keep a keystroke from issuing a request (or a full-list refilter)
 * on every character typed.
 */
export default function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
