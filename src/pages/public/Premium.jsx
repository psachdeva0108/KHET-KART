import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'

const BENEFITS = [
  'Included standard delivery',
  'Standard platform/service fee benefits within plan limits',
  'Priority delivery',
  'Priority support',
  'Faster farmer matching',
  'Advanced market insights',
  'Premium offers',
]

// product-spec §57: AgriPlus Premium — ₹299/month, no real payment.
export default function Premium() {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800 }}>
          AgriPlus Premium
        </Typography>
        <Typography variant="h3" sx={{ fontSize: '2.4rem', my: 1 }}>
          {formatCurrency(299)}
          <Typography component="span" variant="h6" color="text.secondary">
            {' '}
            / month
          </Typography>
        </Typography>

        <List sx={{ textAlign: 'left', mb: 2 }}>
          {BENEFITS.map((benefit) => (
            <ListItem key={benefit} disableGutters>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={benefit} />
            </ListItem>
          ))}
        </List>

        <Stack spacing={1.5}>
          <Button variant="contained" size="large" onClick={() => navigate('/premium/payment')}>
            Buy AgriPlus Premium
          </Button>
          <Typography variant="caption" color="text.secondary">
            Demo prototype — no real payment is processed.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
