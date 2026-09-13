import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { formatCurrency } from '../utils/format'

// product-spec §13: homepage Featured Produce card. Single "View Details"
// CTA (no cart/quantity here, per §13's "Optional: Buy Now" — that lives
// on the product page and the Marketplace grid's own card instead).
export default function FeaturedProductCard({ product, compareChecked = false, onToggleCompare, compareDisabled = false }) {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid #e0e2db',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(20,40,30,0.04)',
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{
          width: '100%',
          height: '180px',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <Box sx={{ p: 2 }}>
        {onToggleCompare && (
          <Stack direction="row" alignItems="center" sx={{ ml: '-9px', mb: '-4px' }}>
            <Tooltip title={compareDisabled ? 'You can compare up to 4 listings' : ''}>
              <span>
                <Checkbox
                  size="small"
                  checked={compareChecked}
                  disabled={compareDisabled}
                  onChange={() => onToggleCompare(product.id)}
                  inputProps={{ 'aria-label': `Compare ${product.name}` }}
                />
              </span>
            </Tooltip>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>Compare</Typography>
          </Stack>
        )}
        {product.isBestPrice && (
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: 'secondary.main',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              px: 1,
              py: 0.375,
              borderRadius: '6px',
              mb: 1,
            }}
          >
            Best Price
          </Box>
        )}
        <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 16 }}>
          {product.name}
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.dark', my: 0.5 }}>
          {formatCurrency(product.price)}/{product.unit}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 1 }}>
          {product.availableQuantity.toLocaleString('en-IN')} {product.unit} available · Grade{' '}
          {product.qualityGrade}
        </Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'primary.darker' }}>
          ★ {product.farmer?.rating.toFixed(1)} · {product.farmer?.name}
        </Typography>
        <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: 1.5 }}>
          {product.farmer?.location.city}, {product.farmer?.location.state} · ✓ Verified Farmer
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          sx={{ fontSize: 14 }}
          onClick={() => navigate(`/product/${product.id}`)}
        >
          View Details
        </Button>
      </Box>
    </Box>
  )
}
