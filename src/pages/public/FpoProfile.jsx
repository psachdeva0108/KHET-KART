import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import VerifiedBadge from '../../components/VerifiedBadge'
import RatingDisplay from '../../components/RatingDisplay'
import { getFpoProfile } from '../../services/fpoService'

// product-spec §8: public FPO profile. Pooled-lot/bulk-order detail belongs
// to the FPO dashboard phase (§39-42) — this is the public-facing summary.
export default function FpoProfile() {
  const { id } = useParams()
  const [fpo, setFpo] = useState(undefined)

  useEffect(() => {
    setFpo(undefined)
    getFpoProfile(id).then(setFpo)
  }, [id])

  if (fpo === undefined) return <LoadingState message="Loading FPO profile..." />
  if (fpo === null) return <EmptyState message="FPO not found." />

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}>
            {fpo.name[0]}
          </Avatar>
          <Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h5">{fpo.name}</Typography>
              {fpo.verified && <VerifiedBadge label="Verified FPO" />}
            </Stack>
            <Typography color="text.secondary">
              Represented by {fpo.representative} · {fpo.location.city}, {fpo.location.state}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <RatingDisplay value={fpo.rating} />
              <Typography variant="body2" color="text.secondary">
                · {fpo.memberCount} member farmers
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Aggregated Crops
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {fpo.crops.map((crop) => (
            <Chip key={crop} label={crop} variant="outlined" />
          ))}
        </Stack>
      </Paper>
    </Container>
  )
}
