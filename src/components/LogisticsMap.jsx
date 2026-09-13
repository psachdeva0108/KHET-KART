import { useEffect, useMemo, useRef } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// FPO Logistics map — collection hub, farmer village pickup points, city drop
// hub, and last-mile consumer delivery checkpoints, with a truck animated
// along the full AI-sequenced route on an 8s loop. Coordinates are hardcoded
// (Nashik district, Maharashtra) — UI-only, no backend call, matching the
// rest of this feature's mock/local-state scope.
const COLLECTION_HUB = { name: 'Niphad Collection Hub', lat: 20.0827, lng: 74.1088 }
const CITY_DROP_HUB = { name: 'Nashik City Drop Hub', lat: 19.9975, lng: 73.7898 }
const FARMER_VILLAGES = [
  { name: 'Sinnar Village Point', lat: 19.8489, lng: 73.9997 },
  { name: 'Yeola Village Point', lat: 20.0419, lng: 74.4863 },
  { name: 'Dindori Village Point', lat: 20.2065, lng: 73.8332 },
]
// Last-mile stops — individual consumers/bulk buyers the FPO delivers to
// after the trunk route reaches the city drop hub.
const CONSUMER_STOPS = [
  { name: 'Panchavati Delivery Point', lat: 19.9895, lng: 73.7975 },
  { name: 'Nashik Road Delivery Point', lat: 19.966, lng: 73.8112 },
  { name: 'Mahatma Nagar Delivery Point', lat: 19.9781, lng: 73.7642 },
  { name: 'Satpur Delivery Point', lat: 20.0064, lng: 73.7813 },
]

// Full loop: collection hub -> trunk route -> city drop hub -> AI-sequenced
// last-mile consumer stops -> back to collection hub. The consumer leg order
// is the "optimized" part of the demo — nearest-neighbour from the drop hub
// rather than the order the stops are listed in above.
const ROUTE = [
  [COLLECTION_HUB.lat, COLLECTION_HUB.lng],
  [20.045, 73.99],
  [20.01, 73.85],
  [CITY_DROP_HUB.lat, CITY_DROP_HUB.lng],
  [CONSUMER_STOPS[0].lat, CONSUMER_STOPS[0].lng],
  [CONSUMER_STOPS[1].lat, CONSUMER_STOPS[1].lng],
  [CONSUMER_STOPS[2].lat, CONSUMER_STOPS[2].lng],
  [CONSUMER_STOPS[3].lat, CONSUMER_STOPS[3].lng],
  [COLLECTION_HUB.lat, COLLECTION_HUB.lng],
]

const LOOP_MS = 20000
const EARTH_RADIUS_KM = 6371

function haversineKm([lat1, lng1], [lat2, lng2]) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

function hubIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px ${color}66;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function consumerIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="width:11px;height:11px;border-radius:3px;background:#2f6fed;border:2px solid #fff;box-shadow:0 0 0 2px #2f6fed55;transform:rotate(45deg);"></div>',
    iconSize: [11, 11],
    iconAnchor: [6, 6],
  })
}

function truckIcon() {
  return L.divIcon({
    className: '',
    html: '<div style="font-size:20px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35));transform:translate(-50%,-50%);">🚚</div>',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Segment lengths (raw lat/lng units, for the animation) so the truck moves
// at a constant visual speed across unevenly-spaced segments instead of
// lingering on short ones.
function segmentLengths(points) {
  const lens = []
  for (let i = 0; i < points.length - 1; i++) {
    const [lat1, lng1] = points[i]
    const [lat2, lng2] = points[i + 1]
    lens.push(Math.hypot(lat2 - lat1, lng2 - lng1))
  }
  return lens
}

function pointAt(points, lens, total, t) {
  let dist = t * total
  for (let i = 0; i < lens.length; i++) {
    if (dist <= lens[i] || i === lens.length - 1) {
      const frac = lens[i] === 0 ? 0 : dist / lens[i]
      const [lat1, lng1] = points[i]
      const [lat2, lng2] = points[i + 1]
      return [lat1 + (lat2 - lat1) * frac, lng1 + (lng2 - lng1) * frac]
    }
    dist -= lens[i]
  }
  return points[points.length - 1]
}

export default function LogisticsMap() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  const totalDistanceKm = useMemo(() => {
    let sum = 0
    for (let i = 0; i < ROUTE.length - 1; i++) sum += haversineKm(ROUTE[i], ROUTE[i + 1])
    return Math.round(sum)
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
    }).setView([COLLECTION_HUB.lat, (COLLECTION_HUB.lng + CITY_DROP_HUB.lng) / 2], 10)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    L.marker([COLLECTION_HUB.lat, COLLECTION_HUB.lng], { icon: hubIcon('#04773b') })
      .addTo(map)
      .bindPopup(`<strong>${COLLECTION_HUB.name}</strong><br/>Collection hub`)

    L.marker([CITY_DROP_HUB.lat, CITY_DROP_HUB.lng], { icon: hubIcon('#dd7b2b') })
      .addTo(map)
      .bindPopup(`<strong>${CITY_DROP_HUB.name}</strong><br/>City drop hub`)

    FARMER_VILLAGES.forEach((v) => {
      L.marker([v.lat, v.lng], { icon: hubIcon('#8a5a2b') })
        .addTo(map)
        .bindPopup(`<strong>${v.name}</strong><br/>Farmer village pickup point`)
    })

    CONSUMER_STOPS.forEach((c, i) => {
      L.marker([c.lat, c.lng], { icon: consumerIcon() })
        .addTo(map)
        .bindPopup(`<strong>Stop ${i + 1} · ${c.name}</strong><br/>Consumer delivery checkpoint`)
    })

    const polyline = L.polyline(ROUTE, {
      color: '#04773b',
      weight: 3,
      opacity: 0.6,
      dashArray: '6 8',
    }).addTo(map)
    map.fitBounds(polyline.getBounds().pad(0.3))

    const truck = L.marker(ROUTE[0], { icon: truckIcon(), zIndexOffset: 1000, interactive: false }).addTo(map)
    const lens = segmentLengths(ROUTE)
    const total = lens.reduce((a, b) => a + b, 0)

    let start = null
    let frameId
    const step = (ts) => {
      if (start === null) start = ts
      const elapsed = (ts - start) % LOOP_MS
      const t = elapsed / LOOP_MS
      truck.setLatLng(pointAt(ROUTE, lens, total, t))
      frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frameId)
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <Paper sx={{ p: '14px', borderRadius: '12px' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: '4px' }} flexWrap="wrap">
        <Typography sx={{ fontFamily: '"Sora", sans-serif', color: 'primary.darker', fontSize: '17px' }}>
          Delivery Route
        </Typography>
        <Tooltip title="Stop sequence and path are computed to minimize total distance across the hub-to-hub trunk leg and last-mile consumer stops.">
          <Chip
            size="small"
            icon={<AutoAwesomeIcon sx={{ fontSize: 15 }} />}
            label="AI-Optimized Route"
            sx={{ bgcolor: 'primary.main', color: '#fff', fontWeight: 700, '& .MuiChip-icon': { color: '#fff' } }}
          />
        </Tooltip>
      </Stack>
      <Typography sx={{ fontSize: '12.5px', color: 'text.secondary', mb: '12px' }}>
        {1 + CONSUMER_STOPS.length} stops · ~{totalDistanceKm} km full loop · sequenced to cut trunk + last-mile
        distance
      </Typography>
      <div ref={containerRef} style={{ height: 360, width: '100%', borderRadius: 9, overflow: 'hidden' }} />
    </Paper>
  )
}
