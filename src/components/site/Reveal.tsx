import { useEffect, useRef, useState } from 'react'
import type { PropsWithChildren, HTMLAttributes, ElementType } from 'react'

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType
}

export function Reveal({ children, className = '', as: Tag = 'div', ...rest }: PropsWithChildren<RevealProps>) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setInView(true)),
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref as any} className={`reveal ${inView ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
