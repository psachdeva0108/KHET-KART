import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

// product-spec §72: shared error state ("Unable to load products. Try Again").
export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <Stack spacing={2} sx={{ py: 6, maxWidth: 480, mx: 'auto' }}>
      <Alert severity="error">{message}</Alert>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry} sx={{ alignSelf: 'center' }}>
          Try Again
        </Button>
      )}
    </Stack>
  )
}
