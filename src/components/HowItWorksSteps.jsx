import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// product-spec §15: the six-step journey, shared by the homepage section
// and the standalone /how-it-works page. No negotiation anywhere.
export const HOW_IT_WORKS_STEPS = [
  { title: 'Search Produce', body: 'Look up a crop, farmer or FPO in the marketplace search.' },
  { title: 'Compare Farmers', body: 'Compare listed price, quality grade, rating and distance side by side.' },
  { title: 'Choose Your Listing', body: 'Pick the listing that best fits your budget and needs — no bargaining required.' },
  { title: 'Place Order', body: 'Add quantities from one or more farmers to your cart and check out.' },
  { title: 'Track Delivery', body: 'Follow your order from pickup through to delivery on a live timeline.' },
  { title: 'Rate Your Experience', body: 'Rate quality, freshness and packaging to keep the marketplace honest.' },
]

export default function HowItWorksSteps() {
  return (
    <Grid container spacing={2}>
      {HOW_IT_WORKS_STEPS.map((step, index) => (
        <Grid item key={step.title} xs={12} sm={6} md={4}>
          <Paper variant="outlined" sx={{ p: '18px', borderRadius: '12px', height: '100%' }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13,
                mb: '10px',
              }}
            >
              {index + 1}
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 0.5 }}>{step.title}</Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.5 }}>
              {step.body}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
