import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useWishlist } from '../context/WishlistContext'

// product-spec §55: save products/farmers/FPOs to the wishlist.
export default function WishlistButton({ kind, id, size = 'medium' }) {
  const { isSaved, toggle } = useWishlist()
  const saved = isSaved(kind, id)

  return (
    <IconButton
      size={size}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(kind, id)
      }}
    >
      {saved ? (
        <FavoriteIcon color="secondary" fontSize={size} />
      ) : (
        <FavoriteBorderIcon color="secondary" fontSize={size} />
      )}
    </IconButton>
  )
}
