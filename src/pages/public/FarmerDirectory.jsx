import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingDisplay from '../../components/RatingDisplay'
import { getFarmers } from '../../services/farmerService'

// product-spec §47: dedicated farmer discovery page — browse verified
// farmers publicly, then open their profile.
export default function FarmerDirectory() {
  const [farmers, setFarmers] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getFarmers().then(setFarmers)
  }, [])

  if (!farmers) return <LoadingState message="Loading farmers..." />

  const filtered = farmers.filter((f) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      f.name.toLowerCase().includes(q) ||
      f.farmName.toLowerCase().includes(q) ||
      f.location.city.toLowerCase().includes(q)
    )
  })

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Verified Farmers
      </Typography>
      <TextField
        fullWidth
        placeholder="Search by farmer, farm name or location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3, maxWidth: 480 }}
      />

      {filtered.length === 0 && <EmptyState message="No farmers found." />}

      <Grid container spacing={3}>
        {filtered.map((farmer) => (
          <Grid item key={farmer.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6">{farmer.name}</Typography>
                  {farmer.verified && <VerifiedBadge label="Verified" />}
                </Stack>
                <Typography color="text.secondary">{farmer.farmName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {farmer.location.city}, {farmer.location.state}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <RatingDisplay value={farmer.rating} />
                  <Typography variant="body2" color="text.secondary">
                    · {farmer.successfulOrders} orders
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button component={RouterLink} to={`/farmer/${farmer.id}`} variant="outlined" fullWidth>
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
