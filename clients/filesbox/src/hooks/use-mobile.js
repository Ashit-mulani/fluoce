import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export const useBelow850 = () => {
  const [isBelow, setIsBelow] = useState(undefined);

  useEffect(() => {
    const update = () => setIsBelow(window.innerWidth < 850);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isBelow;
};

export const useBelow500 = () => {
  const [isBelow, setIsBelow] = useState(undefined);

  useEffect(() => {
    const update = () => setIsBelow(window.innerWidth < 500);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isBelow;
};
