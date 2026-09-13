import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { PremiumProvider } from './context/PremiumContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import AppRoutes from './routes/AppRoutes'
import PremiumUpgradeModal from './components/PremiumUpgradeModal'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

function CartFeedback() {
  const { notification, clearNotification } = useCart()
  const { t } = useLanguage()
  const navigate = useNavigate()
  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={3500}
      onClose={clearNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        severity="success"
        variant="filled"
        onClose={clearNotification}
        action={
          <Button color="inherit" size="small" onClick={() => { clearNotification(); navigate('/cart') }}>
            {t('View Cart')}
          </Button>
        }
      >
        {notification ? `${notification.quantity} × ${notification.productName} ${t('added to cart')}` : ''}
      </Alert>
    </Snackbar>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <PremiumProvider>
                <AppRoutes />
                <CartFeedback />
                <PremiumUpgradeModal />
              </PremiumProvider>
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
