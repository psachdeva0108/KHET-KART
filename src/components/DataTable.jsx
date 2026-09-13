import Box from '@mui/material/Box'
import Table from '@mui/material/Table'

// Shared table chrome matching the reference exactly: white background,
// rounded+clipped border, light-green header row, and hairline row
// dividers — used by My Produce, Orders and similar list pages across all
// three roles.
export default function DataTable({ children }) {
  return (
    <Box
      sx={{
        overflowX: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '12px',
        bgcolor: 'background.paper',
      }}
    >
      <Table
        sx={{
          '& thead tr': { bgcolor: '#e8f6eb' },
          '& th': { padding: '12px', fontWeight: 700, textAlign: 'left', border: 0 },
          '& td': { padding: '12px', textAlign: 'left', borderTop: '1px solid #e7e9e2', borderBottom: 0 },
          '& tbody tr:first-of-type td': { borderTop: 0 },
        }}
      >
        {children}
      </Table>
    </Box>
  )
}
