import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { getCategories } from '../services/productService'

const QUALITY_GRADES = ['A+', 'A', 'B']
const UNITS = ['kg', 'quintal']

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

const emptyForm = (defaults = {}) => ({
  name: defaults.name ?? '',
  category: defaults.category ?? 'Vegetables',
  quantity: defaults.quantity ?? '',
  unit: defaults.unit ?? 'kg',
  price: defaults.price ?? '',
  qualityGrade: 'A',
  harvestDate: todayIso(),
  availabilityDate: todayIso(),
  location: defaults.location ?? '',
  image: '',
})

// product-spec §29: "+ Add Produce" form. The farmer's listed price here is
// exactly what consumers see — there is no negotiation step afterward.
export default function AddProduceDialog({ open, onClose, onAdd, defaults, isEditing = false }) {
  const [form, setForm] = useState(() => emptyForm(defaults))

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onAdd({
      ...form,
      quantity: Number(form.quantity),
      price: Number(form.price),
      image: form.image,
    })
    setForm(emptyForm())
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Produce' : 'Add Produce'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Product" value={form.name} onChange={updateField('name')} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={updateField('category')}
                fullWidth
              >
                {getCategories().map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={updateField('quantity')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField select label="Unit" value={form.unit} onChange={updateField('unit')} fullWidth>
                {UNITS.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                label="Listed Price (₹)"
                type="number"
                value={form.price}
                onChange={updateField('price')}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                select
                label="Quality Grade"
                value={form.qualityGrade}
                onChange={updateField('qualityGrade')}
                fullWidth
              >
                {QUALITY_GRADES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Harvest Date"
                type="date"
                value={form.harvestDate}
                onChange={updateField('harvestDate')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Availability Date"
                type="date"
                value={form.availabilityDate}
                onChange={updateField('availabilityDate')}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" value={form.location} onChange={updateField('location')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField type="file" InputLabelProps={{ shrink: true }} fullWidth inputProps={{accept:'image/*'}} onChange={(e)=>{const f=e.target.files?.[0]; if(f){const r=new FileReader(); r.onload=()=>setForm(prev=>({...prev,image:r.result})); r.readAsDataURL(f)}}} helperText={form.image ? 'Image selected' : 'Upload crop image'} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEditing ? 'Save Changes' : 'Publish Listing'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
