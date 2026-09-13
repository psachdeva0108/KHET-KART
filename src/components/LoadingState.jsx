import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// product-spec §72: shared loading state for API-shaped pages.
export default function LoadingState({ message = 'Loading...' }) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
      <CircularProgress color="primary" />
      <Typography color="text.secondary">{message}</Typography>
    </Stack>
  )
}
