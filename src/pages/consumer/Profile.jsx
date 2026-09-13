import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile } from '../../services/profileService'

// product-spec §24: consumer's own registration details, editable here.
// Mock save only — no backend yet (§63).
export default function ConsumerProfile() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    location: '',
  })
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
      <Typography variant="h4">Profile</Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" value={form.name} onChange={updateField('name')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" value={form.email} onChange={updateField('email')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone" value={form.phone} onChange={updateField('phone')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" value={form.location} onChange={updateField('location')} fullWidth />
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
