import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import LogisticsMap from '../../components/LogisticsMap'
import { useAuth } from '../../context/AuthContext'
import { getPooledLots } from '../../services/pooledLotService'
import { formatQuantity } from '../../utils/format'

const sectionHeadingSx = { fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }

function pickupLocationsFor(lot) {
  return [...new Set(lot.contributions.map((c) => c.farmerLocation?.city))]
    .filter(Boolean)
    .join(', ')
}

// product-spec §43: Pickup locations, Transport partner, Quantity,
// Destination, Delivery deadline, Status — one row per pooled lot that has
// had logistics assigned (§39 "Assign Logistics").
export default function FpoLogistics() {
  const { user } = useAuth()
  const [lots, setLots] = useState(null)

  useEffect(() => {
    getPooledLots(user?.linkedId).then(setLots)
  }, [user])

  if (!lots) return <LoadingState message="Loading logistics..." />

  const withLogistics = lots.filter((lot) => lot.logistics)

  if (withLogistics.length === 0) {
    return (
      <Stack spacing={3}>
        <Typography sx={sectionHeadingSx}>Logistics</Typography>
        <LogisticsMap />
        <EmptyState message="No logistics assigned yet — assign logistics from a pooled lot's details." />
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      <Typography sx={sectionHeadingSx}>Logistics</Typography>

      <LogisticsMap />

      <DataTable>
        <TableHead>
          <TableRow>
            <TableCell>Lot</TableCell>
            <TableCell>Pickup Locations</TableCell>
            <TableCell>Transport Partner</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {withLogistics.map((lot) => (
            <TableRow key={lot.id}>
              <TableCell sx={{ fontWeight: 700 }}>
                {lot.id} · {lot.productName}
              </TableCell>
              <TableCell>{pickupLocationsFor(lot)}</TableCell>
              <TableCell>{lot.logistics.transportPartner}</TableCell>
              <TableCell>
                {formatQuantity(lot.contributions.reduce((s, c) => s + c.quantity, 0), 'kg')}
              </TableCell>
              <TableCell>{lot.logistics.destination}</TableCell>
              <TableCell>{lot.logistics.deliveryDeadline}</TableCell>
              <TableCell>
                <StatusBadge tone="blue">{lot.logistics.status}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </Stack>
  )
}
