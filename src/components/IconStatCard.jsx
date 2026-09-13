import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Icon-accented stat tile — visually matches the FPO Analytics page's KPI
// cards. Distinct from the plain <StatCard> used on the Farmer/Consumer
// dashboards, which is left untouched.
export default function IconStatCard({ icon: Icon, tone = '#04773b', label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.25, borderRadius: '14px', height: '100%' }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: `${tone}1a`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ color: tone, fontSize: 20 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>{label}</Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: 'primary.darker' }} noWrap>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  )
}
