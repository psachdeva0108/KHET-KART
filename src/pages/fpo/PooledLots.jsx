import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import LoadingState from '../../components/LoadingState'
import EmptyState from '../../components/EmptyState'
import CreatePooledLotDialog from '../../components/CreatePooledLotDialog'
import PooledLotDetailDialog from '../../components/PooledLotDetailDialog'
import EditPooledLotDialog from '../../components/EditPooledLotDialog'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import StatusBadge from '../../components/StatusBadge'
import StatusCountTiles from '../../components/StatusCountTiles'
import { getPooledLotStatusMeta, POOLED_LOT_STATUS_META } from '../../utils/pooledLotStatus'
import { useAuth } from '../../context/AuthContext'
import {
  getPooledLots,
  createPooledLot,
  updateVerification,
  assignLogistics,
  updatePooledLot,
  deletePooledLot,
} from '../../services/pooledLotService'
function totalQuantityOf(lot) { return (lot?.contributions || []).reduce((sum, c) => sum + Number(c.quantity || 0), 0) }
import { formatQuantity } from '../../utils/format'

// product-spec §39: pooled lots list + Create Pooled Lot (§38 aggregation),
// View Details (§39/§40), Verify Quality (§41) and Assign Logistics (§43).
export default function PooledLots() {
  const { user } = useAuth()
  const location = useLocation()
  const fpoId = user?.linkedId
  const [lots, setLots] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedLotId, setSelectedLotId] = useState(null)
  const [editingLot, setEditingLot] = useState(null)

  useEffect(() => {
    getPooledLots(fpoId).then(setLots)
  }, [fpoId])

  useEffect(() => {
    if (location.state?.prefillProduct) setCreateOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function refresh() {
    getPooledLots(fpoId).then(setLots)
  }

  async function handleCreate(values) {
    await createPooledLot(fpoId, values)
    setCreateOpen(false)
    refresh()
  }

  async function handleVerify(lotId, verification) {
    await updateVerification(fpoId, lotId, verification)
    refresh()
  }

  async function handleEdit(values) {
    await updatePooledLot(fpoId, editingLot.id, values)
    setEditingLot(null)
    refresh()
  }

  async function handleDelete(lot) {
    if (!window.confirm(`Delete pooled lot ${lot.id}? This cannot be undone.`)) return
    try {
      await deletePooledLot(fpoId, lot.id)
      if (selectedLotId === lot.id) setSelectedLotId(null)
      refresh()
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || 'Could not delete pooled lot.')
    }
  }

  async function handleAssignLogistics(lotId, logisticsForm) {
    await assignLogistics(fpoId, lotId, { ...logisticsForm, status: 'Scheduled' })
    refresh()
    setSelectedLotId(null)
  }

  if (!lots) return <LoadingState message="Loading pooled lots..." />

  const selectedLot = lots.find((l) => l.id === selectedLotId) ?? null

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Pooled Lots</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          Create Pooled Lot
        </Button>
      </Stack>

      {lots.length === 0 && <EmptyState message="No pooled lots yet." />}

      {lots.length > 0 && (
        <Paper variant="outlined" sx={{ p: 2.25, borderRadius: '14px' }}>
          <StatusCountTiles
            rows={Object.keys(POOLED_LOT_STATUS_META).map((statusKey) => {
              const meta = POOLED_LOT_STATUS_META[statusKey]
              return {
                label: meta.label,
                count: lots.filter((l) => l.status === statusKey).length,
                icon: meta.icon,
                color: meta.color,
              }
            })}
          />
        </Paper>
      )}


      <Grid container spacing={2}>
        {lots.map((lot) => {
          const meta = getPooledLotStatusMeta(lot.status)
          return (
            <Grid item key={lot.id} xs={12} sm={6} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${meta.color}`,
                  '&:hover': { borderColor: 'primary.main', borderLeftColor: meta.color },
                }}
                onClick={() => setSelectedLotId(lot.id)}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Pooled Lot #{lot.id}
                  </Typography>
                  <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>Product: {lot.productName}</Typography>
                <Typography color="text.secondary">Total: {formatQuantity(totalQuantityOf(lot), 'kg')}</Typography>
                <Typography color="text.secondary">Grade: {lot.qualityGrade}</Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 1.5 }} onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Edit pooled lot">
                    <IconButton size="small" onClick={() => setEditingLot(lot)} aria-label={`Edit pooled lot ${lot.id}`}>
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete pooled lot">
                    <IconButton size="small" color="error" onClick={() => handleDelete(lot)} aria-label={`Delete pooled lot ${lot.id}`}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            </Grid>
          )
        })}
      </Grid>

      <CreatePooledLotDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        initialProduct={location.state?.prefillProduct}
        targetQuantity={location.state?.targetQuantity}
      />

      {editingLot && (
        <EditPooledLotDialog
          open={Boolean(editingLot)}
          onClose={() => setEditingLot(null)}
          lot={editingLot}
          onSave={handleEdit}
        />
      )}

      {selectedLot && (
        <PooledLotDetailDialog
          key={selectedLot.id}
          lot={selectedLot}
          onClose={() => setSelectedLotId(null)}
          onVerify={handleVerify}
          onAssignLogistics={handleAssignLogistics}
        />
      )}
    </Stack>
  )
}
