import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import GroupsIcon from '@mui/icons-material/Groups'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import LayersIcon from '@mui/icons-material/Layers'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import IconStatCard from '../../components/IconStatCard'
import StatusBadge from '../../components/StatusBadge'
import HorizontalBarChart from '../../components/HorizontalBarChart'
import LoadingState from '../../components/LoadingState'
import { useAuth } from '../../context/AuthContext'
import { getDashboardStats, getSupplyAnalytics } from '../../services/fpoService'
import { getPooledLots } from '../../services/pooledLotService'
import { getDemand } from '../../services/demandService'
import { formatQuantity } from '../../utils/format'
import { getPooledLotStatusMeta } from '../../utils/pooledLotStatus'

// product-spec §36: stat tiles, recent pooled lots, pending bulk orders and
// supply analytics. Same data/fetching as before — restyled to match the
// Analytics page's visual language (icon-accented tiles, status badges,
// bar chart) rather than the plain stat cards used previously.
export default function FpoDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [lots, setLots] = useState(null)
  const [demand, setDemand] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    getDashboardStats().then(setStats)
    getPooledLots(user?.linkedId).then((all) => setLots(all.slice(0, 3)))
    getDemand().then((all) => setDemand(all.slice(0, 3)))
    getSupplyAnalytics().then(setAnalytics)
  }, [user])

  if (!stats) return <LoadingState message="Loading your dashboard..." />

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Welcome back, {user?.name}</Typography>
        <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: 0.5 }}>
          Here's what's happening across your FPO today
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <IconStatCard icon={GroupsIcon} tone="#04773b" label="Registered Farmers" value={stats.registeredFarmers} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <IconStatCard
            icon={Inventory2Icon}
            tone="#dd7b2b"
            label="Available Supply"
            value={formatQuantity(stats.availableSupplyKg, 'kg')}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <IconStatCard icon={LayersIcon} tone="#1c4a73" label="Active Pooled Lots" value={stats.activePooledLots} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <IconStatCard icon={ShoppingBagIcon} tone="#053e1d" label="Active Orders" value={stats.activeOrders} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1.75 }}>Recent Pooled Lots</Typography>
            <Stack spacing={1.5}>
              {lots?.map((lot) => {
                const meta = getPooledLotStatusMeta(lot.status)
                return (
                  <Stack
                    key={lot.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 1.1, borderRadius: '10px', border: '1px solid #e0e2db' }}
                  >
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {lot.id} · {lot.productName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lot.contributions.reduce((s, c) => s + c.quantity, 0).toLocaleString('en-IN')} kg
                      </Typography>
                    </Stack>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </Stack>
                )
              })}
            </Stack>
            <Link component={RouterLink} to="/fpo/pooled-lots" sx={{ mt: 2, display: 'inline-block', fontWeight: 700 }}>
              View All Pooled Lots →
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px', height: '100%' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1.75 }}>Pending Bulk Orders</Typography>
            <Stack spacing={1.5}>
              {demand?.map((req) => (
                <Stack
                  key={req.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ p: 1.1, borderRadius: '10px', border: '1px solid #e0e2db' }}
                >
                  <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {req.buyerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatQuantity(req.requiredQuantity, req.unit)} {req.productName}
                    </Typography>
                  </Stack>
                  <StatusBadge tone="orange">Open</StatusBadge>
                </Stack>
              ))}
            </Stack>
            <Link component={RouterLink} to="/fpo/orders" sx={{ mt: 2, display: 'inline-block', fontWeight: 700 }}>
              View All Bulk Orders →
            </Link>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px' }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>Supply Analytics</Typography>
            {analytics && (
              <HorizontalBarChart
                rows={analytics.byCategory.map((row) => ({ label: row.category, value: row.totalQuantity }))}
                barColor="#04773b"
              />
            )}
            <Link component={RouterLink} to="/fpo/analytics" sx={{ mt: 2, display: 'inline-block', fontWeight: 700 }}>
              View Full Analytics →
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  )
}
