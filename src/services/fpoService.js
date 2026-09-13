import { api } from './api'
export function getFpos() { return api.get('/fpos').then(r=>r.data) }
export function getFpoProfile(id) { return api.get(`/fpos/${id}`).then(r=>r.data) }
export function searchFposByQuery(query) { return getFpos().then(list=>{const q=query.trim().toLowerCase(); return q ? list.filter(f=>[f.name,f.location?.city,f.location?.state].some(v=>String(v||'').toLowerCase().includes(q))) : []}) }
export function getDashboardStats() { return api.get('/fpo-stats').then(r=>r.data) }
export function getMemberFarmers() { return Promise.all([getFarmers(), api.get('/products').then(r=>r.data)]).then(([farmers,products])=>farmers.map(f=>{const listings=products.filter(p=>Number(p.farmerId)===Number(f.id)); return {farmer:f,produceNames:[...new Set(listings.map(p=>p.name))],totalQuantity:listings.reduce((s,p)=>s+Number(p.availableQuantity||0),0),bestGrade:listings.some(p=>p.qualityGrade==='A+')?'A+':'A',status:listings.length?'Active':'No Listings'}})) }
export function getSupplyForProduct(productName) { return api.get(`/supply/${encodeURIComponent(productName)}`).then(r=>r.data) }
export function getProductNames() { return api.get('/products').then(r=>[...new Set(r.data.map(p=>p.name))]) }
export function getSupplyAnalytics() { return api.get('/supply-analytics').then(r=>r.data) }
function getFarmers(){return api.get('/farmers').then(r=>r.data)}
