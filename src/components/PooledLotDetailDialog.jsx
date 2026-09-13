import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Alert from '@mui/material/Alert'
import { formatCurrency, formatQuantity } from '../utils/format'

function farmerName(contribution) { return contribution.farmerName ?? `Farmer #${contribution.farmerId}` }
function totalQuantityOf(lot) { return (lot?.contributions || []).reduce((sum, c) => sum + Number(c.quantity || 0), 0) }

// product-spec §39 (lot details) + §40 (transparent contribution split) +
// §41 (quality verification) + §43 (assign logistics).
export default function PooledLotDetailDialog({ lot, onClose, onVerify, onAssignLogistics }) {
  const [verification, setVerification] = useState(lot?.verification)
  const [logisticsForm, setLogisticsForm] = useState({
    transportPartner: '',
    destination: '',
    deliveryDeadline: '',
  })

  if (!lot) return null

  const total = totalQuantityOf(lot)
  const finalOrder = total * lot.salePrice
  const allVerified =
    verification.quantityVerified && verification.qualityVerified && verification.packagingVerified

  function toggleVerification(field) {
    const next = { ...verification, [field]: !verification[field] }
    setVerification(next)
    onVerify(lot.id, next)
  }

  function handleAssignLogistics(e) {
    e.preventDefault()
    onAssignLogistics(lot.id, logisticsForm)
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Pooled Lot {lot.id} · {lot.productName}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {lot.status === 'pending_verification' ? 'Pending Verification' : lot.status === 'ready_for_pickup' ? 'Ready for Pickup' : lot.status === 'dispatched' ? 'Dispatched' : 'Aggregating'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Grade {lot.qualityGrade} · {formatQuantity(total, 'kg')}
            </Typography>
          </Stack>

          <Divider />

          <Typography variant="subtitle1">Contributions</Typography>
          <Stack spacing={0.75}>
            {lot.contributions.map((c) => (
              <Stack key={c.farmerId} direction="row" justifyContent="space-between">
                <Typography variant="body2">{farmerName(c)}</Typography>
                <Typography variant="body2">{formatQuantity(c.quantity, 'kg')}</Typography>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Typography variant="subtitle1">Transparent Contribution</Typography>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontWeight: 700 }}>Final Order</Typography>
              <Typography sx={{ fontWeight: 700 }}>{formatCurrency(finalOrder)}</Typography>
            </Stack>
            {lot.contributions.map((c) => (
              <Stack key={c.farmerId} direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  {farmerName(c)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(c.quantity * lot.salePrice)}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider />

          <Typography variant="subtitle1">Quality Verification</Typography>
          <Stack>
            <FormControlLabel
              control={
                <Checkbox checked={verification.quantityVerified} onChange={() => toggleVerification('quantityVerified')} />
              }
              label="Quantity Verified"
            />
            <FormControlLabel
              control={
                <Checkbox checked={verification.qualityVerified} onChange={() => toggleVerification('qualityVerified')} />
              }
              label="Quality Verified"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={verification.packagingVerified}
                  onChange={() => toggleVerification('packagingVerified')}
                />
              }
              label="Packaging Verified"
            />
          </Stack>
          {allVerified && <Alert severity="success">FPO Verified — Grade {lot.qualityGrade}</Alert>}

          {allVerified && lot.status !== 'dispatched' && (
            <>
              <Divider />
              <Typography variant="subtitle1">Assign Logistics</Typography>
              {lot.logistics ? (
                <Stack spacing={0.5}>
                  <Typography variant="body2">Transport Partner: {lot.logistics.transportPartner}</Typography>
                  <Typography variant="body2">Destination: {lot.logistics.destination}</Typography>
                  <Typography variant="body2">Deadline: {lot.logistics.deliveryDeadline}</Typography>
                </Stack>
              ) : (
                <Stack component="form" onSubmit={handleAssignLogistics} spacing={1.5}>
                  <TextField
                    label="Transport Partner"
                    size="small"
                    value={logisticsForm.transportPartner}
                    onChange={(e) => setLogisticsForm((p) => ({ ...p, transportPartner: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Destination"
                    size="small"
                    value={logisticsForm.destination}
                    onChange={(e) => setLogisticsForm((p) => ({ ...p, destination: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Delivery Deadline"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={logisticsForm.deliveryDeadline}
                    onChange={(e) => setLogisticsForm((p) => ({ ...p, deliveryDeadline: e.target.value }))}
                    required
                  />
                  <Button type="submit" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
                    Assign Logistics
                  </Button>
                </Stack>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
