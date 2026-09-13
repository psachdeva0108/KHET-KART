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
import { getFpoProfile } from '../../services/fpoService'
import { updateMyProfile } from '../../services/profileService'

// product-spec §23/§35: FPO's own registration details, editable here. Mock
// save only — no backend yet (§63).
export default function FpoAccountProfile() {
  const { user } = useAuth()
  const [fpo, setFpo] = useState(null)
  useEffect(() => { if (user?.linkedId) getFpoProfile(user.linkedId).then(setFpo) }, [user?.linkedId])
  const [form, setForm] = useState({
    name: fpo?.name ?? '',
    representative: fpo?.representative ?? '',
    email: user?.email ?? '',
    location: fpo ? `${fpo.location.city}, ${fpo.location.state}` : '',
    memberCount: fpo?.memberCount ?? '',
  })
  useEffect(() => { if (fpo) { setForm({ name: fpo.name ?? '', representative: fpo.representative ?? '', email: user?.email ?? '', location: fpo.location ? `${fpo.location.city || ''}, ${fpo.location.state || ''}`.replace(/^, |, $/g, '') : '', memberCount: fpo.memberCount ?? '' }) } }, [fpo, user?.email])
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
        {fpo?.verified && <VerifiedBadge label="Verified FPO" />}
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="FPO Name" value={form.name} onChange={updateField('name')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Authorized Representative"
                value={form.representative}
                onChange={updateField('representative')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" value={form.email} onChange={updateField('email')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Location" value={form.location} onChange={updateField('location')} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Members"
                type="number"
                value={form.memberCount}
                onChange={updateField('memberCount')}
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
