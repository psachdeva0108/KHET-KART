import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// product-spec §1/§9: the same public shell for every visitor before login.
export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
