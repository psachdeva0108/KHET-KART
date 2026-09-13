import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DashboardShell from '../components/DashboardShell'
import { usePremiumMock } from '../context/PremiumContext'

// product-spec §44: Consumer sidebar — Dashboard, Marketplace, My Orders,
// Wishlist, My Farmers, Premium, Profile. "My Farmers" is just a saved/
// previously-purchased-from list, not a private connection (§44/§54).
export default function ConsumerLayout() {
  const { openModal } = usePremiumMock()

  const navItems = [
    { label: 'Dashboard', to: '/consumer', end: true },
    { label: 'Marketplace', to: '/consumer/marketplace' },
    { label: 'My Orders', to: '/consumer/orders' },
    { label: 'Wishlist', to: '/consumer/wishlist' },
    { label: 'My Farmers', to: '/consumer/farmers' },
    {
      label: 'Premium',
      to: '/consumer/premium',
      highlight: true,
      icon: AutoAwesomeIcon,
      // Opens the mock upgrade modal instead of navigating to the full
      // /consumer/premium page (that page + the real activate/renew flow
      // still exist and are reachable directly by URL).
      onClick: (e) => {
        e.preventDefault()
        openModal()
      },
    },
    { label: 'Profile', to: '/consumer/profile' },
  ]

  return <DashboardShell orgName="Consumer Dashboard" navItems={navItems} showSearch />
}
