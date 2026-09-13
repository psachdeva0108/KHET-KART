import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = { farmer: '/farmer', fpo: '/fpo', consumer: '/consumer' }
const ROLE_LABELS = { farmer: 'Farmer', fpo: 'FPO', consumer: 'Consumer' }

const DEMO_ACCOUNTS = [
  { identifier: '123456789012', role: 'Farmer', type: 'aadhaar' },
  { identifier: 'fpo@test.com', role: 'FPO', type: 'email' },
  { identifier: 'consumer@test.com', role: 'Consumer', type: 'email' },
]

const inputSx = {
  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
  '& .MuiOutlinedInput-input': { padding: '11px 14px' },
}

function Field({ label, ...props }) {
  return (
    <Stack spacing={0.75}>
      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>
        {label}
      </Typography>
      <TextField fullWidth sx={inputSx} {...props} />
    </Stack>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('farmer')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isFarmer = role === 'farmer'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(identifier, password, isFarmer ? 'aadhaar' : 'email')
      navigate(ROLE_HOME[user.role] ?? '/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3, fontSize: 24 }}>Log In</Typography>
      <Paper variant="outlined" sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Tabs value={role} onChange={(_, value) => { setRole(value); setIdentifier(''); setError('') }} variant="fullWidth">
          {Object.keys(ROLE_LABELS).map((key) => <Tab key={key} value={key} label={ROLE_LABELS[key]} />)}
        </Tabs>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
            <Field
              label={isFarmer ? 'Aadhaar Number' : 'Email'}
              type={isFarmer ? 'text' : 'email'}
              inputProps={isFarmer ? { inputMode: 'numeric', maxLength: 12 } : undefined}
              placeholder={isFarmer ? 'Enter 12-digit Aadhaar number' : 'you@example.com'}
              value={identifier}
              onChange={(e) => setIdentifier(isFarmer ? e.target.value.replace(/\D/g, '') : e.target.value)}
              required
            />
            <Field label="Password" type="password" placeholder="demo1234" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="contained" size="large" fullWidth disabled={submitting}>
              {submitting ? 'Logging In...' : `Log In as ${ROLE_LABELS[role]}`}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ p: 2, mt: 3, bgcolor: '#e8f6eb', borderRadius: '12px' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5 }}>Demo accounts (password: demo1234)</Typography>
        <Stack spacing={1}>
          {DEMO_ACCOUNTS.map((account) => (
            <Box key={account.role} onClick={() => { setRole(account.role.toLowerCase()); setIdentifier(account.identifier); setPassword('demo1234') }} sx={{ bgcolor: 'background.paper', borderRadius: '7px', px: 1.25, py: 1, cursor: 'pointer', '&:hover': { boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } }}>
              <Typography variant="body2">{account.identifier} — {account.role}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}
