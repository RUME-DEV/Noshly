
import { useEffect, useRef, useState } from 'react'

function Reveal({
    children,
    className = '',
    animation = 'moveUp',
    duration = '1s',
}) {
    const elementRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = elementRef.current

        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(element)
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px',
            }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={elementRef}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                animation: isVisible
                    ? `${animation} ${duration} ease forwards`
                    : 'none',
            }}
        >
            {children}
        </div>
    )
}

export default Reveal
