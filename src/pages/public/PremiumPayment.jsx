import { useState } from 'react'
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import { useAuth } from '../../context/AuthContext'
import { purchasePremium } from '../../services/premiumService'
import { formatCurrency } from '../../utils/format'

const methods = [
  { value: 'upi', label: 'UPI', detail: 'Pay securely using any UPI app', icon: <PaymentsOutlinedIcon /> },
  { value: 'card', label: 'Cards', detail: 'Credit or debit card', icon: <CreditCardOutlinedIcon /> },
  { value: 'bank', label: 'Net Banking', detail: 'Pay directly from your bank', icon: <AccountBalanceOutlinedIcon /> },
]

export default function PremiumPayment() {
  const { user, applyPremiumUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const renew = new URLSearchParams(location.search).get('mode') === 'renew'
  const [method, setMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  async function pay() {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(renew ? '/premium/payment?mode=renew' : '/premium/payment')}`)
      return
    }
    if (user.role !== 'consumer') {
      setError('AgriPlus Premium is available for consumer accounts.')
      return
    }
    setError('')
    setProcessing(true)
    try {
      const result = await purchasePremium(method, renew)
      applyPremiumUser(result.user)
      navigate('/consumer/premium')
    } catch (e) {
      setError(e.message || 'Premium payment could not be completed.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: 'text.primary', fontWeight: 800, mb: 2 }}>
          Back
        </Button>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {renew ? 'Renew AgriPlus Premium' : 'AgriPlus Premium Payment'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.6fr) minmax(300px, .8fr)' }, gap: 2 }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Payment options</Typography>
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              <Stack spacing={1.2}>
                {methods.map((item) => (
                  <Paper key={item.value} variant="outlined" sx={{ p: 1.7, borderRadius: 2, borderColor: method === item.value ? 'primary.main' : 'divider', bgcolor: method === item.value ? 'rgba(4,119,59,.04)' : 'background.paper' }}>
                    <FormControlLabel value={item.value} control={<Radio color="primary" />} sx={{ width: '100%', m: 0 }} label={<Stack direction="row" spacing={1.5} alignItems="center"><Box sx={{ color: 'primary.main', display: 'flex' }}>{item.icon}</Box><Box><Typography sx={{ fontWeight: 800 }}>{item.label}</Typography><Typography variant="body2" color="text.secondary">{item.detail}</Typography></Box></Stack>} />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={1} alignItems="center">
              <LockOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">No real card or bank details are stored by this demo.</Typography>
            </Stack>
          </Paper>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Premium plan</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Plan</Typography><Typography sx={{ fontWeight: 700 }}>AgriPlus Premium</Typography></Stack>
              <Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">Duration</Typography><Typography>1 month</Typography></Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between"><Typography variant="h6">Amount</Typography><Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{formatCurrency(299)}</Typography></Stack>
            </Stack>
            <Button fullWidth size="large" variant="contained" onClick={pay} disabled={processing} sx={{ mt: 2.5, py: 1.5 }}>
              {processing ? 'Processing...' : renew ? 'Pay & Renew Premium' : 'Pay & Activate Premium'}
            </Button>
            {!user && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>Log in as a consumer to continue.</Typography>}
            {user?.role !== 'consumer' && user && <Button component={RouterLink} to="/" size="small" sx={{ mt: 1 }}>Back to Home</Button>}
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
