import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Lightweight horizontal bar chart — no charting library, just flex/CSS.
// rows: [{ label, value, sublabel? }]
export default function HorizontalBarChart({ rows, unit = 'kg', barColor = '#04773b' }) {
  const maxValue = Math.max(...rows.map((r) => r.value), 1)

  return (
    <Stack spacing={1.75}>
      {rows.map((row) => (
        <Box key={row.label}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.5 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: 'text.primary' }}>
              {row.label}
            </Typography>
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'text.secondary' }}>
              {row.value.toLocaleString('en-IN')} {unit}
            </Typography>
          </Stack>
          <Box sx={{ height: 9, borderRadius: 999, bgcolor: '#eef1e9', overflow: 'hidden' }}>
            <Box
              sx={{
                height: '100%',
                width: `${(row.value / maxValue) * 100}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}cc 100%)`,
                transition: 'width 0.6s ease',
              }}
            />
          </Box>
          {row.sublabel && (
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: 0.4 }}>{row.sublabel}</Typography>
          )}
        </Box>
      ))}
    </Stack>
  )
}
