export const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Other Produce']
export const MARKET_PRICE_RANGES = [
  { name: 'Onion', low: 20, high: 24, unit: 'kg' },
  { name: 'Potato', low: 18, high: 19, unit: 'kg' },
  { name: 'Tomato', low: 25, high: 29, unit: 'kg' },
  { name: 'Wheat', low: 29, high: 30, unit: 'kg' },
  { name: 'Rice', low: 40, high: 42, unit: 'kg' },
  { name: 'Chana (Gram)', low: 65, high: 68, unit: 'kg' },
  { name: 'Apple', low: 110, high: 110, unit: 'kg' },
  { name: 'Turmeric', low: 85, high: 90, unit: 'kg' },
]
export const ORDER_STATUS_LABELS = {
  received: 'Received', accepted: 'Accepted', preparing: 'Preparing', packed: 'Packed',
  pickup: 'Pickup Assigned', dispatched: 'Dispatched', delivered: 'Delivered',
}
export const ACTIVE_ORDER_STATUSES = ['received', 'accepted', 'preparing', 'packed', 'pickup', 'dispatched']
export function totalQuantityOf(lot) { return (lot?.contributions || []).reduce((sum, c) => sum + Number(c.quantity || 0), 0) }
