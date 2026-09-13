// Role-specific demo notifications. Values mirror the seeded database.
const NOTIFICATIONS_BY_ROLE = {
  farmer: [
    { id: 'N1', message: 'New order received for Onion (400 kg).' },
    { id: 'N2', message: 'Payment of ₹8,800 has been credited.' },
  ],
  fpo: [{ id: 'N3', message: 'New bulk requirement posted for Onion, 1,200 kg.' }],
  consumer: [{ id: 'N4', message: 'Your order ORD1001 has been delivered.' }],
}

export function getNotificationsForRole(role) {
  return Promise.resolve(NOTIFICATIONS_BY_ROLE[role] ?? [])
}
