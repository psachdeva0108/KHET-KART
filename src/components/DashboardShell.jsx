import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Drawer from '@mui/material/Drawer'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useAuth } from '../context/AuthContext'
import { getNotificationsForRole } from '../services/notificationService'
import BrandLogo from './BrandLogo'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ConsumerLocationButton from './ConsumerLocationButton'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import { useCart } from '../context/CartContext'

const SIDEBAR_WIDTH = 240

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function NavItem({ label, to, end, onClick, highlight, icon: Icon }) {
  return (
    <Box
      component={NavLink}
      to={to}
      end={end}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '11px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '14.5px',
        color: 'inherit',
        textDecoration: 'none',
        bgcolor: highlight ? 'rgba(221,123,43,0.22)' : 'transparent',
        border: highlight ? '1px solid rgba(221,123,43,0.55)' : '1px solid transparent',
        '&.active': { bgcolor: highlight ? 'rgba(221,123,43,0.3)' : 'rgba(255,255,255,0.18)' },
        '&:hover': { bgcolor: highlight ? 'rgba(221,123,43,0.3)' : 'rgba(255,255,255,0.08)' },
      }}
    >
      {Icon && <Icon sx={{ fontSize: 17 }} />}
      {label}
    </Box>
  )
}

// Shared dark-green sidebar + white topbar shell used by the Farmer, FPO and
// Consumer dashboards (product-spec §27, §35, §44). Each role's layout
// supplies its own orgName + navItems. Consumer additionally passes
// `showSearch` — its topbar replaces the org-name title with a global
// search input and a notification bell, since search is central to that
// role's flow (§46).
export default function DashboardShell({ orgName, navItems, showSearch }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, role, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [notifAnchor, setNotifAnchor] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (showSearch) getNotificationsForRole(role).then(setNotifications)
  }, [showSearch, role])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleSearchKeyDown(e) {
    if (e.key === 'Enter') {
      navigate(`/consumer/marketplace?q=${encodeURIComponent(searchValue)}`)
    }
  }

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100%',
        bgcolor: 'primary.darker',
        color: 'white',
        padding: '28px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ mb: '20px', px: '4px' }}>
        <BrandLogo dark iconSize={36} textSize={17} />
      </Box>

      {navItems.map((item) => (
        <NavItem
          key={item.to}
          label={item.label}
          to={item.to}
          end={item.end}
          highlight={item.highlight}
          icon={item.icon}
          onClick={(e) => {
            item.onClick?.(e)
            setMobileOpen(false)
          }}
        />
      ))}

      <Box sx={{ flex: '1 1 0' }} />
      <Box
        onClick={handleLogout}
        sx={{
          padding: '11px 14px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14.5px',
          opacity: 0.85,
        }}
      >
        Logout
      </Box>
    </Box>
  )

  return (
    // Fixed to exactly the viewport height with overflow hidden here, so the
    // sidebar itself never scrolls or drifts — only <main> below has its own
    // independent scroll region.
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isMobile && <Box sx={{ flexShrink: 0 }}>{sidebarContent}</Box>}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sidebarContent}
        </Drawer>
      )}

      <Box sx={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 28px',
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <Box
              component="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              sx={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: 'pointer',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              ☰
            </Box>
          )}

          {showSearch ? (
            <Box
              sx={{
                position: 'relative',
                flex: '1 1 0',
                maxWidth: 480,
                width: '100%',
              }}
            >
              <SearchIcon
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'text.secondary',
                  fontSize: 20,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              <Box
              component="input"
              aria-label="Search products, farmers or FPOs..."
              placeholder="Search products, farmers or FPOs..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              sx={{
                flex: '1 1 0',
                maxWidth: 480,
                width: '100%',
                padding: '10px 14px',
                borderRadius: '9px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.default',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
                pl: '38px',
              }}
            />
            </Box>
          ) : (
            <Typography sx={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: '17px', color: 'primary.darker' }}>
              {orgName}
            </Typography>
          )}

          {/* Skip this spacer only on mobile+search: below the 480px cap it'd split flex-grow evenly with the input and squeeze it. */}
          {!(showSearch && isMobile) && <Box sx={{ flex: '1 1 0' }} />}

          {showSearch && role === 'consumer' && <ConsumerLocationButton />}

          {showSearch && (
            <IconButton
              component="button"
              onClick={() => navigate('/cart')}
              aria-label="View Cart"
              sx={{
                width: 40,
                height: 40,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                flexShrink: 0,
              }}
            >
              <Badge badgeContent={itemCount} color="primary" showZero>
                <ShoppingCartOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          )}

          {showSearch && (
            <Box
              component="button"
              onClick={(e) => setNotifAnchor(e.currentTarget)}
              aria-label="Notifications"
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                cursor: 'pointer',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              🔔
            </Box>
          )}
          <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}>
            {notifications.length === 0 && <MenuItem disabled>No notifications</MenuItem>}
            {notifications.map((n) => (
              <MenuItem key={n.id} onClick={() => setNotifAnchor(null)} sx={{ whiteSpace: 'normal', maxWidth: 320 }}>
                {n.message}
              </MenuItem>
            ))}
          </Menu>

          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: 13, fontWeight: 700 }}>
              {initialsOf(user?.name ?? '?')}
            </Avatar>
            <Typography sx={{ fontWeight: 700, fontSize: 14, display: { xs: 'none', sm: 'block' } }}>
              {user?.name}
            </Typography>
          </Stack>
        </Box>

        <Box component="main" sx={{ flex: '1 1 0', overflowY: 'auto', overflowX: 'hidden', p: '28px', bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 1100, width: '100%', mx: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
