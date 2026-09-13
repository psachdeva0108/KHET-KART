import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// product-spec §53: order tracking checklist. Consolidates the spec's finer
// list (Farmer Confirmed / Produce Being Prepared / .../ Delivered) onto
// this app's own 7-stage order status vocabulary (shared with Farmer Orders
// §33) — "In Transit" and "Out for Delivery" complete together with
// "Dispatched" since the data model doesn't track those two separately.
const ORDER_INDEX = {
  received: 0,
  accepted: 1,
  preparing: 2,
  packed: 3,
  pickup: 4,
  dispatched: 5,
  delivered: 6,
}

const STAGES = [
  { key: 'accepted', label: 'Farmer Confirmed' },
  { key: 'preparing', label: 'Produce Being Prepared' },
  { key: 'packed', label: 'Packed' },
  { key: 'pickup', label: 'Pickup Assigned' },
  { key: 'dispatched', label: 'Dispatched' },
  { key: 'dispatched', label: 'In Transit' },
  { key: 'dispatched', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
]

export default function OrderTrackingTimeline({ status }) {
  const currentIndex = ORDER_INDEX[status] ?? 0

  return (
    <Stack spacing={0}>
      {STAGES.map((stage, index) => {
        const done = currentIndex >= ORDER_INDEX[stage.key]
        return (
          <Stack key={stage.label} direction="row" alignItems="center" spacing="12px" sx={{ py: '8px' }}>
            <Box
              sx={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                bgcolor: done ? 'primary.main' : '#eef0ea',
                color: done ? '#fff' : '#5b6559',
              }}
            >
              {done ? '✓' : index + 1}
            </Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: stage.label === 'Delivered' && done ? 700 : 500,
                color: done ? 'text.primary' : 'text.secondary',
              }}
            >
              {stage.label}
            </Typography>
          </Stack>
        )
      })}
    </Stack>
  )
}
