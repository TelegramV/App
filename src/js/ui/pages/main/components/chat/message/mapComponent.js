const MapComponent = ({long, lat, place_id}) => {
	let url = `https://www.google.com/maps?q=${lat},${long}&output=embed`;
	return (
		<iframe class="embed-map" src={url}/>
		)
}

export default MapComponent;