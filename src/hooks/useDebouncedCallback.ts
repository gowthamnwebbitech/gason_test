// src/hooks/useDebouncedCallback.ts
import { useCallback, useRef } from 'react';

/**
 * Custom hook that debounces a function call.
 * Useful for button clicks, window resizing, or scrolling events.
 *
 * @param {(...args: any[]) => void} callback - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns A memoized, debounced version of the callback.
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  // FIX: Dynamically infer the timeout type based on the environment
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      // Clear the previous timer if the function is called again
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timer
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}