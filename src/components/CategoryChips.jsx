import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../services/productService'

// product-spec §12: "Browse by Category" — reference design renders these as
// a row of equal-width bordered cards, not small pill chips.
export default function CategoryChips() {
  const navigate = useNavigate()
  const categories = getCategories()

  return (
    <Grid container spacing={1.5}>
      {categories.map((category) => (
        <Grid item key={category} xs={6} sm={4} md={2}>
          <Box
            onClick={() => navigate(`/marketplace?category=${encodeURIComponent(category)}`)}
            sx={{
              border: '1px solid #e0e2db',
              borderRadius: '12px',
              bgcolor: 'background.paper',
              py: 2.25,
              px: 1.25,
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '13.5px',
              color: 'primary.darker',
              cursor: 'pointer',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 4px 12px rgba(20,60,40,0.08)',
              },
            }}
          >
            {category}
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
