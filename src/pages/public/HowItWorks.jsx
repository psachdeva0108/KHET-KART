import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import HowItWorksSteps from '../../components/HowItWorksSteps'

// product-spec §15: no mention of negotiation anywhere on this page.
export default function HowItWorks() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontSize: '2.2rem', mb: 1 }}>
        How It Works
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
        A transparent, six-step journey from search to a rated delivery — every price you see is
        the price you pay.
      </Typography>
      <HowItWorksSteps />
    </Container>
  )
}
