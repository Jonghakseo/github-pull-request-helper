import { EffectCallback, useEffect, useRef } from "react";

type EffectCallbackReturn = ReturnType<EffectCallback>;
type CustomEffectCallback = (currentUrl: string) => EffectCallbackReturn;

export default function useUrlChangeEffect(effect: CustomEffectCallback): void {
  const currentUrlRef = useRef<string>();
  const cleanUpRef = useRef<EffectCallbackReturn>();

  useEffect(() => {
    // check current url via set interval
    const interval = setInterval(() => {
      const url = window.location.href;
      if (url === currentUrlRef.current) {
        return;
      }
      currentUrlRef.current = url;
      if (typeof cleanUpRef.current === "function") {
        cleanUpRef.current();
      }
      cleanUpRef.current = effect(url);
    }, 500);

    // clean up
    return () => {
      clearInterval(interval);
      if (typeof cleanUpRef.current === "function") {
        cleanUpRef.current();
      }
    };
  }, []);
}
