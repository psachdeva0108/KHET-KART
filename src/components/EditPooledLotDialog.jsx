import { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { getProductNames } from '../services/fpoService'

const QUALITY_GRADES = ['A+', 'A', 'B']

export default function EditPooledLotDialog({ open, onClose, lot, onSave }) {
  const [productName, setProductName] = useState('')
  const [qualityGrade, setQualityGrade] = useState('A')
  const [salePrice, setSalePrice] = useState('')
  const [productNames, setProductNames] = useState([])

  useEffect(() => {
    if (!lot) return
    setProductName(lot.productName ?? '')
    setQualityGrade(lot.qualityGrade ?? 'A')
    setSalePrice(lot.salePrice ?? '')
  }, [lot])

  useEffect(() => {
    if (!open) return
    let active = true
    getProductNames()
      .then((names) => { if (active) setProductNames(Array.isArray(names) ? names : []) })
      .catch(() => { if (active) setProductNames([]) })
    return () => { active = false }
  }, [open])

  function handleSubmit(e) {
    e.preventDefault()
    onSave({ productName, qualityGrade, salePrice: Number(salePrice) })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Pooled Lot</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
                  <MenuItem key={name} value={name}>{name}</MenuItem>
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
                {QUALITY_GRADES.map((grade) => <MenuItem key={grade} value={grade}>{grade}</MenuItem>)}
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
