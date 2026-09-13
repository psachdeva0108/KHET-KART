import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
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
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrdersFromCart } from '../../services/orderService'
import { computeCheckoutFees } from '../../utils/pricing'
import { formatCurrency } from '../../utils/format'
import { MIN_ORDER_KG, meetsMinimumOrder, minimumOrderMessage } from '../../utils/orderRules'

const paymentMethods = [
  { value: 'upi', label: 'UPI', detail: 'Pay securely using any UPI app', icon: <PaymentsOutlinedIcon /> },
  { value: 'card', label: 'Cards', detail: 'Credit or debit card', icon: <CreditCardOutlinedIcon /> },
  { value: 'bank', label: 'Net Banking', detail: 'Pay directly from your bank', icon: <AccountBalanceOutlinedIcon /> },
]

export default function Payment() {
  const { groupedByFarmer, produceTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [method, setMethod] = useState('upi')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const deliveryAddress = user?.consumerLocation

  const violations = groupedByFarmer.flatMap((group) =>
    group.items.filter((item) => !meetsMinimumOrder(item.quantity, item.product.unit))
  )

  if (!groupedByFarmer.length) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1 }}>Your cart is empty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Add some fresh produce before continuing to payment.</Typography>
          <Button component={RouterLink} to="/marketplace" variant="contained">Explore Marketplace</Button>
        </Paper>
      </Container>
    )
  }

  const isPremium = Boolean(user?.isPremium)
  const { deliveryFee, platformFee, total } = computeCheckoutFees(produceTotal, groupedByFarmer.length, isPremium)

  async function placeOrder() {
    if (!isAuthenticated) {
      navigate('/login?redirect=/payment')
      return
    }
    if (user.role !== 'consumer') {
      setError('Checkout is available for consumer accounts.')
      return
    }
    if (violations.length) {
      setError(violations.map((item) => minimumOrderMessage(item.product)).join(' '))
      return
    }

    if (!deliveryAddress?.city) {
      setError('Please add a delivery address in your cart before placing the order.')
      navigate('/cart')
      return
    }

    setError('')
    setPlacing(true)
    try {
      const { groupId } = await createOrdersFromCart({
        consumerId: user.id,
        buyerName: user.name,
        groupedByFarmer,
        deliveryFee,
        platformFee,
        paymentMethod: method,
        deliveryAddress,
      })
      clearCart()
      navigate(`/consumer/orders?highlight=${groupId}`)
    } catch (e) {
      setError(e.message || 'Order could not be placed.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: 'text.primary', fontWeight: 800 }}>
            Back
          </Button>
          <Stack direction="row" spacing={0.7} alignItems="center" sx={{ color: 'primary.dark', fontWeight: 800 }}>
            <LockOutlinedIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 800 }}>100% Secure Checkout</Typography>
          </Stack>
        </Stack>

        <Typography variant="h4" sx={{ mb: 3 }}>Complete Payment</Typography>

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in as a consumer to place this order. Your cart will remain saved.
          </Alert>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.6fr) minmax(300px, .8fr)' }, gap: 2 }}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Payment options</Typography>
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              <Stack spacing={1.2}>
                {paymentMethods.map((item) => (
                  <Paper
                    key={item.value}
                    variant="outlined"
                    sx={{
                      p: 1.7,
                      borderRadius: 2,
                      borderColor: method === item.value ? 'primary.main' : 'divider',
                      bgcolor: method === item.value ? 'rgba(4,119,59,.04)' : 'background.paper',
                    }}
                  >
                    <FormControlLabel
                      value={item.value}
                      control={<Radio color="primary" />}
                      sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      label={
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: .2 }}>
                          <Box sx={{ color: 'primary.main', display: 'flex' }}>{item.icon}</Box>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>{item.label}</Typography>
                            <Typography variant="body2" color="text.secondary">{item.detail}</Typography>
                          </Box>
                        </Stack>
                      }
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>

            <Divider sx={{ my: 3 }} />
            <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Deliver to</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {deliveryAddress?.address ? `${deliveryAddress.address}, ` : ''}{deliveryAddress?.city || 'Address not added'}{deliveryAddress?.state ? `, ${deliveryAddress.state}` : ''}{deliveryAddress?.pincode ? ` - ${deliveryAddress.pincode}` : ''}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <LockOutlinedIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Your payment information is protected. No card details are stored by KHET2KART in this demo.
              </Typography>
            </Stack>
          </Paper>

          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: '#f1f6ff' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Price Details</Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Produce cost</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(produceTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Delivery fee</Typography>
                <Typography sx={{ fontWeight: 700 }}>{isPremium ? 'Free' : formatCurrency(deliveryFee)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Platform fee</Typography>
                <Typography sx={{ fontWeight: 700 }}>{formatCurrency(platformFee)}</Typography>
              </Stack>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">Total Amount</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{formatCurrency(total)}</Typography>
              </Stack>
            </Stack>

            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(46,160,95,.10)' }}>
              <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>Fresh produce, directly from farmers</Typography>
              <Typography variant="body2" color="text.secondary">Delivery estimates are shown after your order is placed.</Typography>
            </Box>

            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={placeOrder}
              disabled={placing || violations.length > 0}
              sx={{ mt: 2.5, py: 1.5, fontSize: 16 }}
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
