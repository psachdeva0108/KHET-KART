import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'

function ComparisonRow({ row }) {
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(Math.min(50, row.availableQuantity))

  return (
    <TableRow hover selected={row.isLowestPrice}>
      <TableCell>
        <Typography fontWeight={600}>{row.farmer?.name}</Typography>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <span>{formatCurrency(row.price)}/{row.unit}</span>
          {row.isLowestPrice && <Chip label="Lowest" size="small" color="secondary" />}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <span>{row.qualityGrade}</span>
          {row.isBestQuality && <Chip label="★" size="small" color="primary" />}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <span>{row.farmer?.rating.toFixed(1)}</span>
          {row.isHighestRating && <Chip label="★" size="small" color="primary" />}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <span>{row.farmer?.distanceKm} km</span>
          {row.isNearest && <Chip label="★" size="small" color="primary" />}
        </Stack>
      </TableCell>
      <TableCell>{row.availableQuantity.toLocaleString('en-IN')} {row.unit}</TableCell>
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(row.availableQuantity, Math.max(1, Number(e.target.value) || 1)))}
            inputProps={{ min: 50, max: row.availableQuantity, style: { width: 40, textAlign: 'center' } }}
          />
          <Button size="small" variant="outlined" disabled={row.availableQuantity < 50} onClick={() => addItem(row, quantity)}>
            Add
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={row.availableQuantity < 50}
            onClick={() => {
              addItem(row, quantity)
              navigate('/cart')
            }}
          >
            Buy Now
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  )
}

// product-spec §18: compare every farmer's listing for the same produce,
// highlighting the lowest price, highest rating, best quality and nearest.
export default function ComparisonTable({ rows }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Farmer</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quality</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <ComparisonRow key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
