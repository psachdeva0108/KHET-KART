import Stack from '@mui/material/Stack'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'

export default function RatingDisplay({ value, size = 'small', showValue = true }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Rating value={value} precision={0.1} readOnly size={size} />
      {showValue && (
        <Typography variant="body2" color="text.secondary">
          {value.toFixed(1)}
        </Typography>
      )}
    </Stack>
  )
}
