import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import { usePremiumMock } from '../context/PremiumContext'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

const BENEFITS = [
  { icon: TrendingUpIcon, title: 'Priority allocation', body: 'First in line for high-demand produce before it sells out.' },
  { icon: LocalShippingIcon, title: 'Lower delivery fee', body: 'A reduced delivery fee on every order, automatically applied.' },
  { icon: NotificationsActiveIcon, title: 'Demand-forecast alerts', body: 'Get notified when prices or supply for your favorites shift.' },
]

// Shared AgriPlus Premium modal. The upgrade CTA goes to the existing
// Premium payment page; the active state comes from the authenticated user.
export default function PremiumUpgradeModal() {
  const { isPremium, modalOpen, closeModal } = usePremiumMock()
  const navigate = useNavigate()

  function handleUpgrade() {
    closeModal()
    // The payment page sends signed-out users to login and preserves the destination.
    navigate('/premium/payment')
  }

  return (
    <Dialog open={modalOpen} onClose={closeModal} maxWidth="xs" fullWidth>
      <Box
        sx={{
          position: 'relative',
          p: '28px 24px 22px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #053e1d 0%, #04773b 55%, #dd7b2b 140%)',
          color: '#fff',
          overflow: 'hidden',
          '@keyframes premiumGlow': {
            '0%, 100%': { boxShadow: '0 0 24px 4px rgba(221,123,43,0.35)' },
            '50%': { boxShadow: '0 0 36px 10px rgba(221,123,43,0.55)' },
          },
        }}
      >
        <IconButton
          onClick={closeModal}
          aria-label="Close"
          sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1.5,
            animation: 'premiumGlow 2.2s ease-in-out infinite',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '20px' }}>
          AgriPlus Premium
        </Typography>
        <Typography sx={{ fontSize: '13px', opacity: 0.9, mt: 0.5 }}>
          {formatCurrency(299)} / month · explore what you unlock
        </Typography>
      </Box>

      <DialogContent sx={{ p: '22px 24px 26px' }}>
        <Stack spacing={2} sx={{ mb: 2.5 }}>
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <Stack key={title} direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '9px',
                  bgcolor: 'rgba(4,119,59,0.1)',
                  color: 'primary.dark',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon fontSize="small" />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'primary.darker' }}>{title}</Typography>
                <Typography sx={{ fontSize: '12.5px', color: 'text.secondary' }}>{body}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>

        {isPremium ? (
          <Box
            sx={{
              width: '100%',
              textAlign: 'center',
              p: '12px',
              borderRadius: '9px',
              bgcolor: '#d3f5db',
              color: '#00481e',
              fontWeight: 700,
              fontSize: '13.5px',
            }}
          >
            ✓ Premium Active
          </Box>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpgrade}
            sx={{
              padding: '12px',
              borderRadius: '9px',
              fontSize: 14.5,
              fontWeight: 700,
              background: 'linear-gradient(90deg, #04773b, #dd7b2b)',
              '&:hover': { background: 'linear-gradient(90deg, #036030, #c46b23)' },
            }}
          >
            Upgrade Now
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}
