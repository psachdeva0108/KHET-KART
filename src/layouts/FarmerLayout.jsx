import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'

// product-spec §27: Farmer sidebar — Dashboard, My Produce, Demand Board,
// Orders, Earnings, Profile. No negotiations/messages/direct contacts.
export default function FarmerLayout() {
  const { user } = useAuth()

  const navItems = [
    { label: 'Dashboard', to: '/farmer', end: true },
    { label: 'My Produce', to: '/farmer/produce' },
    { label: 'Demand Board', to: '/farmer/demand' },
    { label: 'Orders', to: '/farmer/orders' },
    { label: 'Earnings', to: '/farmer/earnings' },
    { label: 'Profile', to: '/farmer/profile' },
  ]

  return <DashboardShell orgName={user?.name ? `${user.name}'s Farm` : 'Farmer Dashboard'} navItems={navItems} />
}
