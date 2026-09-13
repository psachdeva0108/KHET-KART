import StatusBadge from './StatusBadge'

// product-spec §33: Received → Accepted → Preparing → Packed → Pickup →
// Dispatched → Delivered.
const STATUS_META = {
  received: { label: 'Received', tone: 'neutral' },
  accepted: { label: 'Accepted', tone: 'blue' },
  preparing: { label: 'Preparing', tone: 'blue' },
  packed: { label: 'Packed', tone: 'orange' },
  pickup: { label: 'Pickup', tone: 'orange' },
  dispatched: { label: 'Dispatched', tone: 'orange' },
  delivered: { label: 'Delivered', tone: 'green' },
  confirmed: { label: 'Confirmed', tone: 'green' },
}

export default function OrderStatusChip({ status }) {
  const meta = STATUS_META[status] ?? { label: status, tone: 'neutral' }
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
}
