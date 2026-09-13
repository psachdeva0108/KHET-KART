import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// Reusable stat tile used across the Farmer/FPO/Consumer dashboards
// (product-spec §28, §36, §45).
export default function StatCard({ label, value, valueColor, valueFontSize = 22 }) {
  return (
    <Paper variant="outlined" sx={{ p: '16px', borderRadius: '12px', height: '100%' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: valueFontSize, fontWeight: 800, color: valueColor ?? 'primary.darker' }}>
        {value}
      </Typography>
    </Paper>
  )
}
