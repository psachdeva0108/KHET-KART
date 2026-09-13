import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const STORAGE_KEY = 'farmlink.consumer.location'

function readLocation() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

export default function ConsumerLocationButton({ cartMode = false }) {
  const { user } = useAuth()
  const [location, setLocation] = useState(readLocation)
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [geoMessage, setGeoMessage] = useState('')

  useEffect(() => {
    const saved = user?.consumerLocation || readLocation()
    if (saved) {
      setAddress(saved.address || '')
      setCity(saved.city || '')
      setState(saved.state || '')
      setPincode(saved.pincode || '')
    }
  }, [user?.id])

  async function save() {
    const next = { address: address.trim(), city: city.trim(), state: state.trim(), pincode: pincode.trim() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setLocation(next)
    try {
      if (user?.id) await api.patch('/me', { consumerLocation: next })
    } catch {
      setGeoMessage('Saved on this device, but could not sync the location to your account.')
    }
    setOpen(false)
  }

  async function useCurrentLocation() {
    setGeoMessage('Fetching your current location…')
    if (!navigator.geolocation) {
      setGeoMessage('Location is not supported by this browser. Enter a location manually.')
      return
    }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(coords.latitude)}&lon=${encodeURIComponent(coords.longitude)}&zoom=18&addressdetails=1`, {
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Reverse geocoding failed')
        const data = await response.json()
        const address = data.address || {}
        const resolvedCity = address.city || address.town || address.village || address.suburb || address.county || ''
        const resolvedState = address.state || ''
        const resolvedPin = address.postcode || ''
        setAddress(data.display_name || '')
        setCity(resolvedCity)
        setState(resolvedState)
        setPincode(resolvedPin.replace(/\D/g, '').slice(0, 6))
        setGeoMessage(`Location found: ${resolvedCity || data.display_name || 'current position'}.`)
      } catch {
        setCity('')
        setState('')
        setPincode('')
        setGeoMessage('We got your coordinates but could not resolve the address. Please enter the city/state/PIN manually.')
      }
    }, (error) => {
      const message = error.code === error.PERMISSION_DENIED
        ? 'Location permission was denied. Allow it in browser settings or enter your location manually.'
        : 'Could not read your current location. Please try again or enter it manually.'
      setGeoMessage(message)
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 })
  }

  const label = location?.city
    ? `${location.address ? `${location.address}, ` : ''}${location.city}${location.pincode ? `, ${location.pincode}` : ''}`
    : 'Set location'

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<LocationOnOutlinedIcon fontSize="small" />}
        sx={{
          color: 'text.primary',
          minWidth: 0,
          px: 1.2,
          borderRadius: 2,
          textTransform: 'none',
          '&:hover': { bgcolor: 'rgba(4,119,59,0.06)' },
        }}
        aria-label="Set delivery location"
      >
        <Box sx={{ textAlign: 'left', lineHeight: 1.15 }}>
          <Typography sx={{ fontSize: 10.5, color: 'text.secondary', fontWeight: 600 }}>
            {cartMode ? 'Delivery address' : 'Deliver to'}
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 800, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label}
          </Typography>
        </Box>
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: '"Sora", sans-serif' }}>Choose delivery location</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Button variant="outlined" startIcon={<LocationOnOutlinedIcon />} onClick={useCurrentLocation}>
              Use my current location
            </Button>
            {geoMessage && (
              <Typography variant="caption" color="text.secondary">{geoMessage}</Typography>
            )}
            <TextField label="Address / Area" value={address} onChange={(e) => setAddress(e.target.value)} />
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} />
            <TextField label="PIN code" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputProps={{ inputMode: 'numeric' }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={!city.trim()}>Save location</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
