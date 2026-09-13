import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = { farmer: '/farmer', fpo: '/fpo', consumer: '/consumer' }
const ROLES = ['farmer', 'fpo', 'consumer']
const ROLE_LABELS = { farmer: 'Farmer', fpo: 'FPO', consumer: 'Consumer' }

const initialFormState = {
  name: '',
  farmName: '',
  fpoName: '',
  representative: '',
  email: '',
  aadhaar: '',
  password: '',
  phone: '',
  location: '',
  crops: '',
  memberCount: '',
  registrationInfo: '',
}

// product-spec §22-24: farmer/FPO/consumer registration, each with its own
// field set. Farmer Aadhaar and OTP verification are mock/demo only.
export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('farmer')
  const [form, setForm] = useState(initialFormState)
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const needsOtp = role === 'consumer' || role === 'farmer'
  // OTP/captcha are demo-only verification controls. They must not prevent
  // account creation when the required registration fields are valid.
  const canSubmit = Boolean(
    (role === 'fpo' ? form.fpoName : form.name) &&
    (role === 'farmer' ? form.aadhaar.length === 12 : form.email) &&
    form.password && form.phone.length === 10 && form.location
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const name = role === 'fpo' ? form.fpoName : form.name
      const user = await register({
        role,
        name,
        email: role === 'farmer' ? null : form.email,
        aadhaar: role === 'farmer' ? form.aadhaar : null,
        password: form.password,
        farmName: form.farmName,
        fpoName: form.fpoName,
        representative: form.representative,
        phone: form.phone,
        location: form.location,
        crops: form.crops.split(',').map((crop) => crop.trim()).filter(Boolean),
        memberCount: form.memberCount,
        registrationInfo: form.registrationInfo,
      })
      navigate(ROLE_HOME[user.role])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create account. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Join KHET२KART
      </Typography>

      <Paper variant="outlined">
        <Tabs
          value={role}
          onChange={(_, value) => setRole(value)}
          variant="fullWidth"
          sx={{ borderBottom: '1px solid #e0e2db' }}
        >
          {ROLES.map((r) => (
            <Tab key={r} value={r} label={ROLE_LABELS[r]} />
          ))}
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Stack spacing={2}>
            {role === 'farmer' && (
              <>
                <TextField label="Name" value={form.name} onChange={updateField('name')} required />
                <TextField
                  label="Farm Name"
                  value={form.farmName}
                  onChange={updateField('farmName')}
                />
              </>
            )}

            {role === 'fpo' && (
              <>
                <TextField
                  label="FPO Name"
                  value={form.fpoName}
                  onChange={updateField('fpoName')}
                  required
                />
                <TextField
                  label="Authorized Representative"
                  value={form.representative}
                  onChange={updateField('representative')}
                  required
                />
              </>
            )}

            {role === 'consumer' && (
              <TextField label="Name" value={form.name} onChange={updateField('name')} required />
            )}

            {role === 'farmer' ? (
              <TextField
                label="Aadhaar Number"
                value={form.aadhaar}
                onChange={(e) => setForm((prev) => ({ ...prev, aadhaar: e.target.value.replace(/\D/g, '') }))}
                inputProps={{ inputMode: 'numeric', maxLength: 12 }}
                placeholder="Enter 12-digit Aadhaar number"
                required
              />
            ) : (
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                required
              />
            )}

            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={updateField('password')}
              required
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              inputProps={{ inputMode: 'numeric', maxLength: 10 }}
              placeholder="Enter 10-digit phone number"
              required
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={updateField('location')}
              required
            />

            {role === 'farmer' && (
              <TextField
                label="Crops (comma separated)"
                value={form.crops}
                onChange={updateField('crops')}
                placeholder="Onion, Potato, Wheat"
              />
            )}

            {role === 'fpo' && (
              <>
                <TextField
                  label="Number of Members"
                  type="number"
                  value={form.memberCount}
                  onChange={updateField('memberCount')}
                  required
                />
                <TextField
                  label="Registration Information"
                  value={form.registrationInfo}
                  onChange={updateField('registrationInfo')}
                  multiline
                  minRows={2}
                  placeholder="FPO registration number, incorporation year, etc. (mock verification)"
                />
              </>
            )}

            {needsOtp && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={captchaChecked}
                      onChange={(e) => setCaptchaChecked(e.target.checked)}
                    />
                  }
                  label="I'm not a robot (mock verification)"
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setOtpSent(true)}
                    disabled={!(role === 'farmer' ? form.aadhaar.length === 12 : form.email) || otpSent}
                  >
                    {otpSent ? 'OTP Sent' : 'Send OTP'}
                  </Button>
                  {otpSent && (
                    <TextField
                      label="Enter OTP (123456)"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                </Stack>
              </>
            )}

            {error && (
              <Typography color="error" role="alert">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" size="large" disabled={submitting || !canSubmit}>
              {submitting ? 'Creating Account...' : `Register as ${ROLE_LABELS[role]}`}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}
