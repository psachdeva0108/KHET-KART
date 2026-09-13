import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Ranked horizontal bars where the top (or tapped) bar shows a small
// floating tooltip pill with its share + amount — click any bar to move
// the tooltip there. Bars decrease in shade by rank, matching the
// reference image's demographic chart, but in brand green.
export default function RankedShareBars({ rows, valueLabel = (row) => `${row.value}` }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const maxValue = Math.max(...rows.map((r) => r.value), 1)
  const shades = ['#04773b', '#2f9159', '#7fc199', '#bfe0cc', '#dcefe3']

  return (
    <Stack spacing={2.25} sx={{ pt: 2 }}>
      {rows.map((row, i) => {
        const widthPct = Math.max((row.value / maxValue) * 100, 6)
        const isActive = i === activeIndex
        return (
          <Box key={row.label} sx={{ position: 'relative' }}>
            {isActive && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -34,
                  left: `${widthPct}%`,
                  transform: 'translateX(-50%)',
                  bgcolor: '#053e1d',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: '8px',
                  px: 1.1,
                  py: 0.6,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 6px 16px rgba(5,62,29,0.3)',
                  zIndex: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderWidth: '5px',
                    borderStyle: 'solid',
                    borderColor: '#053e1d transparent transparent transparent',
                  },
                }}
              >
                {valueLabel(row)}
              </Box>
            )}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, width: 96, flexShrink: 0 }}>
                {row.label}
              </Typography>
              <Box
                onClick={() => setActiveIndex(i)}
                sx={{
                  flex: 1,
                  height: 16,
                  borderRadius: 999,
                  bgcolor: '#eef1e9',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    width: `${widthPct}%`,
                    borderRadius: 999,
                    bgcolor: shades[Math.min(i, shades.length - 1)],
                    transition: 'width 0.6s ease',
                  }}
                />
              </Box>
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}
