// src/useDebounce.js
import { useState, useEffect, useCallback } from "react";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetValue = useCallback(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  useEffect(() => {
    const cleanUp = debouncedSetValue();
    return cleanUp;
  }, [value, delay, debouncedSetValue]);

  return debouncedValue;
};

export default useDebounce;

