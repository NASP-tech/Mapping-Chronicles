const turf = require('@turf/turf');
const url = require('url');
const queryString = require('querystring');
const ParadasPrimarias = require('../models/ParadasPrimarias');
exports.dinamicBuffer = function(req, res) {
    
    const requestUrl = req.url;
    
    const url = new URL(requestUrl, `http://${req.headers.host}`)

    const latitude = url.searchParams.get('latitude')
    const longitude = url.searchParams.get('longitude')
    const radius = url.searchParams.get('radius')
    //console.log(latitude, longitude)
    
    // creating buffer
    var point = turf.point([Number(longitude), Number(latitude)]);
    var buffered = turf.buffer(point, radius ? radius : 50, {units: 'meters'});
    
    const bufferedLayer = turf.featureCollection([buffered]);

    const bufferedLayer2 = turf.geometryCollection([buffered])
    const bufferedLayerGeoJSON = JSON.stringify(bufferedLayer);
    

    // response

    res.setHeader('Content-Type', 'application/json');
    
    res.body = buffered;
 
    res.status(200).json([res.body]);
}


exports.getBusStopsByRadius = async function(req, res) {

    const requestUrl = req.url

    const url = new URL(requestUrl, `http://${req.headers.host}`)

    const latitude = url.searchParams.get('latitude')
    const longitude = url.searchParams.get('longitude')
    const radius = url.searchParams.get('radius')

    var point = turf.point([Number(longitude), Number(latitude)]);
    var buffered = turf.buffer(point, radius ? radius : 50, {units: 'meters'});


    var points = turf.points([
        [-46.6318, -23.5523],
        [-46.6246, -23.5325],
        [-46.6062, -23.5513],
        [-46.663, -23.554],
        [-46.643, -23.557]
    ]);
    
    var searchWithin = turf.polygon([[
        [-46.653,-23.543],
        [-46.634,-23.5346],
        [-46.613,-23.543],
        [-46.614,-23.559],
        [-46.631,-23.567],
        [-46.653,-23.560],
        [-46.653,-23.543]
    ]]);
    
    var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

    try{
        const busStops = await ParadasPrimarias.find()
        // console.log( [busStops[0]] )
        
        // console.log({...busStops[0]})
        const filteredPoints = turf.pointsWithinPolygon(busStops[0]._doc , buffered )
        const filteredPointsCollection = turf.featureCollection([filteredPoints])
        res.status(200).json([filteredPoints])


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}
