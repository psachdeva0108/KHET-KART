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
import VerifiedBadge from '../../components/VerifiedBadge'
import { getMemberFarmers } from '../../services/fpoService'
import { formatQuantity } from '../../utils/format'

// product-spec §37: Farmer Management — Farmer, Produce, Quantity, Quality,
// Status.
export default function FpoFarmers() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    getMemberFarmers().then(setRows)
  }, [])

  if (!rows) return <LoadingState message="Loading farmers..." />

  return (
    <Stack spacing={3}>
      <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }}>
        Farmers
      </Typography>

      <DataTable>
        <TableHead>
          <TableRow>
            <TableCell>Farmer</TableCell>
            <TableCell>Produce</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Quality</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.farmer.id}>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {row.farmer.name}
                  </Typography>
                  {row.farmer.verified && <VerifiedBadge label="Verified" />}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {row.farmer.farmName} · {row.farmer.location.city}
                </Typography>
              </TableCell>
              <TableCell>{row.produceNames.join(', ') || '—'}</TableCell>
              <TableCell>{formatQuantity(row.totalQuantity, 'kg')}</TableCell>
              <TableCell>{row.bestGrade}</TableCell>
              <TableCell>
                <StatusBadge tone={row.status === 'Active' ? 'green' : 'neutral'}>{row.status}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    </Stack>
  )
}
