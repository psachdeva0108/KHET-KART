import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingDisplay from '../../components/RatingDisplay'
import WishlistButton from '../../components/WishlistButton'
import ReviewsList from '../../components/ReviewsList'
import { useCart } from '../../context/CartContext'
import { getFarmerProfile } from '../../services/farmerService'
import { getReviewsForFarmer } from '../../services/reviewService'
import { formatCurrency } from '../../utils/format'

function initialsOf(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// product-spec §20: public farmer profile with current listings — the
// destination of the "repeat purchase" flow (§21) and farmer search (§3).
export default function FarmerProfile() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [farmer, setFarmer] = useState(undefined)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    setFarmer(undefined)
    getFarmerProfile(id).then(setFarmer)
    getReviewsForFarmer(id).then(setReviews)
  }, [id])

  if (farmer === undefined) return <LoadingState message="Loading farmer profile..." />
  if (farmer === null) return <EmptyState message="Farmer not found." />

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}>
            {initialsOf(farmer.name)}
          </Avatar>
          <Stack sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h5">{farmer.name}</Typography>
              {farmer.verified && <VerifiedBadge label="Verified Farmer" />}
            </Stack>
            <Typography color="text.secondary">
              {farmer.farmName} · {farmer.location.city}, {farmer.location.state}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <RatingDisplay value={farmer.rating} />
              <Typography variant="body2" color="text.secondary">
                · {farmer.successfulOrders} Successful Orders
              </Typography>
            </Stack>
          </Stack>
          <WishlistButton kind="farmers" id={farmer.id} />
        </Stack>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Currently Available Produce
      </Typography>

      {farmer.listings.length === 0 && <EmptyState message="No produce listed right now." />}

      <Grid container spacing={2}>
        {farmer.listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} farmer={farmer} onAddToCart={addItem} />
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Reviews
      </Typography>
      <ReviewsList reviews={reviews} />
    </Container>
  )
}

function ListingCard({ listing, farmer, onAddToCart }) {
  const [quantity, setQuantity] = useState(Math.min(50, listing.availableQuantity))
  // Reconstructs the farmer-nested shape CartContext groups by, without
  // re-fetching — this page already knows which farmer owns every listing.
  const cartProduct = {
    ...listing,
    farmer: {
      id: farmer.id,
      name: farmer.name,
      farmName: farmer.farmName,
      rating: farmer.rating,
      verified: farmer.verified,
      distanceKm: farmer.distanceKm,
      location: farmer.location,
    },
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card>
        <CardContent>
          <Typography variant="h6">{listing.name}</Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
            {formatCurrency(listing.price)}/{listing.unit}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {listing.availableQuantity.toLocaleString('en-IN')} {listing.unit} · Grade{' '}
            {listing.qualityGrade}
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(listing.availableQuantity, Math.max(1, Number(e.target.value) || 1)))}
            inputProps={{ min: 50, max: listing.availableQuantity, style: { width: 40, textAlign: 'center' } }}
          />
          <Button
            variant="contained"
            size="small"
            disabled={listing.availableQuantity < 50}
            sx={{ ml: 'auto' }}
            onClick={() => onAddToCart(cartProduct, quantity)}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
