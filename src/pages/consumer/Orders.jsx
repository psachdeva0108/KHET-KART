import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { getOrderGroupsForConsumer } from '../../services/orderService'
import { ORDER_STATUS_LABELS } from '../../constants'
import { formatCurrency } from '../../utils/format'

// product-spec §53: My Orders — one card per checkout group. Track Order and
// Rate Experience both navigate to that order's own tracking page (§53/§56)
// rather than expanding inline here.
export default function ConsumerOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const highlightGroupId = searchParams.get('highlight')
  const [groups, setGroups] = useState(null)

  useEffect(() => {
    getOrderGroupsForConsumer(user.id).then(setGroups)
  }, [user])

  if (!groups) return <LoadingState message="Loading your orders..." />

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '24px', mb: '20px' }}>
        My Orders
      </Typography>

      {groups.length === 0 && <EmptyState message="You haven't placed any orders yet." />}

      <Stack spacing="12px">
        {groups.map((group) => {
          const total = group.orders.reduce((sum, o) => sum + o.totalAmount, 0)
          return (
            <Box
              key={group.groupId}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: group.groupId === highlightGroupId ? 'primary.main' : 'divider',
                borderWidth: group.groupId === highlightGroupId ? '2px' : '1px',
                borderRadius: '12px',
                p: '18px',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                flexWrap="wrap"
                gap="10px"
                sx={{ mb: '8px' }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  {group.groupId} · {group.placedAt}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: 'primary.dark' }}>{formatCurrency(total)}</Typography>
              </Stack>

              {group.orders.map((order, index) => {
                const farmer = order.items[0]?.farmer
                return (
                  <Box
                    key={order.id}
                    sx={{
                      pt: index === 0 ? 0 : '10px',
                      mt: index === 0 ? 0 : '10px',
                      borderTop: index === 0 ? 'none' : '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    {group.orders.length > 1 && (
                      <Typography sx={{ fontSize: '12.5px', fontWeight: 700, mb: '4px' }}>
                        {farmer?.name}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: '6px' }}>
                      Status: {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: 'text.secondary', mb: '6px' }}>
                      Order ID: {order.id} · Payment: {(order.paymentMethod || 'UPI').toUpperCase()}
                    </Typography>
                    {order.items.map((item) => (
                      <Typography key={item.productId} sx={{ fontSize: 13, mb: '3px' }}>
                        {item.productName || `Product #${item.productId}`} · {item.quantity} {item.unit || ''} · {formatCurrency(item.quantity * item.price)}
                      </Typography>
                    ))}
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/consumer/orders/${order.id}`)}
                        sx={{ padding: '9px 16px', fontSize: 13 }}
                      >
                        Track Order
                      </Button>
                      {order.status === 'delivered' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => navigate(`/consumer/orders/${order.id}?rate=1`)}
                          sx={{ padding: '9px 16px', fontSize: 13 }}
                        >
                          Rate Experience
                        </Button>
                      )}
                    </Stack>
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
