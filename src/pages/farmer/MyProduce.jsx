import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import AddProduceDialog from '../../components/AddProduceDialog'
import DataTable from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { createProduct, getProductsForFarmer, updateProduct, deleteProduct } from '../../services/productService'
import { formatCurrency } from '../../utils/format'

export default function MyProduce() {
  const { user } = useAuth()
  const location = useLocation()
  const [produce, setProduce] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => { if (user?.linkedId) getProductsForFarmer(user.linkedId).then(setProduce).catch(console.error) }, [user?.linkedId])

  useEffect(() => {
    if (location.state?.prefillProduct) {
      setPrefill({ name: location.state.prefillProduct, location: '' })
      setDialogOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleAdd(formValues) {
    if (editingProduct) {
      const product = await updateProduct(editingProduct.id, formValues)
      setProduce((prev) => prev.map((item) => (item.id === product.id ? product : item)))
    } else {
      const product = await createProduct(formValues)
      setProduce((prev) => [product, ...prev])
    }
    setEditingProduct(null)
    setDialogOpen(false)
  }

  async function handleDelete(item) {
    if (!window.confirm(`Remove ${item.name} from My Produce? This cannot be undone.`)) return
    try {
      await deleteProduct(item.id)
      setProduce((prev) => prev.filter((product) => product.id !== item.id))
    } catch (error) {
      window.alert(error.response?.data?.message || error.message || 'Could not remove produce.')
    }
  }

  function openEdit(item) {
    setEditingProduct(item)
    setPrefill({ ...item, quantity: item.availableQuantity, location: item.farmer?.location?.city ?? '' })
    setDialogOpen(true)
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '22px' }}>
          My Produce
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingProduct(null); setPrefill(null); setDialogOpen(true) }}
          sx={{ padding: '10px 18px', fontSize: 14 }}
        >
          Add Produce
        </Button>
      </Stack>

      {produce.length === 0 && <EmptyState message="You haven't listed any produce yet." />}

      {produce.length > 0 && (
        <DataTable>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Listed Price</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Harvest</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produce.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image ? (
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{
                        width: 64,
                        height: 48,
                        objectFit: 'cover',
                        borderRadius: '8px',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No image
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{item.name}</TableCell>
                <TableCell>
                  {item.availableQuantity.toLocaleString('en-IN')} {item.unit}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {formatCurrency(item.price)}/{item.unit}
                </TableCell>
                <TableCell>{item.qualityGrade}</TableCell>
                <TableCell>{item.harvestDate}</TableCell>
                <TableCell>
                  <StatusBadge tone={item.availableQuantity > 0 ? 'green' : 'neutral'}>
                    {item.availableQuantity > 0 ? 'Available' : 'Sold Out'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit produce">
                      <IconButton size="small" onClick={() => openEdit(item)} aria-label={`Edit ${item.name}`}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove produce">
                      <IconButton size="small" color="error" onClick={() => handleDelete(item)} aria-label={`Remove ${item.name}`}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      )}

      <AddProduceDialog
        key={editingProduct?.id ?? prefill?.name ?? 'blank'}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
        defaults={prefill ?? {}}
        isEditing={Boolean(editingProduct)}
      />
    </Stack>
  )
}
