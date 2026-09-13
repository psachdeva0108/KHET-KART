import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import ProductCard from '../../components/ProductCard'
import ProductCompareDialog from '../../components/ProductCompareDialog'
import MiddlemanSavingsBanner from '../../components/MiddlemanSavingsBanner'
import { getProducts, getCategories } from '../../services/productService'

const MAX_COMPARE = 4

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'price_low', label: 'Lowest Price' },
  { value: 'rating_high', label: 'Highest Rating' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'quantity_high', label: 'Highest Quantity' },
]

// product-spec §16-18: public marketplace — search, filter, sort, compare.
export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'All'
  const sortBy = searchParams.get('sort') ?? 'recent'

  const [products, setProducts] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)

  function toggleCompare(id) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX_COMPARE ? [...prev, id] : prev
    )
  }

  const compareProducts = (products || []).filter((p) => compareIds.includes(p.id))

  useEffect(() => {
    setProducts(null)
    getProducts({ category, query, sortBy }).then(setProducts)
  }, [category, query, sortBy])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value && value !== 'All') next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Marketplace
      </Typography>

      <Box sx={{ mb: 3 }}>
        <MiddlemanSavingsBanner />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products, farmers or FPOs..."
          value={query}
          onChange={(e) => updateParam('q', e.target.value)}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All Categories</MenuItem>
          {getCategories().map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sort"
          value={sortBy}
          onChange={(e) => updateParam('sort', e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {SORT_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {!products && <LoadingState message="Loading products..." />}
      {products && products.length === 0 && <EmptyState message="No products found." />}
      {products && products.length > 0 && (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard
                product={product}
                compareChecked={compareIds.includes(product.id)}
                compareDisabled={!compareIds.includes(product.id) && compareIds.length >= MAX_COMPARE}
                onToggleCompare={toggleCompare}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Fade in={compareIds.length >= 2}>
        <Button
          variant="contained"
          onClick={() => setCompareOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            px: 3,
            py: 1.2,
            boxShadow: '0 6px 20px rgba(4,119,59,0.35)',
            zIndex: 1200,
          }}
        >
          Compare ({compareIds.length})
        </Button>
      </Fade>

      <ProductCompareDialog
        open={compareOpen}
        products={compareProducts}
        onClose={() => setCompareOpen(false)}
        onRemove={toggleCompare}
      />
    </Container>
  )
}
