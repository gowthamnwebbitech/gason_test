// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Custom hook that delays the update of a value until after a specified time.
 * Perfect for search inputs to prevent excessive API calls.
 *
 * @template T - The type of the value being debounced.
 * @param {T} value - The state value to debounce.
 * @param {number} delay - The delay in milliseconds (e.g., 500).
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update the value
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup function: clears the timer if value or delay changes,
    // or if the component unmounts.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}