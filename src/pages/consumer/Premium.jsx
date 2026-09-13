import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/format'

const BENEFITS = [
  'Free standard delivery',
  'Priority delivery & support',
  'Faster farmer matching',
  'Advanced market insights',
  'Premium-only offers',
]

// product-spec §45/§57: consumer's own Premium status, with a mock
// activate/cancel toggle — no real payment.
export default function ConsumerPremium() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isPremium = Boolean(user?.isPremium)

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', textAlign: 'center', pt: '16px' }}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '26px', mb: '20px' }}>
        AgriPlus Premium
      </Typography>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '16px',
          p: '28px',
        }}
      >
        <Typography sx={{ fontSize: 32, fontWeight: 800, color: 'primary.dark' }}>
          {formatCurrency(299)}
          <Box component="span" sx={{ fontSize: 14, fontWeight: 600, color: 'text.secondary' }}>
            /month
          </Box>
        </Typography>

        <Box
          component="ul"
          sx={{ textAlign: 'left', fontSize: 14, lineHeight: 2, color: 'text.primary', my: '20px', pl: '20px' }}
        >
          {BENEFITS.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </Box>

        {isPremium ? (
          <>
            <Box sx={{ p: '12px', borderRadius: '9px', bgcolor: '#d3f5db', color: '#00481e', fontWeight: 700 }}>
              ✓ Premium Active
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {user?.premiumRenewalDate ? `Renews on ${new Date(user.premiumRenewalDate).toLocaleDateString('en-IN')}` : 'Premium active'}
            </Typography>
            <Button variant="contained" size="small" onClick={() => navigate('/premium/payment?mode=renew')} sx={{ mt: 1, fontSize: '12.5px' }}>
              Renew Premium
            </Button>
          </>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/premium/payment')}
            sx={{ padding: '12px', borderRadius: '9px', fontSize: 14 }}
          >
            Activate Premium
          </Button>
        )}
      </Box>
    </Box>
  )
}
