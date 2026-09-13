import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { getDemand } from '../../services/demandService'
import { formatCurrency, formatQuantity } from '../../utils/format'

// product-spec §32: buyer demand requirements — informational only, feeds
// straight into "Add Produce" so the farmer can list against it. No
// negotiation: the farmer still sets their own price when they list.
export default function DemandBoard() {
  const navigate = useNavigate()
  const [demand, setDemand] = useState(null)

  useEffect(() => {
    getDemand().then(setDemand)
  }, [])

  if (!demand) return <LoadingState message="Loading demand board..." />

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Demand Board</Typography>
      <Typography color="text.secondary">
        Buyer requirements across the platform — use this to decide what to list next.
      </Typography>

      {demand.length === 0 && <EmptyState message="No open buyer requirements right now." />}

      <Grid container spacing={2}>
        {demand.map((req) => (
          <Grid item key={req.id} xs={12} sm={6} md={4}>
            <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
              <Typography variant="h6">{req.productName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Required
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {formatQuantity(req.requiredQuantity, req.unit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preferred Price: {formatCurrency(req.preferredPriceLow)}–{formatCurrency(req.preferredPriceHigh)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Location: {req.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Required By: {new Date(req.requiredBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/farmer/produce', { state: { prefillProduct: req.productName } })}
              >
                List Suitable Produce
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
