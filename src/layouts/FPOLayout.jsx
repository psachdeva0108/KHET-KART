import DashboardShell from '../components/DashboardShell'
import { useAuth } from '../context/AuthContext'

// product-spec §35: FPO sidebar — Dashboard, Farmers, Pooled Lots, Orders,
// Logistics, Analytics, Profile.
export default function FPOLayout() {
  const { user } = useAuth()

  const navItems = [
    { label: 'Dashboard', to: '/fpo', end: true },
    { label: 'Farmers', to: '/fpo/farmers' },
    { label: 'Pooled Lots', to: '/fpo/pooled-lots' },
    { label: 'Orders', to: '/fpo/orders' },
    { label: 'Logistics', to: '/fpo/logistics' },
    { label: 'Analytics', to: '/fpo/analytics' },
    { label: 'Profile', to: '/fpo/profile' },
  ]

  return <DashboardShell orgName={user?.name ?? 'FPO Dashboard'} navItems={navItems} />
}
