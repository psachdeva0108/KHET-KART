import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingDisplay from '../../components/RatingDisplay'
import ComparisonTable from '../../components/ComparisonTable'
import WishlistButton from '../../components/WishlistButton'
import ReviewsList from '../../components/ReviewsList'
import { useCart } from '../../context/CartContext'
import { getProductDetails } from '../../services/productService'
import { getReviewsForProduct } from '../../services/reviewService'
import { formatCurrency, daysAgo } from '../../utils/format'

// product-spec §19: product details + §18 comparison table for the same
// produce across every farmer listing it.
export default function ProductDetails() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [data, setData] = useState(undefined)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    setData(undefined)
    getProductDetails(id).then(setData)
    getReviewsForProduct(id).then(setReviews)
  }, [id])

  if (data === undefined) return <LoadingState message="Loading product..." />
  if (data === null) return <EmptyState message="Product not found." />

  const { product, comparison } = data
  const otherListings = comparison.length - 1

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: '100%',
              height: 320,
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h3" sx={{ fontSize: '2.2rem', mb: 0.5 }}>
              {product.name}
            </Typography>
            <WishlistButton kind="products" id={product.id} />
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Category: {product.category}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {otherListings > 0
              ? `${comparison.length} farmer listings available — compare below and choose the one that suits you best.`
              : 'Currently one listing available for this produce.'}
          </Typography>

          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
            {formatCurrency(product.price)}/{product.unit}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
            <Typography variant="body2">
              {product.availableQuantity.toLocaleString('en-IN')} {product.unit} available
            </Typography>
            <Typography variant="body2">Grade {product.qualityGrade}</Typography>
            <Typography variant="body2">Harvested {daysAgo(product.harvestDate)}</Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Typography
              component={RouterLink}
              to={`/farmer/${product.farmer?.id}`}
              sx={{ fontWeight: 700, color: 'text.primary', textDecoration: 'none' }}
            >
              {product.farmer?.name}
            </Typography>
            {product.farmer?.verified && <VerifiedBadge />}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <RatingDisplay value={product.farmer?.rating ?? 0} />
            <Typography variant="body2" color="text.secondary">
              {product.farmer?.location.city}, {product.farmer?.location.state} ·{' '}
              {product.farmer?.distanceKm} km away
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.farmer?.successfulOrders} successful orders · Estimated delivery{' '}
            {Math.max(1, Math.round((product.farmer?.distanceKm ?? 20) / 15))}-
            {Math.max(2, Math.round((product.farmer?.distanceKm ?? 20) / 15) + 1)} days
          </Typography>

          <Typography sx={{ mb: 3 }}>{product.description}</Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Minimum order: 10 kg</Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => addItem(product, Math.min(10, product.availableQuantity))} disabled={product.availableQuantity < 10}>
              Add to Cart
            </Button>
            <Button variant="contained" onClick={() => addItem(product, 10)} disabled={product.availableQuantity < 10} component={RouterLink} to="/payment">
              Buy Now
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Compare Listings
      </Typography>
      <ComparisonTable rows={comparison} />

      <Divider sx={{ my: 5 }} />

      <Typography variant="h5" sx={{ mb: 2 }}>
        Reviews
      </Typography>
      <ReviewsList reviews={reviews} />
    </Container>
  )
}
