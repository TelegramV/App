import {FileAPI} from "../../../../../Api/Files/FileAPI";
import {ObjectWithThumbnailComponent} from "../../../Basic/objectWithThumbnailComponent";

const loadObject = (map, onProgress) => {
    map.real = {
        thumbnail: true,
        size: {width: 300, height: 300},
        src: ""
    }
    let fl = FileAPI.prepareWebFileLocation(map.geo, 300, 300, map.zoom, map.scale);
    return FileAPI.getWebFile(fl).then(url => {
        map.real = {
            thumbnail: false,
            src: url
        }
    })
}

const slotLoaded = (map, real) => {
    return <img src={real.src} alt=""/>
}

const slotLoadingWidth = (map, real) => {
    return <img src={real.src} alt="" width={real.size.width ? real.size.width + "px" : ""}/>
}

const slotLoadingHeight = (map, real) => {
    return <img src={real.src} alt="" height={real.size.height ? real.size.height + "px" : ""}/>
}

const openFullMap = (ev) => {
    let lat = ev.currentTarget.getAttribute("lat");
    let long = ev.currentTarget.getAttribute("long");
    let zoom = ev.currentTarget.getAttribute("long");
    let latlong = `${lat},${long}`;
    let url = "https://maps.google.com/maps?q=" + latlong + "&ll=" + latlong + "&z=" + zoom;
    let win = window.open(url, '_blank');
    win.focus();
}

const MapComponent = ({map, zoom = 16, scale = 1}) => {
    let obj = {
        geo: map,
        zoom: zoom,
        scale: scale
    }
    return (
        <div class="map media-wrapper" long={map.long} lat={map.lat} zoom={zoom} onClick={openFullMap}>
            <ObjectWithThumbnailComponent type="photo" loadObject={loadObject} object={obj} slotLoaded={slotLoaded}
                                          slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}/>
            <div class="pin-point">
                <i class="tgico tgico-location"/>
            </div>
        </div>
    )
}

export default MapComponent;