import React, { ForwardedRef, MutableRefObject } from "react";

export function useMergedRef<T extends HTMLElement>(
  forwardedRef: ForwardedRef<T>,
  internalRef: MutableRefObject<T | null>
): (elem: T | null) => void {
  return React.useCallback(
    (elem: T | null): void => {
      internalRef.current = elem;

      if (typeof forwardedRef === "function") {
        forwardedRef(elem);
      } else if (forwardedRef !== null) {
        forwardedRef.current = elem;
      }
    },
    [forwardedRef, internalRef]
  );
}
