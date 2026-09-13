import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import SavingsIcon from '@mui/icons-material/Savings'
import { formatCurrency } from '../utils/format'

// Hardcoded reference basket — direct-from-farmer price actually paid on
// KHET2KART vs. the typical middleman/mandi retail price for the same
// produce and quantity. Illustrative, not tied to any real order history.
const SAVINGS_BASKET = [
  { product: 'Tomatoes', quantity: 40, unit: 'kg', directPrice: 22, middlemanPrice: 34 },
  { product: 'Onions', quantity: 25, unit: 'kg', directPrice: 18, middlemanPrice: 28 },
  { product: 'Wheat', quantity: 60, unit: 'kg', directPrice: 26, middlemanPrice: 33 },
  { product: 'Potatoes', quantity: 35, unit: 'kg', directPrice: 15, middlemanPrice: 24 },
  { product: 'Chana Dal', quantity: 20, unit: 'kg', directPrice: 85, middlemanPrice: 105 },
]

const totalSaved = SAVINGS_BASKET.reduce((sum, item) => sum + (item.middlemanPrice - item.directPrice) * item.quantity, 0)
const totalMiddlemanCost = SAVINGS_BASKET.reduce((sum, item) => sum + item.middlemanPrice * item.quantity, 0)
const percentSaved = Math.round((totalSaved / totalMiddlemanCost) * 100)

// Consumer Dashboard + Marketplace — "You've saved ₹X by buying direct from
// farmers", computed from the hardcoded basket above rather than a flat
// invented number.
export default function MiddlemanSavingsBanner() {
  return (
    <Box
      sx={{
        borderRadius: '14px',
        p: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap',
        bgcolor: '#e5f3e8',
        border: '1px solid rgba(4,119,59,0.25)',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: 'rgba(4,119,59,0.14)',
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SavingsIcon />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '17px', color: 'primary.darker' }}>
            You've saved {formatCurrency(totalSaved)} by buying direct from farmers
          </Typography>
          <Typography sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
            ~{percentSaved}% below typical middleman/mandi prices, based on a sample basket
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}
