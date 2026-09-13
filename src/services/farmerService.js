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
export function getDashboardStats() {
  return api.get('/farmers').then((r) => ({ totalProduceListedKg: r.data.reduce((s, f) => s + Number(f.totalProduceListedKg || 0), 0), availableInventoryKg: r.data.reduce((s, f) => s + Number(f.availableInventoryKg || 0), 0), activeOrders: 0, completedOrders: 0, totalEarnings: 0, pendingPayments: 0 }))
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
