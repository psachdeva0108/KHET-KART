import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Rating from '@mui/material/Rating'
import EmptyState from './EmptyState'

// product-spec §56: reviews shown on Product / Farmer profile / FPO profile.
export default function ReviewsList({ reviews }) {
  if (reviews.length === 0) return <EmptyState message="No reviews yet." />

  return (
    <Stack spacing={1.5}>
      {reviews.map((review) => (
        <Paper key={review.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">{review.reviewerName}</Typography>
            <Rating value={review.overall} precision={0.1} readOnly size="small" />
          </Stack>
          {review.comment && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {review.comment}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  )
}
