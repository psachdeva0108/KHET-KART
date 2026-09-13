import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Single source of truth for pooled-lot status → label/tone/icon, so the
// Dashboard summary, the Pooled Lots list, and any future page all agree.
// Real status values only (from the server): pending_verification,
// ready_for_pickup, dispatched.
export const POOLED_LOT_STATUS_META = {
  pending_verification: { label: 'Pending Verification', tone: 'orange', color: '#dd7b2b', icon: HourglassBottomIcon },
  ready_for_pickup: { label: 'Ready for Pickup', tone: 'blue', color: '#1c4a73', icon: LocalShippingIcon },
  dispatched: { label: 'Dispatched', tone: 'green', color: '#04773b', icon: CheckCircleIcon },
}

export function getPooledLotStatusMeta(status) {
  return POOLED_LOT_STATUS_META[status] ?? { label: status, tone: 'neutral', color: '#5b6559', icon: HourglassBottomIcon }
}
