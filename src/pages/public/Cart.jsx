import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import EmptyState from '../../components/EmptyState'
import { computeCheckoutFees } from '../../utils/pricing'
import { formatCurrency } from '../../utils/format'
import { MIN_ORDER_KG, meetsMinimumOrder, minimumOrderMessage } from '../../utils/orderRules'
import ConsumerLocationButton from '../../components/ConsumerLocationButton'

export default function Cart() {
  const { groupedByFarmer, produceTotal, updateQuantity, removeItem } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  if (!groupedByFarmer.length) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ mb: 1 }}>Your Cart</Typography>
          <EmptyState message="Your cart is empty. Browse the marketplace to add produce." />
          <Button component={RouterLink} to="/marketplace" variant="contained">Explore Marketplace</Button>
        </Paper>
      </Container>
    )
  }

  const isPremium = Boolean(user?.isPremium)
  const { deliveryFee, platformFee, total } = computeCheckoutFees(produceTotal, groupedByFarmer.length, isPremium)
  const minimumOrderViolations = groupedByFarmer.flatMap((group) =>
    group.items.filter((item) => !meetsMinimumOrder(item.quantity, item.product.unit))
  )

  function proceedToPayment() {
    setError('')
    if (minimumOrderViolations.length) {
      setError(minimumOrderViolations.map((item) => minimumOrderMessage(item.product)).join(' '))
      return
    }
    navigate('/payment')
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 3 }} spacing={1}>
          <Typography variant="h4">Your Cart</Typography>
          <Typography variant="body2" color="text.secondary">{groupedByFarmer.reduce((n, g) => n + g.items.length, 0)} item(s) from {groupedByFarmer.length} farmer(s)</Typography>
        </Stack>

        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.65fr) minmax(310px, .75fr)' }, gap: 2 }}>
          <Stack spacing={1.5}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShippingOutlinedIcon color="primary" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800 }}>Deliver to</Typography>
                  <Typography variant="body2" color="text.secondary">Use your saved consumer address or add a new delivery address.</Typography>
                  {user?.consumerLocation?.city && (
                    <Typography variant="body2" sx={{ mt: .5, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.consumerLocation.address ? `${user.consumerLocation.address}, ` : ''}{user.consumerLocation.city}{user.consumerLocation.state ? `, ${user.consumerLocation.state}` : ''}{user.consumerLocation.pincode ? ` - ${user.consumerLocation.pincode}` : ''}
                    </Typography>
                  )}
                </Box>
                <ConsumerLocationButton cartMode />
              </Stack>
            </Paper>

            {groupedByFarmer.map((group) => (
              <Paper variant="outlined" sx={{ overflow: 'hidden' }} key={group.farmer?.id ?? 'unknown'}>
                <Box sx={{ px: 2, py: 1.5, bgcolor: 'rgba(4,119,59,.035)', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontWeight: 800 }}>{group.farmer?.name ?? 'Unknown Farmer'}</Typography>
                  {group.farmer?.farmName && <Typography variant="caption" color="text.secondary">{group.farmer.farmName}</Typography>}
                </Box>

                <Stack divider={<Divider />}>
                  {group.items.map((item) => (
                    <Box key={item.product.id} sx={{ p: 2 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <Box
                          component="img"
                          src={item.product.image}
                          alt=""
                          sx={{ width: 82, height: 72, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 800 }}>{item.product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Grade {item.product.qualityGrade} · {item.product.availableQuantity.toLocaleString('en-IN')} {item.product.unit} available
                          </Typography>
                          <Typography sx={{ color: 'primary.dark', fontWeight: 800, mt: .5 }}>
                            {formatCurrency(item.product.price)}/{item.product.unit}
                          </Typography>
                        </Box>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" color="text.secondary">Qty</Typography>
                          <TextField
                            type="number"
                            size="small"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.product.id, Number(e.target.value) || 0)}
                            inputProps={{ min: 1, max: item.product.availableQuantity, style: { width: 38, textAlign: 'center' } }}
                          />
                          <Typography sx={{ minWidth: 90, textAlign: 'right', fontWeight: 900 }}>
                            {formatCurrency(item.quantity * item.product.price)}
                          </Typography>
                          <IconButton size="small" onClick={() => removeItem(item.product.id)} aria-label={`Remove ${item.product.name}`}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={2} sx={{ mt: 1.5, ml: { sm: 10 } }}>
                        <Button size="small" startIcon={<BookmarkBorderOutlinedIcon fontSize="small" />} sx={{ color: 'text.secondary' }}>Save for later</Button>
                        <Button size="small" color="inherit" onClick={() => removeItem(item.product.id)}>Remove</Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Stack spacing={1.5}>
            <Paper variant="outlined" sx={{ p: 2.5, position: { md: 'sticky' }, top: { md: 16 } }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Price Details</Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Produce Cost</Typography>
                  <Typography>{formatCurrency(produceTotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Delivery Fee</Typography>
                  <Typography>{isPremium ? 'Free' : formatCurrency(deliveryFee)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Platform Fee</Typography>
                  <Typography>{formatCurrency(platformFee)}</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 900 }}>{formatCurrency(total)}</Typography>
                </Stack>
              </Stack>

              <Chip
                icon={<SecurityOutlinedIcon />}
                label="Safe and secure checkout"
                sx={{ mt: 2, width: '100%', bgcolor: 'rgba(4,119,59,.08)', color: 'primary.dark', fontWeight: 700 }}
              />

              <Button fullWidth size="large" variant="contained" onClick={proceedToPayment} sx={{ mt: 2, py: 1.4 }}>
                Proceed to Payment
              </Button>

              {!isAuthenticated && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  You can review your cart now; login is required to place the order.
                </Typography>
              )}
            </Paper>

            {minimumOrderViolations.length > 0 && (
              <Alert severity="warning">
                Minimum order quantity is {MIN_ORDER_KG} kg per product.
              </Alert>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
