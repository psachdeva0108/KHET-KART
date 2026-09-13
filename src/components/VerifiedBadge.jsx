import Chip from '@mui/material/Chip'
import VerifiedIcon from '@mui/icons-material/Verified'

// product-spec §60: "✓ Verified Farmer" / "✓ Verified FPO" trust badge.
export default function VerifiedBadge({ label = 'Verified Farmer' }) {
  return (
    <Chip
      icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
      label={label}
      size="small"
      color="primary"
      variant="outlined"
      sx={{ fontWeight: 700 }}
    />
  )
}
