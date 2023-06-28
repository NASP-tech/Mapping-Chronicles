const token = mapboxgl.accessToken = '';

// Define a global variable
let currentPosition = null;

// get current location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });

// Start watching the user's position
navigator.geolocation.watchPosition(updateLocation, errorLocation, { enableHighAccuracy: true });

function successLocation(position) {
    console.log(position);
    currentPosition = [position.coords.longitude, position.coords.latitude];
    setupMap(currentPosition);
}

function updateLocation(position) {
    console.log(position);
    currentPosition = [position.coords.longitude, position.coords.latitude];
    userMarker.setLngLat(currentPosition);
    directions.setOrigin(currentPosition);
}

function errorLocation(err) {
    console.log(err);
    setupMap([-89.234826, 13.682831]); // default uca coords
}

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 20,
    });

    // add navigation controls
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    // add directions plugin https://github.com/mapbox/mapbox-gl-directions
    const directions = new MapboxDirections({
        accessToken: token,
        unit: 'metric',
        profile: 'mapbox/driving',
        language: 'es',
        voice_instructions: true,
    });

    map.addControl(directions, 'bottom-left');

    map.on('load', () => {
        // Set origin and destination
        directions.setOrigin(currentPosition || center);
        directions.setDestination([-89.234826, 13.682831]);
    });

    userMarker = new mapboxgl.Marker({ color: 'blue' })
        .setLngLat(currentPosition || center)
        .addTo(map);

    // Set origin and destination
    //directions.setOrigin(currentPosition || center);
    //directions.setDestination([-89.234826, 13.682831]);
}
