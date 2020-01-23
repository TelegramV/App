const MapComponent = ({long, lat}) => {
	let url = `https://www.google.com/maps?q=${lat},${long}&output=embed`;
	return (
		<iframe src={url}/>
		)
}

export default MapComponent;