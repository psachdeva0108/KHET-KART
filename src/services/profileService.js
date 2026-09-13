import { api } from './api'

export function getMyProfile() {
  return api.get('/me').then((response) => response.data)
}

export function updateMyProfile(values) {
  return api.patch('/me', values).then((response) => response.data)
}
