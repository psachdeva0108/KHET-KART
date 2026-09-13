
// Foundation service for role-specific notifications (product-spec §61) —
// not consumed by any Phase 1 page yet. No negotiation/message notifications,
// per §61/§79.
const NOTIFICATIONS_BY_ROLE = {
  farmer: [
    { id: 'N1', message: 'New order received for Onion (400 kg).' },
    { id: 'N2', message: 'Payment of ₹8,800 has been credited.' },
  ],
  fpo: [{ id: 'N3', message: 'New bulk requirement posted for Onion, 5,000 kg.' }],
  consumer: [{ id: 'N4', message: 'Your order ORD1001 has been dispatched.' }],
}

export function getNotificationsForRole(role) {
  return Promise.resolve(NOTIFICATIONS_BY_ROLE[role] ?? [])
}
