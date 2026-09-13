import { api } from './api'
export function getDemand() { return api.get('/demand').then(r=>r.data) }
