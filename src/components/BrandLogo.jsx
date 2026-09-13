import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import logoIcon from '../assets/khet2kart-icon.png'

/** Reusable KHET2KART brand logo used across the application. */
export default function BrandLogo({
  to = '/',
  compact = false,
  dark = false,
  iconSize = 46,
  iconWidth = iconSize,
  textSize = 24,
  iconFrameSx = {},
}) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      component={to ? RouterLink : 'div'}
      to={to || undefined}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: iconWidth,
          height: iconSize,
          borderRadius: Math.round(iconSize * 0.22),
          bgcolor: dark ? 'rgba(255,255,255,0.14)' : '#0d6b3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
          p: 0.35,
          ...iconFrameSx,
        }}
      >
        <Box
          component="img"
          src={logoIcon}
          alt="KHET2KART logo"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>

      {!compact && (
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            fontSize: textSize,
            lineHeight: 1,
            letterSpacing: '0.02em',
            color: dark ? 'white' : '#16302b',
            whiteSpace: 'nowrap',
          }}
        >
          KHET2KART
        </Typography>
      )}
    </Stack>
  )
}
