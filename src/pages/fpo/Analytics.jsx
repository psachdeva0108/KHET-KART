import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import RankedShareBars from '../../components/RankedShareBars'
import LoadingState from '../../components/LoadingState'
import { getDashboardStats } from '../../services/fpoService'
import { useAuth } from '../../context/AuthContext'
import { getPooledLots } from '../../services/pooledLotService'
import { getDemand } from '../../services/demandService'
import { getOrders } from '../../services/orderService'
import { formatCurrency, formatQuantity } from '../../utils/format'

const STATUS_TONE = {
  open: 'orange',
  pending: 'orange',
  fulfilled: 'green',
  closed: 'neutral',
}

function KpiCard({ label, value, formatter }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 30, fontWeight: 800, color: 'primary.darker', mt: 0.5 }}>
        {formatter ? formatter(value) : Number(value || 0).toLocaleString('en-IN')}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mt: 0.75 }}>
        Live data from the connected demo database
      </Typography>
    </Paper>
  )
}

export default function FpoAnalytics() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [lots, setLots] = useState([])
  const [demand, setDemand] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fpoId = user?.linkedId
    if (fpoId === undefined || fpoId === null || fpoId === '') return

    Promise.all([getDashboardStats(), getPooledLots(fpoId), getDemand(), getOrders()])
      .then(([nextStats, nextLots, nextDemand, nextOrders]) => {
        setStats(nextStats)
        setLots(nextLots)
        setDemand(nextDemand)
        setOrders(nextOrders)
      })
      .catch((error) => {
        console.error('Failed to load FPO analytics:', error)
      })
  }, [user?.linkedId])

  const categoryDemand = useMemo(() => {
    const totals = new Map()
    demand.forEach((row) => {
      const name = row.productName || 'Other'
      totals.set(name, (totals.get(name) || 0) + Number(row.requiredQuantity || 0))
    })
    const total = [...totals.values()].reduce((sum, value) => sum + value, 0)
    return [...totals.entries()]
      .map(([label, value]) => ({ label, value, shareOfDemand: total ? Math.round((value / total) * 1000) / 10 : 0 }))
      .sort((a, b) => b.value - a.value)
  }, [demand])

  const topProduce = useMemo(() => {
    const totals = new Map()
    orders
      .filter((order) => order.status === 'delivered')
      .forEach((order) => order.items.forEach((item) => {
        const key = `${item.productName} (${item.farmerName || 'Farmer'})`
        const current = totals.get(key) || { product: key, unitsSoldKg: 0, revenue: 0 }
        const quantityKg = item.unit === 'quintal' ? Number(item.quantity || 0) * 100 : Number(item.quantity || 0)
        current.unitsSoldKg += quantityKg
        current.revenue += Number(item.quantity || 0) * Number(item.price || 0)
        totals.set(key, current)
      }))
    return [...totals.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [orders])

  const pooledStatuses = useMemo(() => {
    const count = (statuses) => lots.filter((lot) => statuses.includes(lot.status)).length
    return [
      { label: 'Pending Verification', count: count(['pending_verification']), icon: HourglassBottomIcon, tone: '#dd7b2b' },
      { label: 'Ready for Dispatch', count: count(['ready_for_pickup']), icon: LocalShippingIcon, tone: '#1c4a73' },
      { label: 'Dispatched', count: count(['dispatched']), icon: CheckCircleIcon, tone: '#04773b' },
    ]
  }, [lots])

  if (!stats) return <LoadingState message="Loading live analytics..." />

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Analytics Overview</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          Supply, demand, orders and pooled-lot activity calculated from the same data used across the FPO dashboard.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} md={3}><KpiCard label="Registered Farmers" value={stats.registeredFarmers} /></Grid>
        <Grid item xs={6} md={3}><KpiCard label="Available Supply" value={stats.availableSupplyKg} formatter={(v) => formatQuantity(v, 'kg')} /></Grid>
        <Grid item xs={6} md={3}><KpiCard label="Active Pooled Lots" value={stats.activePooledLots} /></Grid>
        <Grid item xs={6} md={3}><KpiCard label="Active Orders" value={stats.activeOrders} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Current Demand Requests</Typography>
            <DataTable>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Requirement</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Preferred Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {demand.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.buyerName}</TableCell>
                    <TableCell>{row.productName} · {formatQuantity(row.requiredQuantity, row.unit)}</TableCell>
                    <TableCell><StatusBadge tone={STATUS_TONE[row.status] || 'neutral'}>{row.status}</StatusBadge></TableCell>
                    <TableCell>{formatCurrency(row.preferredPriceLow)}–{formatCurrency(row.preferredPriceHigh)}/{row.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>Demand Share</Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
              Shares are calculated from the quantities in the current demand table.
            </Typography>
            <RankedShareBars rows={categoryDemand} valueLabel={(row) => `${row.shareOfDemand}% share · ${formatQuantity(row.value, 'kg')}`} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Pooled Lot Status</Typography>
            <Grid container spacing={1.5}>
              {pooledStatuses.map(({ label, count, icon: Icon, tone }) => (
                <Grid item xs={4} key={label}>
                  <Stack alignItems="center" spacing={0.75} sx={{ textAlign: 'center' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${tone}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon sx={{ color: tone, fontSize: 20 }} />
                    </Box>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.darker' }}>{count}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{label}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Top Produce by Delivered Revenue</Typography>
            <DataTable>
              <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Units Sold</TableCell><TableCell>Revenue</TableCell></TableRow></TableHead>
              <TableBody>
                {topProduce.map((row) => (
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
