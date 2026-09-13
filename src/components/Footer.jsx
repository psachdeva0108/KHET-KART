import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: 'white', mt: 8, py: 5 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              KHET२KART
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 420 }}>
              A transparent, demand-driven agricultural marketplace connecting consumers and
              bulk buyers directly with verified farmers and FPOs.
            </Typography>
          </Box>
          <Stack direction="row" spacing={3}>
            <Link component={RouterLink} to="/marketplace" color="inherit" underline="hover">
              Marketplace
            </Link>
            <Link component={RouterLink} to="/how-it-works" color="inherit" underline="hover">
              How It Works
            </Link>
            <Link component={RouterLink} to="/about" color="inherit" underline="hover">
              About
            </Link>
            <Link component={RouterLink} to="/premium" color="inherit" underline="hover">
              Premium
            </Link>
          </Stack>
        </Stack>
        <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, mt: 3 }}>
          © {new Date().getFullYear()} KHET२KART. All Copyright Deserved
        </Typography>
      </Container>
    </Box>
  )
}
