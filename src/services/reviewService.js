import { api } from './api'

// product-spec §56: reviews appear on Product, Farmer profile and FPO
// profile where applicable.
export function getReviewsForFarmer(farmerId) {
  return api.get('/reviews', { params: { farmerId } }).then((response) => response.data)
}

export function getReviewsForProduct(productId) {
  return api.get('/reviews', { params: { productId } }).then((response) => response.data)
}

export function hasReviewedOrder(orderId) {
  return api.get('/reviews').then((reviews) => reviews.data.some((review) => review.orderId === orderId))
}

// product-spec §56: "Rate Your Experience" — submitted once, after delivery.
// `ratings` carries its own `overall` entry (a distinct star row the
// consumer sets, not an average of the other four).
export function submitReview({ orderId, consumerId, reviewerName, farmerId, productId, ratings }) {
  return api.post('/reviews', { orderId, consumerId, reviewerName, farmerId, productId, ratings }).then((response) => response.data)
}
