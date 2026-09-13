import Box from '@mui/material/Box'

// Small pill badge matching the reference's table status indicators (e.g.
// My Produce §29 "Available"). `tone` picks a bg/text color pair; add more
// tones here if a new status needs a distinct color.
const TONES = {
  green: { bg: '#d3f5db', color: '#00481e' },
  neutral: { bg: '#eef0ea', color: '#5b6559' },
  orange: { bg: '#fbe6d4', color: '#8a4a12' },
  blue: { bg: '#dfeaf7', color: '#1c4a73' },
}

export default function StatusBadge({ children, tone = 'green' }) {
  const { bg, color } = TONES[tone] ?? TONES.neutral
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        bgcolor: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        px: 1,
        py: '3px',
        borderRadius: '6px',
      }}
    >
      {children}
    </Box>
  )
}
