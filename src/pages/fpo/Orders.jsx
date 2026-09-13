import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import IconStatCard from '../../components/IconStatCard'
import LoadingState from '../../components/LoadingState'
import { getDemand } from '../../services/demandService'
import { formatCurrency, formatQuantity } from '../../utils/format'

// product-spec §42: Bulk Orders — Buyer, Requirement, Quantity, Price,
// Deadline, Status, "Fulfill Requirement". No negotiation: fulfilling means
// aggregating farmer supply at their listed prices into a pooled lot.
export default function FpoOrders() {
  const navigate = useNavigate()
  const [demand, setDemand] = useState(null)

  useEffect(() => {
    getDemand().then(setDemand)
  }, [])

  if (!demand) return <LoadingState message="Loading bulk orders..." />

  const openCount = demand.filter((r) => r.status === 'open').length
  const totalQuantityKg = demand.reduce((sum, r) => sum + Number(r.requiredQuantity || 0), 0)
  const dueSoonCount = demand.filter((r) => {
    const daysLeft = (new Date(r.requiredBy) - Date.now()) / (1000 * 60 * 60 * 24)
    return daysLeft >= 0 && daysLeft <= 7
  }).length

  return (
    <Stack spacing={3}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }}>
        Bulk Orders
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <IconStatCard icon={AssignmentLateIcon} tone="#dd7b2b" label="Open Requirements" value={openCount} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <IconStatCard
            icon={Inventory2Icon}
            tone="#04773b"
            label="Total Quantity Requested"
            value={formatQuantity(totalQuantityKg, 'kg')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <IconStatCard icon={EventBusyIcon} tone="#1c4a73" label="Due Within 7 Days" value={dueSoonCount} />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '14px' }}>
        <DataTable>
        <TableHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell>Requirement</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {demand.map((req) => (
            <TableRow key={req.id}>
              <TableCell sx={{ fontWeight: 700 }}>{req.buyerName}</TableCell>
              <TableCell>{req.productName}</TableCell>
              <TableCell>{formatQuantity(req.requiredQuantity, req.unit)}</TableCell>
              <TableCell>
                {formatCurrency(req.preferredPriceLow)}–{formatCurrency(req.preferredPriceHigh)}
              </TableCell>
              <TableCell>
                {new Date(req.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </TableCell>
              <TableCell>
                <StatusBadge tone="orange">{req.status}</StatusBadge>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    navigate('/fpo/pooled-lots', {
                      state: { prefillProduct: req.productName, targetQuantity: req.requiredQuantity },
                    })
                  }
                >
                  Fulfill Requirement
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </DataTable>
      </Paper>
    </Stack>
  )
}
