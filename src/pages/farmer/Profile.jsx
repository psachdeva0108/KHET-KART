import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import VerifiedBadge from '../../components/VerifiedBadge'
import { useAuth } from '../../context/AuthContext'
import { getFarmerProfile } from '../../services/farmerService'
import { updateMyProfile } from '../../services/profileService'

// product-spec §22/§27: farmer's own registration details, editable here.
// Normalize crops because the API/database may return JSON text instead of an array.
function normalizeCrops(value) {
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  const text = value.trim()
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Fall back to the comma-separated format used by the profile form.
  }
  return text.split(',').map((crop) => crop.trim()).filter(Boolean)
}

export default function FarmerAccountProfile() {
  const { user } = useAuth()
  const [farmer, setFarmer] = useState(null)
  useEffect(() => { if (user?.linkedId) getFarmerProfile(user.linkedId).then(setFarmer) }, [user?.linkedId])
  const [form, setForm] = useState({
    name: farmer?.name ?? '',
    farmName: farmer?.farmName ?? '',
    email: user?.email ?? '',
    location: farmer ? `${farmer.location.city}, ${farmer.location.state}` : '',
    crops: normalizeCrops(farmer?.crops).join(', '),
  })
  useEffect(() => { if (farmer) { setForm({ name: farmer.name ?? '', farmName: farmer.farmName ?? '', email: user?.email ?? '', location: farmer.location ? `${farmer.location.city || ''}, ${farmer.location.state || ''}`.replace(/^, |, $/g, '') : '', crops: normalizeCrops(farmer.crops).join(', ') }) } }, [farmer, user?.email])
    const [saved, setSaved] = useState(false)

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await updateMyProfile(form)
    setSaved(true)
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="h4">Profile</Typography>
        {farmer?.verified && <VerifiedBadge label="Verified Farmer" />}
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" value={form.name} onChange={updateField('name')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Farm Name" value={form.farmName} onChange={updateField('farmName')} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" value={form.email} onChange={updateField('email')} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Location" value={form.location} onChange={updateField('location')} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Crops"
                value={form.crops}
                onChange={updateField('crops')}
                helperText="Comma separated"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            Save Changes
          </Button>
        </Stack>
      </Paper>

      <Snackbar open={saved} autoHideDuration={3000} onClose={() => setSaved(false)}>
        <Alert severity="success" onClose={() => setSaved(false)}>
          Profile updated.
        </Alert>
      </Snackbar>
    </Stack>
  )
}
