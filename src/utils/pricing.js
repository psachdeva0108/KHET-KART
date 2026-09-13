// product-spec §52: transparent checkout pricing. Delivery fee is per
// farmer group (each ships separately); Premium includes standard delivery
// (§57) so it's waived rather than hidden.
const DELIVERY_FEE_PER_FARMER = 100
const PLATFORM_FEE_RATE = 0.03

export function computeCheckoutFees(produceTotal, farmerCount, isPremium) {
  const deliveryFee = isPremium ? 0 : DELIVERY_FEE_PER_FARMER * farmerCount
  const platformFee = Math.round(produceTotal * PLATFORM_FEE_RATE * 100) / 100
  return {
    deliveryFee,
    platformFee,
    total: produceTotal + deliveryFee + platformFee,
  }
}
