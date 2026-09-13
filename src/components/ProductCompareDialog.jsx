import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { formatCurrency } from '../utils/format'

const ROWS = [
  { label: 'Price', render: (p) => `${formatCurrency(p.price)}/${p.unit}` },
  { label: 'Quality Grade', render: (p) => `Grade ${p.qualityGrade}` },
  { label: 'Rating', render: (p) => `★ ${p.farmer?.rating?.toFixed(1) ?? '—'}` },
  { label: 'Location', render: (p) => p.farmer?.location?.city || '—' },
]

// product-spec §17-18: side-by-side compare drawer/modal for 2+ selected
// marketplace listings — price, quality grade, rating, location.
export default function ProductCompareDialog({ open, products, onClose, onRemove }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker' }}>
        Compare Listings
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }} aria-label="Close comparison">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {products.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', py: 2 }}>
            Nothing to compare — check two or more listings first.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                {products.map((p) => (
                  <TableCell key={p.id} sx={{ minWidth: 160 }}>
                    <Stack spacing={0.5}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 14 }}>
                          {p.name}
                        </Typography>
                        <IconButton size="small" onClick={() => onRemove(p.id)} aria-label={`Remove ${p.name} from comparison`}>
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{row.label}</TableCell>
                  {products.map((p) => (
                    <TableCell key={p.id}>{row.render(p)}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  )
}
