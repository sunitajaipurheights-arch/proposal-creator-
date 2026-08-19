import { useLayoutEffect, useState } from 'react'

/**
 * Scales a fixed-width document (default 900px) down to fit its container,
 * and reports the scaled height so the surrounding layout can reserve space.
 * Never scales above 1 (documents don't grow past their design width).
 *
 * Uses callback refs so measurement works even when the measured nodes mount
 * after the first render (e.g. once async data has loaded).
 *
 * Attach `ref` to the container and `innerRef` to the fixed-width element;
 * apply `transform: scale(scale)` to the inner element and
 * `height: innerHeight * scale` to the container.
 */
export function useFitScale(docWidth = 900) {
  const [outer, setOuter] = useState<HTMLDivElement | null>(null)
  const [inner, setInner] = useState<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)
  const [innerHeight, setInnerHeight] = useState(0)

  useLayoutEffect(() => {
    if (!outer || !inner) return
    const recompute = () => {
      setScale(Math.min(1, outer.clientWidth / docWidth))
      setInnerHeight(inner.scrollHeight)
    }
    const ro = new ResizeObserver(recompute)
    ro.observe(outer)
    ro.observe(inner)
    recompute()
    return () => ro.disconnect()
  }, [outer, inner, docWidth])

  return { ref: setOuter, innerRef: setInner, scale, innerHeight }
}
