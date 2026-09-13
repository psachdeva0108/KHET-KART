import { api } from './api'
export function getLogisticsForOrder(orderId) { return api.get(`/logistics/${encodeURIComponent(orderId)}`).then(r=>r.data) }
