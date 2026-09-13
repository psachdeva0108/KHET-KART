import { api } from './api'
import { MARKET_PRICE_RANGES, ACTIVE_ORDER_STATUSES } from '../constants'
import { getOrderLinesForFarmerId } from './orderService'

export function getFarmers() { return api.get('/farmers').then((r) => r.data) }
export function getFarmerProfile(id) { return api.get(`/farmers/${id}`).then((r) => r.data) }
export function searchFarmersByQuery(query) {
  return getFarmers().then((farmers) => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return farmers.filter((f) => [f.name, f.farmName, f.location?.city, f.location?.state].some((v) => String(v || '').toLowerCase().includes(q)))
  })
}
export function getDashboardStats(farmerId) {
  return Promise.all([api.get(`/farmers/${farmerId}/products`), getOrderLinesForFarmerId(farmerId)]).then(([productsResponse, lines]) => {
    const listings = productsResponse.data
    const availableInventoryKg = listings.reduce((sum, p) => sum + Number(p.availableQuantity || 0), 0)
    const activeLines = lines.filter((line) => ACTIVE_ORDER_STATUSES.includes(line.status))
    const deliveredLines = lines.filter((line) => line.status === 'delivered')
    const sum = (items) => items.reduce((total, line) => total + Number(line.total || 0), 0)
    const reservedKg = activeLines.reduce((total, line) => total + Number(line.quantity || 0), 0)
    const soldKg = deliveredLines.reduce((total, line) => total + Number(line.quantity || 0), 0)
    return {
      totalProduceListedKg: availableInventoryKg + reservedKg + soldKg,
      availableInventoryKg,
      activeOrders: new Set(activeLines.map((line) => line.orderId)).size,
      completedOrders: new Set(deliveredLines.map((line) => line.orderId)).size,
      totalEarnings: sum(deliveredLines),
      pendingPayments: sum(activeLines),
    }
  })
}
export function getInventorySummary(farmerId) {
  return Promise.all([api.get(`/farmers/${farmerId}/products`), getOrderLinesForFarmerId(farmerId)]).then(([productsResponse, lines]) => {
    const listings = productsResponse.data
    const available = listings.reduce((sum, p) => sum + Number(p.availableQuantity || 0), 0)
    const reserved = lines.filter((l) => ACTIVE_ORDER_STATUSES.includes(l.status)).reduce((s, l) => s + Number(l.quantity || 0), 0)
    const sold = lines.filter((l) => l.status === 'delivered').reduce((s, l) => s + Number(l.quantity || 0), 0)
    return { available, reserved, sold, total: available + reserved + sold }
  })
}
export function getFairPriceInsights(farmerId) {
  return api.get(`/farmers/${farmerId}/products`).then((r) => r.data.map((listing) => {
    const range = MARKET_PRICE_RANGES.find((x) => x.name === listing.name)
    if (!range) return null
    const suggestedLow = range.low + 1, suggestedHigh = range.high - 2
    return { productId: listing.id, name: listing.name, marketLow: range.low, marketHigh: range.high, suggestedLow, suggestedHigh, yourPrice: listing.price, withinFairRange: listing.price >= suggestedLow && listing.price <= suggestedHigh }
  }).filter(Boolean))
}
