import { useMemo } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'

// Blue marker for current/active points
const blueMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMiIgZmlsbD0iIzZCQTNEOCIgc3Ryb2tlPSIjRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iNiIgZmlsbD0iI0ZGRkYiLz48L3N2Zz4=',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -10],
})

// Green marker for completed/upcoming points
const greenMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMiIgZmlsbD0iIzZDQzdCNSIgc3Ryb2tlPSIjRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iNiIgZmlsbD0iI0ZGRkYiLz48L3N2Zz4=',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -10],
})

export function MapRoute({ pickup, dropoff, waypoints = [] }) {
  // Build full route from pickup -> waypoints -> dropoff
  const center = useMemo(() => {
    if (!pickup || !dropoff) return { lat: 14.7167, lng: -17.4677 }
    return {
      lat: (pickup.lat + dropoff.lat) / 2,
      lng: (pickup.lng + dropoff.lng) / 2,
    }
  }, [pickup, dropoff])

  // Full route line (dashed)
  const route = useMemo(() => {
    if (!pickup || !dropoff) return []
    const fullRoute = [pickup, ...waypoints, dropoff]
    return fullRoute.filter(Boolean)
  }, [pickup, dropoff, waypoints])

  // All points to mark
  const allPoints = useMemo(() => {
    const points = []
    if (pickup) points.push({ ...pickup, type: 'pickup', label: 'Départ' })
    if (waypoints?.length) {
      waypoints.forEach((wp, idx) => {
        points.push({ ...wp, type: 'waypoint', label: `Étape ${idx + 1}` })
      })
    }
    if (dropoff) points.push({ ...dropoff, type: 'dropoff', label: 'Destination' })
    return points
  }, [pickup, dropoff, waypoints])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '420px', borderRadius: '18px', overflow: 'hidden' }}
      className="tour-map"
    >
      {/* Carte OSM claire */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dashed route line */}
      {route.length > 1 && (
        <Polyline 
          positions={route.map((p) => [p.lat, p.lng])} 
          color="#6BA3D8"
          weight={2}
          dashArray="5, 5"
          opacity={0.8}
        />
      )}

      {/* Markers for all points */}
      {allPoints.map((point, idx) => {
        const isEnd = point.type === 'dropoff'
        const icon = isEnd ? greenMarkerIcon : blueMarkerIcon
        
        return (
          <Marker 
            key={`${point.type}-${idx}`}
            position={[point.lat, point.lng]} 
            icon={icon}
          >
            <Popup>
              <strong>{point.label}</strong>
              {point.address && <p>{point.address}</p>}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
