import { api } from './api'

// product-spec §39: pooled lots for this FPO. Seed lots (data/pooledLots.js)
// plus any created in this browser, with any verification/logistics updates
// merged in — frontend simulation only, persisted to localStorage (§82).
export function getPooledLots(fpoId) {
  return api.get(`/fpos/${fpoId}/pooled-lots`).then((response) => response.data)
}

// product-spec §38/§39: "Create Pooled Lot" — aggregates selected farmer
// contributions into a new lot.
export function createPooledLot(fpoId, { productName, qualityGrade, salePrice, contributions }) {
  return api.post('/pooled-lots', { fpoId, productName, qualityGrade, salePrice, contributions }).then((response) => response.data)
}

// product-spec §41: quality verification checklist. Once all three are
// checked, the lot is marked verified and ready for pickup.
export function updateVerification(fpoId, lotId, verification) {
  const allVerified =
    verification.quantityVerified && verification.qualityVerified && verification.packagingVerified
  const patch = { verification, ...(allVerified ? { status: 'ready_for_pickup' } : {}) }
  return api.patch(`/pooled-lots/${lotId}`, patch).then((response) => response.data)
}

// product-spec §43: "Assign Logistics" from a pooled lot's detail view.
export function assignLogistics(fpoId, lotId, logistics) {
  return api.patch(`/pooled-lots/${lotId}`, { logistics }).then((response) => response.data)
}

export function updatePooledLot(fpoId, lotId, values) {
  return api.patch(`/pooled-lots/${lotId}`, values).then((response) => response.data)
}

export function deletePooledLot(fpoId, lotId) {
  return api.delete(`/pooled-lots/${lotId}`).then((response) => response.data)
}
