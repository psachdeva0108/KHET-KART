import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'

// Background image layer for the landing-page hero:
// 1) Auto-cycles through `slides` with a slow crossfade + subtle Ken-Burns
//    zoom, independent of scroll.
// 2) Separately, the whole layer's opacity/translateY is driven by scroll
//    position so it gradually disappears over the first ~90% of the hero's
//    height as the user scrolls down, revealing the page content beneath.
//
// Local state only — no external libraries, no persisted state.
const DEFAULT_SLIDES = [
  
  {
    src: '/hero-images/02-farmer-field.png',
    alt: 'Farmer standing in a green vegetable field',
  },
  {
    src: '/hero-images/03-fresh-vegetables.png',
    alt: 'Fresh assorted vegetables ready for market',
  },
  {
    src: '/hero-images/04-produce-market.png',
    alt: 'Fresh fruits and vegetables displayed at a produce market',
  },
]

const SLIDE_INTERVAL_MS = 4800

export default function HeroSlideshow({ slides = DEFAULT_SLIDES, heightPx = 560 }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [scrollShift, setScrollShift] = useState(0)
  const containerRef = useRef(null)

  // Auto-cycle slides
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  // Fade + lift the whole layer out as the user scrolls past the hero
  useEffect(() => {
    function handleScroll() {
      const fadeDistance = heightPx * 0.9
      const scrolled = window.scrollY
      const nextOpacity = Math.max(0, 1 - scrolled / fadeDistance)
      const nextShift = Math.min(scrolled * 0.35, heightPx * 0.35)
      setScrollOpacity(nextOpacity)
      setScrollShift(nextShift)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [heightPx])

  return (
    <Box
      ref={containerRef}
      aria-hidden="true"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: heightPx,
        overflow: 'hidden',
        opacity: scrollOpacity,
        transform: `translateY(${scrollShift}px)`,
        pointerEvents: 'none',
        transition: 'opacity 0.1s linear',
      }}
    >
      {slides.map((slide, i) => (
        <Box
          key={slide.src}
          component="img"
          src={slide.src}
          alt={slide.alt}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: i === activeIndex ? 1 : 0,
            transform: i === activeIndex ? 'scale(1.06)' : 'scale(1)',
            transition: 'opacity 1.6s ease, transform 6s ease-out',
          }}
        />
      ))}

      {/* Brand-toned overlay so hero text stays legible over any slide */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(5,62,29,0.66) 0%, rgba(4,119,59,0.42) 48%, rgba(251,248,241,0.86) 88%, #fbf8f1 100%)',
        }}
      />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '7px',
          }}
        >
          {slides.map((slide, i) => (
            <Box
              key={slide.src}
              sx={{
                width: i === activeIndex ? 22 : 7,
                height: 7,
                borderRadius: 999,
                bgcolor: i === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.45)',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}
