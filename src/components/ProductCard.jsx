import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import WishlistButton from './WishlistButton'


// product-spec §13/§17: marketplace grid card with a "Best Price" indicator
// on the cheapest listing for that product name.
export default function ProductCard({ product, compareChecked = false, onToggleCompare, compareDisabled = false }) {
  const { items, addItem, updateQuantity } = useCart()
  const navigate = useNavigate()
  const cartItem = items.find((item) => item.product.id === product.id)
  const cartQuantity = cartItem?.quantity ?? 0
  const [quantity, setQuantity] = useState(cartQuantity || 1)

  function changeCartQuantity(next) {
    const safe = Math.min(product.availableQuantity, Math.max(0, next))
    if (safe === 0) updateQuantity(product.id, 0)
    else if (cartItem) updateQuantity(product.id, safe)
    else addItem(product, safe)
    setQuantity(safe || 1)
  }

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
      <Box sx={{ p: '15px' }}>
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
              py: '3px',
              borderRadius: '6px',
              mb: 1,
            }}
          >
            Best Price
          </Box>
        )}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography
            component={RouterLink}
            to={`/product/${product.id}`}
            sx={{
              fontFamily: '"Sora", sans-serif',
              fontWeight: 700,
              fontSize: '15.5px',
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            {product.name}
          </Typography>
          <WishlistButton kind="products" id={product.id} size="small" />
        </Stack>
        <Typography sx={{ fontSize: 19, fontWeight: 800, color: 'primary.dark', my: 0.5 }}>
          {formatCurrency(product.price)}/{product.unit}
        </Typography>
        <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', mb: '6px' }}>
          {product.availableQuantity.toLocaleString('en-IN')} {product.unit} available · Grade{' '}
          {product.qualityGrade} · {product.farmer?.distanceKm} km
        </Typography>
        <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: 'primary.darker', mb: '10px' }}>
          ★ {product.farmer?.rating.toFixed(1)} · {product.farmer?.name}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            onClick={() => navigate(`/product/${product.id}`)}
            variant="outlined"
            sx={{ flex: 1, padding: '9px', fontSize: '12.5px' }}
          >
            Details
          </Button>
          {cartQuantity > 0 ? (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ flex: 1, border: '1px solid', borderColor: 'primary.main', borderRadius: 1, px: .5 }}
            >
              <IconButton size="small" onClick={() => changeCartQuantity(cartQuantity - 1)} aria-label="Decrease quantity">
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ fontWeight: 800, minWidth: 24, textAlign: 'center' }}>{cartQuantity}</Typography>
              <IconButton size="small" disabled={cartQuantity >= product.availableQuantity} onClick={() => changeCartQuantity(cartQuantity + 1)} aria-label="Increase quantity">
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Button
              variant="contained"
              disabled={product.availableQuantity <= 0}
              onClick={() => changeCartQuantity(quantity)}
              sx={{ flex: 1, padding: '9px', fontSize: '12.5px' }}
            >
              {product.availableQuantity <= 0 ? 'Sold Out' : 'Add to Cart'}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
