import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Link from '@mui/material/Link'
import StatCard from '../../components/StatCard'
import LoadingState from '../../components/LoadingState'
import OrderStatusChip from '../../components/OrderStatusChip'
import { useAuth } from '../../context/AuthContext'
import { getDashboardStats, getFairPriceInsights, getInventorySummary } from '../../services/farmerService'
import { getOrderLinesForFarmerId } from '../../services/orderService'
import { formatCurrency, formatQuantity } from '../../utils/format'

const sectionHeadingSx = { fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '17px', mb: '12px' }
const itemCardSx = { p: '14px', borderRadius: '12px' }

// product-spec §28: stat tiles, recent orders, current inventory, fair price
// insights and a demand-forecast widget (§59 — UI-only, never sets price).
export default function FarmerDashboard() {
  const { user } = useAuth()
  const farmerId = user?.linkedId
  const [stats, setStats] = useState(null)
  const [fairPrice, setFairPrice] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [recentLines, setRecentLines] = useState(null)

  useEffect(() => {
    getDashboardStats(farmerId).then(setStats)
    getFairPriceInsights(farmerId).then(setFairPrice)
    getInventorySummary(farmerId).then(setInventory)
    getOrderLinesForFarmerId(farmerId).then((lines) => setRecentLines(lines.slice(0, 5)))
  }, [farmerId])

  if (!stats) return <LoadingState message="Loading your dashboard..." />

  return (
    <Stack spacing={3.5}>
      <Stack spacing={0.5}>
        <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '24px' }}>
          Welcome back, {user?.name}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
          Here's how your produce is performing.
        </Typography>
      </Stack>

      <Grid container spacing={'14px'}>
        <Grid item xs={6} md={3}>
          <StatCard label="Total Produce Listed" value={formatQuantity(stats.totalProduceListedKg, 'kg')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Available Inventory" value={formatQuantity(stats.availableInventoryKg, 'kg')} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Active Orders" value={stats.activeOrders} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Completed Orders" value={stats.completedOrders} />
        </Grid>
      </Grid>

      <Grid container spacing={'14px'}>
        <Grid item xs={12} sm={6}>
          <StatCard label="Total Earnings" value={formatCurrency(stats.totalEarnings)} valueColor="primary.dark" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard label="Pending Payments" value={formatCurrency(stats.pendingPayments)} valueColor="secondary.main" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography sx={sectionHeadingSx}>Fair Price Intelligence</Typography>
          {fairPrice && fairPrice.length === 0 && (
            <Typography color="text.secondary">List produce to see fair price insights.</Typography>
          )}
          <Stack spacing={'10px'}>
            {fairPrice?.map((insight) => (
              <Paper key={insight.productId} variant="outlined" sx={itemCardSx}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.5 }}>{insight.name}</Typography>
                <Typography sx={{ fontSize: '12.5px', color: 'text.secondary' }}>
                  Market Range: {formatCurrency(insight.marketLow)}–{formatCurrency(insight.marketHigh)}/kg ·
                  Suggested Fair: {formatCurrency(insight.suggestedLow)}–{formatCurrency(insight.suggestedHigh)}/kg
                </Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 0.5 }}>
                  Your Price: {formatCurrency(insight.yourPrice)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography sx={sectionHeadingSx}>Demand Forecast</Typography>
          <Paper variant="outlined" sx={itemCardSx}>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Onion Demand</Typography>
            <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', my: 0.5 }}>
              Expected next week
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'secondary.main' }}>↑ 28%</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>High demand expected</Typography>
          </Paper>
          <Link component={RouterLink} to="/farmer/demand" sx={{ mt: 1.5, display: 'inline-block' }}>
            View Demand Board →
          </Link>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Recent Orders
            </Typography>
            {recentLines && recentLines.length === 0 && (
              <Typography color="text.secondary">No orders yet.</Typography>
            )}
            {recentLines && recentLines.length > 0 && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLines.map((line) => (
                    <TableRow key={`${line.orderId}-${line.productId}`}>
                      <TableCell>{line.orderId}</TableCell>
                      <TableCell>{line.buyerName}</TableCell>
                      <TableCell align="right">{formatCurrency(line.total)}</TableCell>
                      <TableCell>
                        <OrderStatusChip status={line.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Link component={RouterLink} to="/farmer/orders" sx={{ mt: 1.5, display: 'inline-block' }}>
              View All Orders →
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Current Inventory
            </Typography>
            {inventory && (
              <Stack spacing={1}>
                <Typography variant="body2">Total stock: {formatQuantity(inventory.total, 'kg')}</Typography>
                <Typography variant="body2">Available: {formatQuantity(inventory.available, 'kg')}</Typography>
                <Typography variant="body2">Reserved: {formatQuantity(inventory.reserved, 'kg')}</Typography>
                <Typography variant="body2">Sold: {formatQuantity(inventory.sold, 'kg')}</Typography>
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
