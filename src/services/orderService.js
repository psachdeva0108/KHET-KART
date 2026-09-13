import { api } from './api'
import { ACTIVE_ORDER_STATUSES } from '../constants'

export function getOrders() { return api.get('/orders').then((r) => r.data) }
export function getOrdersForConsumer() { return getOrders() }
export function getOrdersForFarmer() { return getOrders() }
export function getOrderById(orderId) { return api.get(`/orders/${encodeURIComponent(orderId)}`).then((r) => r.data) }
export function getOrderLinesForFarmerId(farmerId) {
  return getOrders().then((orders) => orders.flatMap((order) => order.items.filter((item) => Number(item.farmerId) === Number(farmerId)).map((item) => ({ orderId: order.id, buyerName: order.buyerName, status: order.status, placedAt: order.placedAt, productId: item.productId, productName: item.productName, quantity: item.quantity, price: item.price, total: item.quantity * item.price }))))
}
export function getEarningsForFarmer(farmerId) {
  return getOrderLinesForFarmerId(farmerId).then((lines) => {
    const now = new Date(), weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0,0,0,0)
    const delivered = lines.filter((l) => l.status === 'delivered'), pending = lines.filter((l) => ACTIVE_ORDER_STATUSES.includes(l.status))
    const sum = (xs) => xs.reduce((s, l) => s + Number(l.total || 0), 0)
    return { todayEarnings: sum(delivered.filter((l) => new Date(l.placedAt).toDateString() === now.toDateString())), weeklyEarnings: sum(delivered.filter((l) => new Date(l.placedAt) >= weekStart)), monthlyEarnings: sum(delivered.filter((l) => new Date(l.placedAt).getMonth() === now.getMonth() && new Date(l.placedAt).getFullYear() === now.getFullYear())), totalEarnings: sum(delivered), pendingPayments: sum(pending), completedTransactions: delivered.length, paymentHistory: delivered }
  })
}
export function createOrdersFromCart({ consumerId, buyerName, groupedByFarmer, deliveryFee, platformFee, paymentMethod, deliveryAddress }) {
  return api.post('/orders', { consumerId, buyerName, groupedByFarmer, deliveryFee, platformFee, paymentMethod, deliveryAddress }).then((r) => r.data)
}
export function getOrderGroupsForConsumer() {
  return getOrders().then((orders) => {
    const groups = new Map()
    orders.forEach((order) => { if (!groups.has(order.groupId)) groups.set(order.groupId, []); groups.get(order.groupId).push(order) })
    return [...groups.entries()].map(([groupId, groupOrders]) => ({ groupId, placedAt: groupOrders[0].placedAt, orders: groupOrders })).sort((a,b) => new Date(b.placedAt) - new Date(a.placedAt))
  })
}
