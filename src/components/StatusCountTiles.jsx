import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// rows: [{ label, count, icon, color }]
export default function StatusCountTiles({ rows }) {
  return (
    <Grid container spacing={1.5}>
      {rows.map(({ label, count, icon: Icon, color }) => (
        <Grid item xs={4} key={label}>
          <Stack alignItems="center" spacing={0.75} sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: `${color}1a`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ color, fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.darker' }}>{count}</Typography>
            <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{label}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}
