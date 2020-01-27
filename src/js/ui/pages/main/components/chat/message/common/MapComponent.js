import {FileAPI} from "../../../../../../../api/fileAPI";
import {ObjectWithThumbnailComponent} from "../../../basic/objectWithThumbnailComponent";

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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                        <polygon points="0 0 24 0 24 24 0 24"/>
                        <path fill="#000" fill-rule="nonzero"
                              d="M12,1 C16.4222847,1 20,4.57771525 20,9 C20,12.6640802 17.285686,17.215972 13.5382213,21.7501844 C12.7384262,22.7099385 11.2715738,22.7099385 10.4709159,21.7491475 C6.74246572,17.2627158 4,12.667928 4,9 C4,4.57771525 7.57771525,1 12,1 Z M12,3 C8.68228475,3 6,5.68228475 6,9 C6,11.9305145 8.44537411,16.1112774 11.7174083,20.1168717 L12.005,20.465 L12.2914021,20.1164243 C15.5780653,16.0727134 18,11.927495 18,9 C18,5.68228475 15.3177153,3 12,3 Z M12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 Z"/>
                    </g>
                </svg>
            </div>
        </div>
    )
}

export default MapComponent;