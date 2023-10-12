import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(
  enabled: boolean,
  options: IntersectionObserverInit,
): {
  intersected: boolean;
  ref: React.MutableRefObject<null>;
} {
  const ref = useRef(null);
  const [intersected, setIntersected] = useState(false);
  const { root, rootMargin, threshold } = options;

  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          console.log(`intersected`);
          setIntersected(entry.isIntersecting);
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        });
      },
      { root, rootMargin, threshold },
    );

    if (ref.current) observer.observe(ref.current);

    const cur = ref.current;

    return () => {
      if (cur) observer.unobserve(cur);
    };
  }, [ref, root, rootMargin, threshold, enabled]);

  return { intersected, ref };
}
