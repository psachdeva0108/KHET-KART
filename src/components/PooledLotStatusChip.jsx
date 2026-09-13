import Chip from '@mui/material/Chip'

// product-spec §39: pooled lot lifecycle — aggregating → pending
// verification (§41) → ready for pickup → dispatched (§43).
const STATUS_META = {
  aggregating: { label: 'Aggregating', color: 'default' },
  pending_verification: { label: 'Pending Verification', color: 'warning' },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'primary' },
  dispatched: { label: 'Dispatched', color: 'secondary' },
}

export default function PooledLotStatusChip({ status }) {
  const meta = STATUS_META[status] ?? { label: status, color: 'default' }
  return (
    <Chip
      size="small"
      label={meta.label}
      color={meta.color}
      variant={meta.color === 'default' ? 'outlined' : 'filled'}
    />
  )
}
