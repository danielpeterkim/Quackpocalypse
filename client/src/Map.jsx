import { MapContainer, TileLayer } from "react-leaflet"
import './Map.css'
function Map() {

  return (
    <div className="Map">
        <MapContainer center={[0,0]} zoom={3} scrollWheelZoom={false}>
            <TileLayer
                attribution='its offline'
                url={'./assets/Stevens/{z}/{x}/{y}.png'}
            />
        </MapContainer>
    </div>
  )
}

export default Map
