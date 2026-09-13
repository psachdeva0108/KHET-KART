import { Link as RouterLink } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useEffect, useState } from 'react'
import EmptyState from '../../components/EmptyState'
import WishlistButton from '../../components/WishlistButton'
import VerifiedBadge from '../../components/VerifiedBadge'
import { useWishlist } from '../../context/WishlistContext'
import { getProducts } from '../../services/productService'
import { getFarmers } from '../../services/farmerService'
import { getFpos } from '../../services/fpoService'
import { formatCurrency } from '../../utils/format'

// product-spec §55: saved products, farmers and FPOs. Saved farmers/FPOs
// stay publicly accessible profiles, not private connections.
export default function Wishlist() {
  const { wishlist } = useWishlist()
  const [tab, setTab] = useState('products')
  const [catalog, setCatalog] = useState({ products: [], farmers: [], fpos: [] })
  useEffect(() => { Promise.all([getProducts(), getFarmers(), getFpos()]).then(([products, farmers, fpos]) => setCatalog({ products, farmers, fpos })) }, [])
  const products = catalog.products.filter((p) => wishlist.products.includes(Number(p.id)) || wishlist.products.includes(String(p.id)))
  const farmers = catalog.farmers.filter((f) => wishlist.farmers.includes(Number(f.id)) || wishlist.farmers.includes(String(f.id)))
  const fpos = catalog.fpos.filter((f) => wishlist.fpos.includes(Number(f.id)) || wishlist.fpos.includes(String(f.id)))

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Wishlist</Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab value="products" label={`Products (${products.length})`} />
        <Tab value="farmers" label={`Farmers (${farmers.length})`} />
        <Tab value="fpos" label={`FPOs (${fpos.length})`} />
      </Tabs>

      {tab === 'products' && (
        <Grid container spacing={2}>
          {products.length === 0 && <EmptyState message="No saved products yet." />}
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{product.name}</Typography>
                    <WishlistButton kind="products" id={product.id} size="small" />
                  </Stack>
                  <Typography color="primary.main" sx={{ fontWeight: 700 }}>
                    {formatCurrency(product.price)}/{product.unit}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/product/${product.id}`} size="small">
                    View Product
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 'farmers' && (
        <Grid container spacing={2}>
          {farmers.length === 0 && <EmptyState message="No saved farmers yet." />}
          {farmers.map((farmer) => (
            <Grid item key={farmer.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{farmer.name}</Typography>
                    <WishlistButton kind="farmers" id={farmer.id} size="small" />
                  </Stack>
                  <Typography color="text.secondary">{farmer.farmName}</Typography>
                  {farmer.verified && <VerifiedBadge label="Verified" />}
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/farmer/${farmer.id}`} size="small">
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tab === 'fpos' && (
        <Grid container spacing={2}>
          {fpos.length === 0 && <EmptyState message="No saved FPOs yet." />}
          {fpos.map((fpo) => (
            <Grid item key={fpo.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">{fpo.name}</Typography>
                    <WishlistButton kind="fpos" id={fpo.id} size="small" />
                  </Stack>
                  <Typography color="text.secondary">
                    {fpo.location.city}, {fpo.location.state}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={RouterLink} to={`/fpo/${fpo.id}`} size="small">
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}
