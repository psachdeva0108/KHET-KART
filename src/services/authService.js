import { api } from './api'

export function login({ email, aadhaar, password }) {
  return api.post('/auth/login', { email, aadhaar, password }).then((response) => response.data)
}

// product-spec §22-24: mock registration for all three roles. Always
// "succeeds" and logs the new user in as the role they registered for —
// there is no real backend or verification yet.
export function register(formValues) {
  return api.post('/auth/register', formValues).then((response) => response.data)
}
