const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

export function formatQuantity(quantity, unit) {
  return `${quantity.toLocaleString('en-IN')} ${unit}`
}

export function daysAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const days = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}
