import { useState, useMemo } from "react";

export default function useWindowSize() {
  const [size, setSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useMemo(() => {
    window.addEventListener("resize", () => {
      setSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });
  }, []);
  return size;
}
