import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import RankedShareBars from '../../components/RankedShareBars'
import { formatCurrency, formatQuantity } from '../../utils/format'

// Modern FPO analytics dashboard. Structure mirrors a reference layout the
// user shared (KPI strip, recent-activity table, ranked-share chart with a
// tooltip, status counters, top-items table) but every figure and label
// below is KHET2KART's own — bulk orders, pooled lots, farmer supply — and
// the theme is the app's existing green/cream palette throughout.
// Hardcoded mock data, local component state only.

const PERIODS = ['This Week', 'This Month', 'This Quarter']

const KPI_BY_PERIOD = {
  'This Week': {
    registeredFarmers: { value: 86, deltaPct: 4, up: true },
    availableSupplyKg: { value: 6100, deltaPct: 12, up: true },
    activePooledLots: { value: 7, deltaPct: 8, up: false },
    activeOrders: { value: 14, deltaPct: 18, up: true },
  },
  'This Month': {
    registeredFarmers: { value: 92, deltaPct: 9, up: true },
    availableSupplyKg: { value: 24800, deltaPct: 16, up: true },
    activePooledLots: { value: 11, deltaPct: 5, up: true },
    activeOrders: { value: 38, deltaPct: 22, up: true },
  },
  'This Quarter': {
    registeredFarmers: { value: 104, deltaPct: 21, up: true },
    availableSupplyKg: { value: 71200, deltaPct: 3, up: false },
    activePooledLots: { value: 19, deltaPct: 14, up: true },
    activeOrders: { value: 96, deltaPct: 31, up: true },
  },
}

const RECENT_BULK_ORDERS = [
  { id: '#BO-3312', buyer: 'Metro Wholesale Traders', requirement: 'Onion', quantity: 1200, unit: 'kg', priceLow: 20, priceHigh: 24, status: 'Fulfilled' },
  { id: '#BO-3318', buyer: 'Sunrise Retail Chain', requirement: 'Wheat', quantity: 3000, unit: 'kg', priceLow: 28, priceHigh: 31, status: 'Open' },
  { id: '#BO-3305', buyer: 'GreenBasket Exports', requirement: 'Tomato', quantity: 800, unit: 'kg', priceLow: 24, priceHigh: 27, status: 'Fulfilled' },
  { id: '#BO-3327', buyer: 'Nationwide Mandi Co.', requirement: 'Potato', quantity: 1500, unit: 'kg', priceLow: 16, priceHigh: 19, status: 'Pending' },
  { id: '#BO-3294', buyer: 'Coastal Foods Ltd.', requirement: 'Grapes', quantity: 450, unit: 'kg', priceLow: 45, priceHigh: 52, status: 'Expired' },
]

const STATUS_TONE = {
  Fulfilled: 'green',
  Open: 'orange',
  Pending: 'orange',
  Expired: 'neutral',
}

const CATEGORY_DEMAND_SHARE = [
  { label: 'Wheat', value: 3200, shareOfDemand: 34 },
  { label: 'Onion', value: 2100, shareOfDemand: 24 },
  { label: 'Tomato', value: 1450, shareOfDemand: 18 },
  { label: 'Potato', value: 900, shareOfDemand: 14 },
  { label: 'Grapes', value: 420, shareOfDemand: 10 },
]

const POOLED_LOT_STATUS = [
  { label: 'Collecting', count: 5, icon: HourglassBottomIcon, tone: '#dd7b2b' },
  { label: 'Ready for Dispatch', count: 3, icon: LocalShippingIcon, tone: '#1c4a73' },
  { label: 'Dispatched', count: 21, icon: CheckCircleIcon, tone: '#04773b' },
]

const TOP_PRODUCE = [
  { product: 'Onion (Rajesh Kumar)', unitsSoldKg: 4820, revenue: 108450 },
  { product: 'Wheat (Anil Sharma)', unitsSoldKg: 3910, revenue: 121280 },
  { product: 'Tomato (Lakshmi Devi)', unitsSoldKg: 2260, revenue: 58760 },
  { product: 'Potato (Rajesh Kumar)', unitsSoldKg: 1780, revenue: 32040 },
  { product: 'Grapes (Suresh Patil)', unitsSoldKg: 640, revenue: 30720 },
]

function KpiCard({ label, value, deltaPct, up, formatter }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 30, fontWeight: 800, color: 'primary.darker', mt: 0.5, mb: 1 }}>
        {formatter ? formatter(value) : value.toLocaleString('en-IN')}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        {up ? (
          <TrendingUpIcon sx={{ fontSize: 16, color: '#04773b' }} />
        ) : (
          <TrendingDownIcon sx={{ fontSize: 16, color: '#dd7b2b' }} />
        )}
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: up ? '#04773b' : '#dd7b2b' }}>
          {deltaPct}% {up ? 'more' : 'less'} than last period
        </Typography>
      </Stack>
    </Paper>
  )
}

export default function FpoAnalytics() {
  const [period, setPeriod] = useState('This Month')
  const kpis = KPI_BY_PERIOD[period]

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" rowGap={1.5}>
        <Box>
          <Typography variant="h4">Analytics Overview</Typography>
          <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
            Supply, demand and pooled-lot activity across your FPO
          </Typography>
        </Box>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 160, borderRadius: '10px', bgcolor: 'background.paper' }}
        >
          {PERIODS.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}>
          <KpiCard label="Registered Farmers" {...kpis.registeredFarmers} />
        </Grid>
        <Grid item xs={6} md={3}>
          <KpiCard
            label="Available Supply"
            {...kpis.availableSupplyKg}
            formatter={(v) => formatQuantity(v, 'kg')}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KpiCard label="Active Pooled Lots" {...kpis.activePooledLots} />
        </Grid>
        <Grid item xs={6} md={3}>
          <KpiCard label="Active Bulk Orders" {...kpis.activeOrders} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Recent Bulk Orders</Typography>
            <DataTable>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Requirement</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {RECENT_BULK_ORDERS.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell sx={{ color: 'text.secondary' }}>{order.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{order.buyer}</TableCell>
                    <TableCell>
                      {order.requirement} · {formatQuantity(order.quantity, order.unit)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={STATUS_TONE[order.status]}>{order.status}</StatusBadge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.priceLow)}–{formatCurrency(order.priceHigh)}/{order.unit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Category Demand Share</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              Tap a bar to see its share of total demand
            </Typography>
            <RankedShareBars
              rows={CATEGORY_DEMAND_SHARE}
              valueLabel={(row) => `${row.shareOfDemand}% share · ${formatQuantity(row.value, 'kg')}`}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Pooled Lot Status</Typography>
            <Grid container spacing={1.5}>
              {POOLED_LOT_STATUS.map(({ label, count, icon: Icon, tone }) => (
                <Grid item xs={4} key={label}>
                  <Stack alignItems="center" spacing={0.75} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: `${tone}1a`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon sx={{ color: tone, fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.darker' }}>
                      {count}
                    </Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{label}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Top Produce</Typography>
            <DataTable>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Units Sold</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {TOP_PRODUCE.map((row) => (
                  <TableRow key={row.product}>
                    <TableCell sx={{ fontWeight: 700 }}>{row.product}</TableCell>
                    <TableCell>{formatQuantity(row.unitsSoldKg, 'kg')}</TableCell>
                    <TableCell>{formatCurrency(row.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
