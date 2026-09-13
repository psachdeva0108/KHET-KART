import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import FarmerLayout from '../layouts/FarmerLayout'
import FPOLayout from '../layouts/FPOLayout'
import ConsumerLayout from '../layouts/ConsumerLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import Home from '../pages/public/Home'
import Marketplace from '../pages/public/Marketplace'
import ProductDetails from '../pages/public/ProductDetails'
import FarmerDirectory from '../pages/public/FarmerDirectory'
import FarmerProfile from '../pages/public/FarmerProfile'
import FpoProfile from '../pages/public/FpoProfile'
import HowItWorks from '../pages/public/HowItWorks'
import About from '../pages/public/About'
import Premium from '../pages/public/Premium'
import PremiumPayment from '../pages/public/PremiumPayment'
import Login from '../pages/public/Login'
import Register from '../pages/public/Register'
import Cart from '../pages/public/Cart'
import Payment from '../pages/public/Payment'
import NotFound from '../pages/public/NotFound'

import FarmerDashboard from '../pages/farmer/Dashboard'
import MyProduce from '../pages/farmer/MyProduce'
import DemandBoard from '../pages/farmer/DemandBoard'
import FarmerOrders from '../pages/farmer/Orders'
import FarmerEarnings from '../pages/farmer/Earnings'
import FarmerAccountProfile from '../pages/farmer/Profile'
import FpoDashboard from '../pages/fpo/Dashboard'
import FpoFarmers from '../pages/fpo/Farmers'
import PooledLots from '../pages/fpo/PooledLots'
import FpoOrders from '../pages/fpo/Orders'
import FpoLogistics from '../pages/fpo/Logistics'
import FpoAnalytics from '../pages/fpo/Analytics'
import FpoAccountProfile from '../pages/fpo/Profile'
import ConsumerDashboard from '../pages/consumer/Dashboard'
import ConsumerOrders from '../pages/consumer/Orders'
import ConsumerOrderTracking from '../pages/consumer/OrderTracking'
import Wishlist from '../pages/consumer/Wishlist'
import MyFarmers from '../pages/consumer/MyFarmers'
import ConsumerPremium from '../pages/consumer/Premium'
import ConsumerAccountProfile from '../pages/consumer/Profile'

// product-spec §8: public routes, plus the role-gated Farmer (§27),
// FPO (§35) and Consumer (§44) dashboard subtrees.
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="farmers" element={<FarmerDirectory />} />
        <Route path="farmer/:id" element={<FarmerProfile />} />
        <Route path="fpo/:id" element={<FpoProfile />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="about" element={<About />} />
        <Route path="premium" element={<Premium />} />
        <Route path="premium/payment" element={<PremiumPayment />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRole="farmer" />}>
          <Route path="farmer" element={<FarmerLayout />}>
            <Route index element={<FarmerDashboard />} />
            <Route path="produce" element={<MyProduce />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="demand" element={<DemandBoard />} />
            <Route path="earnings" element={<FarmerEarnings />} />
            <Route path="profile" element={<FarmerAccountProfile />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="fpo" />}>
          <Route path="fpo" element={<FPOLayout />}>
            <Route index element={<FpoDashboard />} />
            <Route path="farmers" element={<FpoFarmers />} />
            <Route path="pooled-lots" element={<PooledLots />} />
            <Route path="orders" element={<FpoOrders />} />
            <Route path="logistics" element={<FpoLogistics />} />
            <Route path="analytics" element={<FpoAnalytics />} />
            <Route path="profile" element={<FpoAccountProfile />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRole="consumer" />}>
          <Route path="consumer" element={<ConsumerLayout />}>
            <Route index element={<ConsumerDashboard />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="orders" element={<ConsumerOrders />} />
            <Route path="orders/:orderId" element={<ConsumerOrderTracking />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="farmers" element={<MyFarmers />} />
            <Route path="premium" element={<ConsumerPremium />} />
            <Route path="profile" element={<ConsumerAccountProfile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
