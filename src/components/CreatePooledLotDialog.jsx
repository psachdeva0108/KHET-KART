import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { getSupplyForProduct, getProductNames } from '../services/fpoService'
import { formatCurrency, formatQuantity } from '../utils/format'

const QUALITY_GRADES = ['A+', 'A', 'B']

// product-spec §38: supply aggregation — combine several farmers' available
// supply of one product into a single pooled lot for a bulk requirement.
export default function CreatePooledLotDialog({ open, onClose, onCreate, initialProduct, targetQuantity }) {
  const [productName, setProductName] = useState(initialProduct ?? '')
  const [qualityGrade, setQualityGrade] = useState('A')
  const [salePrice, setSalePrice] = useState('')
  const [supply, setSupply] = useState([])
  const [productNames, setProductNames] = useState([])
  const [contributions, setContributions] = useState({})

  useEffect(() => {
    let active = true
    getProductNames()
      .then((names) => {
        if (active) setProductNames(Array.isArray(names) ? names : [])
      })
      .catch(() => {
        if (active) setProductNames([])
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!productName) {
      setSupply([])
      return
    }
    getSupplyForProduct(productName).then((rows) => {
      setSupply(rows)
      setContributions({})
    })
  }, [productName])

  const total = Object.values(contributions).reduce((sum, q) => sum + (Number(q) || 0), 0)
  const fulfilled = targetQuantity ? total >= targetQuantity : total > 0

  function updateContribution(farmerId, value, max) {
    const quantity = Math.max(0, Math.min(Number(value) || 0, max))
    setContributions((prev) => ({ ...prev, [farmerId]: quantity }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const selected = Object.entries(contributions)
      .filter(([, quantity]) => quantity > 0)
      .map(([farmerId, quantity]) => ({ farmerId: Number(farmerId), quantity }))
    onCreate({ productName, qualityGrade, salePrice: Number(salePrice), contributions: selected })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Pooled Lot</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5, mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Product"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
                required
              >
                {productNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                select
                label="Quality Grade"
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                fullWidth
              >
                {QUALITY_GRADES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Sale Price (₹/kg)"
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          {targetQuantity && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Requirement: {formatQuantity(targetQuantity, 'kg')}
            </Typography>
          )}

          {productName && supply.length === 0 && (
            <Alert severity="info">No farmers currently list {productName}.</Alert>
          )}

          {supply.length > 0 && (
            <Stack spacing={1.5}>
              {supply.map((row) => (
                <Stack key={row.productId} direction="row" alignItems="center" spacing={2}>
                  <Stack sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{row.farmer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatQuantity(row.availableQuantity, 'kg')} available · Grade {row.qualityGrade}
                    </Typography>
                  </Stack>
                  <TextField
                    size="small"
                    type="number"
                    label="kg"
                    value={contributions[row.farmer.id] ?? ''}
                    onChange={(e) => updateContribution(row.farmer.id, e.target.value, row.availableQuantity)}
                    inputProps={{ min: 0, max: row.availableQuantity, style: { width: 70 } }}
                  />
                </Stack>
              ))}

              <Alert severity={fulfilled ? 'success' : 'info'} sx={{ mt: 1 }}>
                {formatQuantity(total, 'kg')} selected
                {targetQuantity ? ` of ${formatQuantity(targetQuantity, 'kg')} required` : ''}
                {fulfilled && targetQuantity ? ' — ✓ Requirement Fulfilled' : ''}
                {salePrice && total > 0 ? ` · Final Order: ${formatCurrency(total * Number(salePrice))}` : ''}
              </Alert>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={total === 0 || !salePrice}>
            Create Pooled Lot
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
