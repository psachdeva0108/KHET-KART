import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DataTable from '../../components/DataTable'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../context/AuthContext'
import { getEarningsForFarmer } from '../../services/orderService'
import { formatCurrency } from '../../utils/format'

const sectionHeadingSx = { fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }

// product-spec §34: today/weekly/monthly/total earnings, pending payments,
// completed transactions, payment history.
export default function FarmerEarnings() {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState(null)

  useEffect(() => {
    getEarningsForFarmer(user?.linkedId).then(setEarnings)
  }, [user])

  if (!earnings) return <LoadingState message="Loading earnings..." />

  return (
    <Stack spacing={3}>
      <Typography sx={sectionHeadingSx}>Earnings</Typography>

      <Grid container spacing={'14px'}>
        <Grid item xs={6} md={3}>
          <StatCard label="Today's Earnings" value={formatCurrency(earnings.todayEarnings)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Weekly Earnings" value={formatCurrency(earnings.weeklyEarnings)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Monthly Earnings" value={formatCurrency(earnings.monthlyEarnings)} />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard label="Completed Transactions" value={earnings.completedTransactions} />
        </Grid>
      </Grid>

      <Grid container spacing={'14px'}>
        <Grid item xs={12} sm={6}>
          <StatCard label="Total Earnings" value={formatCurrency(earnings.totalEarnings)} valueColor="primary.dark" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard label="Pending Payments" value={formatCurrency(earnings.pendingPayments)} valueColor="secondary.main" />
        </Grid>
      </Grid>

      <Typography sx={{ ...sectionHeadingSx, fontSize: '17px' }}>Payment History</Typography>
      {earnings.paymentHistory.length === 0 && <EmptyState message="No completed transactions yet." />}
      {earnings.paymentHistory.length > 0 && (
        <DataTable>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earnings.paymentHistory.map((line) => (
              <TableRow key={`${line.orderId}-${line.productId}`}>
                <TableCell sx={{ fontWeight: 700 }}>{line.orderId}</TableCell>
                <TableCell>{line.productName || `Product #${line.productId}`}</TableCell>
                <TableCell>{line.placedAt}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {formatCurrency(line.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}
    </Stack>
  )
}
