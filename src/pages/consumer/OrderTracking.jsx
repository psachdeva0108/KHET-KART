import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import OrderTrackingTimeline from '../../components/OrderTrackingTimeline'
import RateExperienceForm from '../../components/RateExperienceForm'
import { useAuth } from '../../context/AuthContext'
import { getOrderById } from '../../services/orderService'
import { hasReviewedOrder, submitReview } from '../../services/reviewService'

import { formatCurrency, formatQuantity } from '../../utils/format'

// product-spec §53: Track Order opens this dedicated page (not an inline
// expansion of the My Orders list) — full status checklist, items, and,
// once delivered, the Rate Your Experience form (§56).
export default function ConsumerOrderTracking() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [order, setOrder] = useState(undefined)
  const [reviewed, setReviewed] = useState(false)
  const [rating, setRating] = useState(searchParams.get('rate') === '1')

  useEffect(() => {
    getOrderById(orderId).then(async (o) => {
      setOrder(o)
      setReviewed(await hasReviewedOrder(orderId))
    })
  }, [orderId])

  if (order === undefined) return <LoadingState message="Loading order..." />
  if (!order) return <EmptyState message="Order not found." />

  const farmer = order.items[0]?.farmer

  async function handleSubmitReview(ratings) {
    await submitReview({
      orderId: order.id,
      consumerId: user.id,
      reviewerName: user.name,
      farmerId: order.items[0].farmerId,
      productId: order.items[0].productId,
      ratings,
    })
    setReviewed(true)
    setRating(false)
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto' }}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px', mb: '4px' }}>
        Order {order.id}
      </Typography>
      <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 3 }}>
        Placed {order.placedAt} · {formatCurrency(order.totalAmount)} · Payment: {(order.paymentMethod || 'UPI').toUpperCase()}
      </Typography>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '14px',
          p: '22px',
          mb: '18px',
        }}
      >
        <OrderTrackingTimeline status={order.status} />
      </Box>

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '14px',
          p: '18px',
          mb: '18px',
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: '10px' }}>Items</Typography>
        {order.items.map((item) => {
          const product = item
          return (
            <Stack
              key={item.productId}
              direction="row"
              justifyContent="space-between"
              sx={{ fontSize: '13.5px', py: '6px', borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <span>
                {formatQuantity(item.quantity, product?.unit)} {product?.name || product?.productName} — {item.farmer?.name || farmer?.name}
              </span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(item.quantity * item.price)}</span>
            </Stack>
          )
        })}
      </Box>

      {order.status === 'delivered' && !reviewed && !rating && (
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={() => setRating(true)}
          sx={{ padding: '12px', borderRadius: '9px', fontSize: 14 }}
        >
          Rate Your Experience
        </Button>
      )}

      {order.status === 'delivered' && reviewed && (
        <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 13 }}>
          You rated this order.
        </Typography>
      )}

      {rating && !reviewed && (
        <RateExperienceForm onCancel={() => setRating(false)} onSubmit={handleSubmitReview} />
      )}
    </Box>
  )
}
