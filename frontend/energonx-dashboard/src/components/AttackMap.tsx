import { MapContainer,TileLayer,Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export default function AttackMap(){

 return(

 <div className="card h-72">

 <h2 className="mb-4">Global Attack Map</h2>

 <MapContainer
  center={[20,0]}
  zoom={2}
  style={{height:"90%"}}
 >

 <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker position={[37,-122]}/>

 </MapContainer>

 </div>

 )

}
