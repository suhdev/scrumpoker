import { IResizeEntry } from "@blueprintjs/core";
import { useState, useCallback } from "react";

export function useResize() {
  const [width, setWidth] = useState(320);

  const onResize = useCallback(
    (entries: IResizeEntry[]) => {
      setWidth(entries[0].contentRect.width);
    },
    [setWidth]
  );

  return {
    onResize,
    width,
  };
}
