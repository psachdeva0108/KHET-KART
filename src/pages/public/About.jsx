import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

// product-spec §4: core positioning — not "Online Mandi", not "Amazon for
// Farmers" — and §80: final product philosophy.
const AUDIENCES = [
  {
    title: 'For Farmers',
    points: [
      'Direct access to buyers',
      'Better price visibility',
      'No unnecessary intermediary layers',
      'Farmer-controlled listing price',
      'Demand visibility',
      'Transparent earnings',
      'Public reputation',
    ],
  },
  {
    title: 'For Consumers',
    points: [
      'Compare multiple farmers',
      'Find the lowest/best listed price',
      'Compare quality, ratings and distance',
      'See harvest information',
      'Purchase directly through the platform',
      'Find previous farmers again through public profiles',
    ],
  },
  {
    title: 'For FPOs',
    points: [
      'Aggregate supply',
      'Fulfill bulk orders',
      'Manage farmers',
      'Create pooled lots',
      'Coordinate logistics',
      'Track farmer contributions',
    ],
  },
]

export default function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontSize: '2.2rem', mb: 2 }}>
        About KHET2KART
      </Typography>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        A transparent, demand-driven agricultural marketplace connecting consumers and bulk
        buyers directly with verified farmers and FPOs.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 760 }}>
       KHET2KART is a technology-driven agricultural marketplace that connects farmers, consumers, FPOs, and logistics providers through a transparent and efficient digital platform. By enabling direct trade, the platform helps farmers reach wider markets, secure fair pricing, and reduce dependency on intermediaries. KHET2KART also empowers buyers with access to quality produce, competitive prices, and reliable supply chain support.
      </Typography>

      <Grid container spacing={3}>
        {AUDIENCES.map((section) => (
          <Grid item key={section.title} xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1.5 }}>
                {section.title}
              </Typography>
              {section.points.map((point) => (
                <Typography key={point} variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                  • {point}
                </Typography>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
