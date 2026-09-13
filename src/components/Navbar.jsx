import { useState } from 'react'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import BrandLogo from './BrandLogo'
import MenuIcon from '@mui/icons-material/Menu'
import useMediaQuery from '@mui/material/useMediaQuery'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Badge from '@mui/material/Badge'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '@mui/material/styles'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Farmers', to: '/farmers' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'About', to: '/about' },
  { label: 'Premium', to: '/premium' },
]

function Logo() {
  return (
    <BrandLogo
      iconWidth={62}
      iconFrameSx={{
        borderRadius: 0,
        bgcolor: 'transparent',
        p: 0,
      }}
    />
  )
}

// product-spec §9: public navbar, identical for every visitor before login.
export default function Navbar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { itemCount } = useCart()
  const { language, setLanguage, t } = useLanguage()

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e2db' }}>
      <Toolbar sx={{ position: 'relative', px: 3.5, py: 2, minHeight: 'auto', width: '100%' }}>
        <Logo />
        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <Stack
            direction="row"
            spacing={3.25}
            alignItems="center"
            sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                component={NavLink}
                to={link.to}
                underline="none"
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'text.primary',
                  '&.active': { color: 'primary.main' },
                }}
              >
                {t(link.label)}
              </Link>
            ))}
          </Stack>
        )}

        {!isMobile && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              component={RouterLink}
              to="/cart"
              aria-label={t('View Cart')}
              color="inherit"
              sx={{ mr: 0.5 }}
            >
              <Badge badgeContent={itemCount} color="primary" showZero>
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
            <Select size='small' value={language} onChange={(e)=>setLanguage(e.target.value)} sx={{minWidth:140}}>
              <MenuItem value='English'>English</MenuItem>
              <MenuItem value='Hindi'>हिंदी</MenuItem>
              <MenuItem value='Coming Soon' disabled>{t('Other Languages (Coming Soon)')}</MenuItem>
            </Select>
            <Button component={RouterLink} to="/login" variant="outlined">
              {t('Login')}
            </Button>
            <Button component={RouterLink} to="/register" variant="contained">
              {t('Register')}
            </Button>
          </Stack>
        )}

        {isMobile && (
          <IconButton edge="end" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton key={link.to} component={NavLink} to={link.to}>
                <ListItemText primary={t(link.label)} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton component={RouterLink} to="/cart">
              <ListItemText primary={`${t('View Cart')} (${itemCount})`} />
            </ListItemButton>
            <ListItemButton onClick={() => setLanguage('English')}>
              <ListItemText primary="English" />
            </ListItemButton>
            <ListItemButton onClick={() => setLanguage('Hindi')}>
              <ListItemText primary="हिंदी" />
            </ListItemButton>
            <ListItemButton disabled>
              <ListItemText primary={t('Other Languages (Coming Soon)')} />
            </ListItemButton>
          </List>
          <Divider />
          <List>
            <ListItemButton component={RouterLink} to="/login">
              <ListItemText primary={t("Login")} />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/register">
              <ListItemText primary={t("Register")} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}
