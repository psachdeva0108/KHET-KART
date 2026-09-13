import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const CRITERIA = [
  { key: 'quality', label: 'Product Quality' },
  { key: 'freshness', label: 'Freshness' },
  { key: 'quantityAccuracy', label: 'Quantity Accuracy' },
  { key: 'packaging', label: 'Packaging' },
  { key: 'overall', label: 'Overall Experience' },
]

function StarRow({ value, onChange }) {
  return (
    <Stack direction="row" spacing="2px">
      {[1, 2, 3, 4, 5].map((n) => (
        <Box
          key={n}
          component="span"
          onClick={() => onChange(n)}
          sx={{ cursor: 'pointer', fontSize: 18, color: n <= value ? 'secondary.main' : '#e0e2db' }}
        >
          ★
        </Box>
      ))}
    </Stack>
  )
}

// product-spec §56: "Rate Your Experience" after delivery — inline on the
// order's tracking page, not a modal, per the reference design.
export default function RateExperienceForm({ onCancel, onSubmit }) {
  const [ratings, setRatings] = useState({ quality: 0, freshness: 0, quantityAccuracy: 0, packaging: 0, overall: 0 })

  const canSubmit = Object.values(ratings).every((v) => v > 0)

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '14px',
        p: '20px',
        mt: '14px',
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: '12px' }}>Rate Your Experience</Typography>
      {CRITERIA.map((criterion) => (
        <Stack
          key={criterion.key}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: '10px' }}
        >
          <Typography sx={{ fontSize: '13.5px' }}>{criterion.label}</Typography>
          <StarRow
            value={ratings[criterion.key]}
            onChange={(n) => setRatings((prev) => ({ ...prev, [criterion.key]: n }))}
          />
        </Stack>
      ))}
      <Stack direction="row" spacing={1} sx={{ mt: '10px' }}>
        <Button variant="outlined" onClick={onCancel} sx={{ flex: 1, padding: '10px' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => onSubmit(ratings)}
          sx={{ flex: 1, padding: '10px' }}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  )
}
