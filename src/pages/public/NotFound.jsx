import { Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2" color="primary.main" sx={{ fontWeight: 800 }}>
          404
        </Typography>
        <Typography variant="h6">Page not found.</Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Home
        </Button>
      </Stack>
    </Container>
  )
}
