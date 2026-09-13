import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DataTable from '../../components/DataTable'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import OrderStatusChip from '../../components/OrderStatusChip'
import { useAuth } from '../../context/AuthContext'
import { getOrderLinesForFarmerId } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

// product-spec §33: Order ID, Product, Quantity, Buyer, Listed Price, Total,
// Status. Statuses: Received → Accepted → Preparing → Packed → Pickup →
// Dispatched → Delivered.
export default function FarmerOrders() {
  const { user } = useAuth()
  const [lines, setLines] = useState(null)

  useEffect(() => {
    getOrderLinesForFarmerId(user?.linkedId).then(setLines)
  }, [user])

  if (!lines) return <LoadingState message="Loading orders..." />

  return (
    <Stack spacing={3}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }}>
        Orders
      </Typography>

      {lines.length === 0 && <EmptyState message="No orders yet." />}

      {lines.length > 0 && (
        <DataTable>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Listed Price</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line) => {
              const product = line
              return (
                <TableRow key={`${line.orderId}-${line.productId}`}>
                  <TableCell sx={{ fontWeight: 700 }}>{line.orderId}</TableCell>
                  <TableCell>{product?.productName || `Product #${product?.productId}`}</TableCell>
                  <TableCell>
                    {line.quantity.toLocaleString('en-IN')} {product?.unit}
                  </TableCell>
                  <TableCell>{line.buyerName}</TableCell>
                  <TableCell>{formatCurrency(line.price)}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                    {formatCurrency(line.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusChip status={line.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </DataTable>
      )}
    </Stack>
  )
}
