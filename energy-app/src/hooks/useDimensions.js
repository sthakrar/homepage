// useDimensions.js - measures an element and keeps its width and height up
// to date as it resizes. Every Responsive* chart wrapper uses it:
//
//   const ref = useRef(null);
//   const { width, height } = useDimensions(ref);
//   <div ref={ref}>{width > 0 && <Chart width={width} height={height} />}</div>
//
// ResizeObserver catches every size change (window resize, the grid
// reflowing, fonts loading), not only window resizes.
import { useEffect, useState } from "react";

export function useDimensions(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.floor(width), height: Math.floor(height) });
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
