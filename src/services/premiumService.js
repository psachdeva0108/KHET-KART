import { api } from './api'

export function purchasePremium(paymentMethod, renew = false) {
  return api.post('/premium/purchase', { paymentMethod, renew }).then((r) => r.data)
}
