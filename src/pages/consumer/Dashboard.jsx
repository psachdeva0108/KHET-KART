import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import StatCard from '../../components/StatCard'
import MiddlemanSavingsBanner from '../../components/MiddlemanSavingsBanner'
import LoadingState from '../../components/LoadingState'
import MarketPriceTable from '../../components/MarketPriceTable'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { usePremiumMock } from '../../context/PremiumContext'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { getOrderGroupsForConsumer } from '../../services/orderService'
import { getProducts, getMarketPriceRanges } from '../../services/productService'
import { ACTIVE_ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../constants'
import { formatCurrency } from '../../utils/format'
import ProductCard from '../../components/ProductCard'

// product-spec §45: stat tiles, recent orders, recommended produce, recently
// purchased farmers, market insights.
export default function ConsumerDashboard() {
  const { user } = useAuth()
  const { wishlist } = useWishlist()
  const { isPremium, openModal } = usePremiumMock()
  const navigate = useNavigate()
  const [groups, setGroups] = useState(null)
  const [recommended, setRecommended] = useState(null)
  const [ranges, setRanges] = useState(null)

  useEffect(() => {
    getOrderGroupsForConsumer(user.id).then(setGroups)
    getProducts({ sortBy: 'recent' }).then((list) => setRecommended(list.slice(0, 3)))
    getMarketPriceRanges().then(setRanges)
  }, [user])

  if (!groups) return <LoadingState message="Loading your dashboard..." />

  const allOrders = groups
    .flatMap((g) => g.orders)
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
  const activeOrders = allOrders.filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length
  const recentOrders = allOrders.slice(0, 3)

  const purchasedFarmers = [...new Map(allOrders.flatMap((o) => o.items.map((i) => i.farmer)).filter(Boolean).map((f) => [f.id, f])).values()]

  return (
    <Stack spacing={3}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '24px' }}>
        Welcome back, {user?.name}
      </Typography>

      <MiddlemanSavingsBanner />

      {!isPremium && (
        <Box
          onClick={openModal}
          sx={{
            cursor: 'pointer',
            borderRadius: '14px',
            p: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexWrap: 'wrap',
            background: 'linear-gradient(120deg, #053e1d 0%, #04773b 55%, #dd7b2b 150%)',
            color: '#fff',
            boxShadow: '0 0 0 1px rgba(221,123,43,0.4), 0 8px 24px rgba(4,119,59,0.25)',
            transition: 'box-shadow 0.2s ease',
            '&:hover': { boxShadow: '0 0 0 1px rgba(221,123,43,0.6), 0 10px 30px rgba(4,119,59,0.35)' },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AutoAwesomeIcon />
            <Box>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '15px' }}>
                Go Premium with AgriPlus
              </Typography>
              <Typography sx={{ fontSize: '12.5px', opacity: 0.9 }}>
                Priority allocation, lower delivery fees, and demand-forecast alerts.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="small"
            sx={{ bgcolor: '#fff', color: 'primary.darker', fontWeight: 700, '&:hover': { bgcolor: '#f2ede2' } }}
          >
            Explore Premium Benefits
          </Button>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard label="ACTIVE ORDERS" value={activeOrders} valueFontSize={26} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="SAVED FARMERS" value={wishlist.farmers.length} valueFontSize={26} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard label="PREMIUM" value={isPremium ? 'Active' : 'Not Active'} valueFontSize={20} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '18px', mb: '14px' }}
            >
              Recent Orders
            </Typography>
            {recentOrders.length === 0 && (
              <Typography color="text.secondary">No orders yet — explore the marketplace.</Typography>
            )}
            <Stack spacing="10px">
              {recentOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    p: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{order.id}</Typography>
                    <Typography sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status} · {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/consumer/orders/${order.id}`)}
                    sx={{ padding: '9px 16px', fontSize: 13 }}
                  >
                    Track
                  </Button>
                </Box>
              ))}
            </Stack>
            <Link component={RouterLink} to="/consumer/orders" sx={{ mt: 2, display: 'inline-block' }}>
              View All Orders →
            </Link>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Recently Purchased Farmers
            </Typography>
            {purchasedFarmers.length === 0 && (
              <Typography color="text.secondary">No purchases yet.</Typography>
            )}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {purchasedFarmers.map((farmer) => (
                <Chip
                  key={farmer.id}
                  label={farmer.name}
                  component={RouterLink}
                  to={`/farmer/${farmer.id}`}
                  clickable
                  variant="outlined"
                />
              ))}
            </Stack>
            <Link component={RouterLink} to="/consumer/farmers" sx={{ mt: 2, display: 'inline-block' }}>
              View My Farmers →
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Recommended Produce
          </Typography>
          <Grid container spacing={2}>
            {recommended?.map((product) => (
              <Grid item key={product.id} xs={12} sm={6}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ mb: 1.5 }}>
            Market Insights
          </Typography>
          {ranges && <MarketPriceTable ranges={ranges} />}
        </Grid>
      </Grid>
    </Stack>
  )
}
