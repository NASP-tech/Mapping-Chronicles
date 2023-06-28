mapboxgl.accessToken = 'test token';

// Define a global variable
let currentPosition = null;

// get current location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });

function successLocation(position) {
    console.log(position);
    currentPosition = [position.coords.longitude, position.coords.latitude];
    setupMap(currentPosition);
}

function errorLocation() {
    setupMap([-89.234826, 13.682831]); // default uca coords
}

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 16,
    });

    // add navigation controls
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    // add directions plugin https://github.com/mapbox/mapbox-gl-directions
    const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/driving',
        language: 'es',
        voice_instructions: true,
    });

    map.addControl(directions, 'top-left');

    // Set origin and destination
    directions.setOrigin(currentPosition || center);
    directions.setDestination([-89.234826, 13.682831]);
}
