import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { formatCurrency } from '../utils/format'

// product-spec §14: mock market price ranges — reference renders this as a
// grid of bordered cards, not a table.
export default function MarketPriceTable({ ranges }) {
  return (
    <Grid container spacing={1.5}>
      {ranges.map((range) => (
        <Grid item key={range.name} xs={6} sm={4} md={3}>
          <Paper variant="outlined" sx={{ p: '16px', borderRadius: '12px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{range.name}</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 15, color: 'primary.dark', mt: 0.5 }}>
              {formatCurrency(range.low)} – {formatCurrency(range.high)}/{range.unit}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
