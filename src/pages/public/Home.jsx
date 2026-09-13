import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Fade from '@mui/material/Fade'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import HeroSlideshow from '../../components/HeroSlideshow'
import GlobalSearchBar from '../../components/GlobalSearchBar'
import CategoryChips from '../../components/CategoryChips'
import FeaturedProductCard from '../../components/FeaturedProductCard'
import MarketPriceTable from '../../components/MarketPriceTable'
import HowItWorksSteps from '../../components/HowItWorksSteps'
import LoadingState from '../../components/LoadingState'
import ProductCompareDialog from '../../components/ProductCompareDialog'
import { getProducts, getMarketPriceRanges } from '../../services/productService'
import { usePremiumMock } from '../../context/PremiumContext'

const sectionHeadingSx = { fontSize: '22px', mb: '18px' }
const MAX_COMPARE = 4
const HERO_HEIGHT = 560

// product-spec §10-14: hero, global search, categories, featured produce,
// market price section.
export default function Home() {
  const navigate = useNavigate()
  const { openModal } = usePremiumMock()
  const [featured, setFeatured] = useState(null)
  const [ranges, setRanges] = useState(null)
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)

  useEffect(() => {
    getProducts({ sortBy: 'recent' }).then((list) => setFeatured(list.slice(0, 6)))
    getMarketPriceRanges().then(setRanges)
  }, [])

  function toggleCompare(id) {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX_COMPARE ? [...prev, id] : prev
    )
  }

  const compareProducts = (featured || []).filter((p) => compareIds.includes(p.id))

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: HERO_HEIGHT,
          background: 'linear-gradient(#e5f3e8 0%, #fbf8f1 60%)',
          padding: '64px 24px 48px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <HeroSlideshow heightPx={500} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: 'clamp(30px, 5vw, 50px)',
              maxWidth: 820,
              mx: 'auto',
              mb: 2,
              color: '#ffffff',
              textShadow: '0 2px 18px rgba(0,0,0,0.35)',
            }}
          >
            Fresh Produce. Directly From Verified Farmers.
          </Typography>
          <Typography
            sx={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.92)',
              maxWidth: 620,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
              textShadow: '0 1px 10px rgba(0,0,0,0.3)',
            }}
          >
            Discover fresh produce from verified farmers and FPOs, compare prices and quality,
            and purchase directly through a transparent agricultural marketplace.
          </Typography>
          <Box sx={{ mb: 3 }}>
            <GlobalSearchBar />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75} justifyContent="center">
            <Button variant="contained" size="large" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffffff',
                borderColor: '#ffffff',
                color: '#057a3f',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.14)',
                '&:hover': {
                  backgroundColor: '#f4f8f5',
                  borderColor: '#ffffff',
                  color: '#045d31',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                },
              }}
            >
              Join the Platform
            </Button>
          </Stack>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={sectionHeadingSx}>
          Browse by Category
        </Typography>
        <CategoryChips />
      </Container>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" sx={sectionHeadingSx}>
          Featured Produce
        </Typography>
        {!featured && <LoadingState message="Loading featured produce..." />}
        {featured && (
          <Grid container spacing={2.25}>
            {featured.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <FeaturedProductCard
                  product={product}
                  compareChecked={compareIds.includes(product.id)}
                  compareDisabled={!compareIds.includes(product.id) && compareIds.length >= MAX_COMPARE}
                  onToggleCompare={toggleCompare}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box
          onClick={openModal}
          sx={{
            cursor: 'pointer',
            borderRadius: '16px',
            p: { xs: '22px', sm: '28px 32px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '18px',
            flexWrap: 'wrap',
            background: 'linear-gradient(120deg, #053e1d 0%, #04773b 55%, #dd7b2b 150%)',
            color: '#fff',
            boxShadow: '0 0 0 1px rgba(221,123,43,0.4), 0 10px 30px rgba(4,119,59,0.28)',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: '0 0 0 1px rgba(221,123,43,0.6), 0 14px 38px rgba(4,119,59,0.38)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AutoAwesomeIcon />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 800, fontSize: '18px' }}>
                Unlock AgriPlus Premium
              </Typography>
              <Typography sx={{ fontSize: '13.5px', opacity: 0.92 }}>
                Priority allocation on high-demand produce, lower delivery fees, and demand-forecast alerts.
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="contained"
            size="large"
            sx={{ bgcolor: '#fff', color: 'primary.darker', fontWeight: 700, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#f2ede2' } }}
          >
            Explore Premium Benefits
          </Button>
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={sectionHeadingSx}>
          Market Price Ranges (Sample)
        </Typography>
        {ranges && <MarketPriceTable ranges={ranges} />}
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={sectionHeadingSx}>
          How It Works
        </Typography>
        <HowItWorksSteps />
      </Container>

      <Fade in={compareIds.length >= 2}>
        <Button
          variant="contained"
          onClick={() => setCompareOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '999px',
            px: 3,
            py: 1.2,
            boxShadow: '0 6px 20px rgba(4,119,59,0.35)',
            zIndex: 1200,
          }}
        >
          Compare ({compareIds.length})
        </Button>
      </Fade>

      <ProductCompareDialog
        open={compareOpen}
        products={compareProducts}
        onClose={() => setCompareOpen(false)}
        onRemove={toggleCompare}
      />
    </Box>
  )
}
