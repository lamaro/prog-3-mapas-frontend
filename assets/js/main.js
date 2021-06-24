let markersAll = [] //
let infoWindow = null
// Initialize and add the map
window.initMap = () => {

    //Centro del mapa
    const obelisco = { lat: -34.603544, lng: -58.381586 }; //esto es el centro!

    const map = new google.maps.Map(document.getElementById("map"), { //Creamos el mapa
        zoom: 15,
        center: obelisco,
        styles: styles,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: []
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    fetchMarkers(map) //Agregamos los markers

    //Filtros
    const $filter = document.querySelectorAll('.handleFilter')
    $filter.forEach((filter) => {
        filter.addEventListener('click', () => {
            const filterQuery = filter.innerHTML; //Traigo el query
            addMarkersFiltered(filterQuery, map) //Filtro markers
        })
    })

    //Reset de filtros
    const $filterReset = document.querySelector('.handleFilterReset')
    $filterReset.addEventListener('click', () => {
        markersAll.forEach((marker) => { //Limpiamos el mapa
            marker.setMap(null) //lo quitamos del mapa
        })
        markersAll.forEach((marker) => { //Agregamos los markers filtrados
            marker.setMap(map) //lo agregamos al mapa
        })
    })
}

const addMarkersFiltered = (filterQuery, map) => {
    markersAll.forEach((marker) => { //Limpiamos el mapa
        marker.setMap(null) //lo quitamos del mapa
    })
    const markersFiltered = markersAll.filter((marker) => marker.customInfo === filterQuery) //Filtramos por query

    markersFiltered.forEach((marker) => { //Agregamos los markers filtrados
        marker.setMap(map) //lo agregamos al mapa
    })
}

const fetchMarkers = async (map) => {
    try {
        const response = await fetch('assets/data/markers.json');
        const json = await response.json();
        console.log(json)
        json.forEach(marker => addMarker(map, marker))
    } catch (error) {
        console.log(error)
    }
}

const addMarker = (map, marker) => {
    const { nombre, descripcion, lat, lng, type } = marker

    //Iconos
    const icons = {
        'Arte y Cultura': '/assets/images/beer.png',
        'Monumentos': '/assets/images/food.png',
        'Parques': '/assets/images/bar.png',
    }

    //MARKER
    const markerItem = new google.maps.Marker(
        {
            position: { lat: lat, lng: lng },
            map: map,
            //icon: icons[type],
            customInfo: type
        }
    );
    markerItem.setMap(map);
    markersAll.push(markerItem); //lo agrego tambien al array de todos los markers

    //INFOWINDOW
    const contentString = `
    <div class="info_wrapper">
        <h2>${nombre}</h2>
        <h3>${type}</h3>
        <p>${descripcion}</p>
    </div>
    `
    infoWindow = new google.maps.InfoWindow({
        content: contentString
    })
    markerItem.addListener('click', () => {
        if (infoWindow) {
            infoWindow.close();
        }
        infoWindow.open(map, markerItem)
    })
}
