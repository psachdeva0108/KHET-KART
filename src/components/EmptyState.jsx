import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import InboxIcon from '@mui/icons-material/Inbox'

// product-spec §72: shared empty state for API-shaped pages.
export default function EmptyState({ message = 'No results found.' }) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 8, color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 40 }} />
      <Typography>{message}</Typography>
    </Stack>
  )
}
