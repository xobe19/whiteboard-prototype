import { useState, useMemo } from "react";

export default function useWindowSize() {
  const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
  useMemo(() => {
    window.addEventListener("resize", () => {
      setSize([window.innerHeight, window.innerWidth]);
    });
  }, []);
  return size;
}
