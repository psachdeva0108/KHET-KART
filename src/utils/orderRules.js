export const MIN_ORDER_KG = 10

// Convert the ordered quantity to kilograms for units whose weight is known.
// Current marketplace listings are kg-based; quintal is also supported.
export function quantityInKg(quantity, unit) {
  const value = Number(quantity) || 0
  if (unit === 'kg') return value
  if (unit === 'quintal') return value * 100
  return null
}

export function meetsMinimumOrder(quantity, unit) {
  const kg = quantityInKg(quantity, unit)
  return kg !== null && kg >= MIN_ORDER_KG
}

export function minimumOrderMessage(item) {
  if (item?.unit === 'kg') {
    return `${item.name} requires a minimum order of ${MIN_ORDER_KG} kg.`
  }
  if (item?.unit === 'quintal') {
    return `${item.name} requires a minimum order of ${MIN_ORDER_KG} kg (0.1 quintal).`
  }
  return `${item?.name ?? 'This product'} must be sold by weight (kg/quintal) to enforce the ${MIN_ORDER_KG} kg minimum order.`
}
