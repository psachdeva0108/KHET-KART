import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import RatingDisplay from '../../components/RatingDisplay'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { getOrderGroupsForConsumer } from '../../services/orderService'
import { getFarmers } from '../../services/farmerService'

// product-spec §44/§54: "Farmers I have purchased from / saved" — NOT a
// private connection. Clicking View Profile opens the same public
// /farmer/:id page anyone can reach.
export default function MyFarmers() {
  const { user } = useAuth()
  const { wishlist } = useWishlist()
  const [purchasedFrom, setPurchasedFrom] = useState(null)
  const [farmers, setFarmers] = useState(null)

  useEffect(() => {
    Promise.all([getOrderGroupsForConsumer(user.id), getFarmers()]).then(([groups, farmerList]) => {
      const map = new Map()
      groups.forEach((group) => {
        group.orders.forEach((order) => {
          order.items.forEach((item) => {
            if (!map.has(item.farmerId)) {
              map.set(item.farmerId, { farmerId: item.farmerId, lastProductId: item.productId, lastProductName: item.productName, placedAt: order.placedAt })
            }
          })
        })
      })
      setPurchasedFrom(Array.from(map.values()))
      setFarmers(farmerList)
    })
  }, [user])

  if (!purchasedFrom || !farmers) return <LoadingState message="Loading your farmers..." />

  const farmerIds = new Set([...wishlist.farmers, ...purchasedFrom.map((p) => p.farmerId)])
  const rows = Array.from(farmerIds).map((id) => {
    const farmer = farmers.find((f) => Number(f.id) === Number(id))
    const purchase = purchasedFrom.find((p) => p.farmerId === id)
    return farmer ? { farmer, lastProduct: purchase?.lastProductName || null } : null
  })
    .filter(Boolean)

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My Farmers</Typography>
      <Typography color="text.secondary">
        Farmers you've purchased from or saved — not a private connection, just a shortcut back to their
        public profile.
      </Typography>

      {rows.length === 0 && <EmptyState message="You haven't purchased from or saved any farmers yet." />}

      <Grid container spacing={2}>
        {rows.map(({ farmer, lastProduct }) => (
          <Grid item key={farmer.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">{farmer.name}</Typography>
                <Typography color="text.secondary">{farmer.farmName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {farmer.location.city}, {farmer.location.state}
                </Typography>
                <RatingDisplay value={farmer.rating} />
                {lastProduct && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Last Purchase: {lastProduct}
                  </Typography>
                )}
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
    </Stack>
  )
}
