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
    
    // creating buffer
    var point = turf.point([Number(longitude), Number(latitude)]);
    var buffered = turf.buffer(point, radius ? radius : 50, {units: 'meters'});
    
    const bufferedLayer = turf.featureCollection([buffered]);

    

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


    try{
        const busStops = await ParadasPrimarias.find()
        // console.log( [busStops[0]] )
        
        // console.log({...busStops[0]})
        const filteredPoints = turf.pointsWithinPolygon(busStops[0]._doc , buffered )
        //const filteredPointsCollection = turf.featureCollection([filteredPoints])
        res.status(200).json([filteredPoints])


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
}


exports.getNearestBusStop = async function(req, res) {
    
        const requestUrl = req.url
    
        const url = new URL(requestUrl, `http://${req.headers.host}`)
    
        const latitude = url.searchParams.get('latitude')
        const longitude = url.searchParams.get('longitude')
    
        var point = turf.point([Number(longitude), Number(latitude)]);
        
        try{
            const busStops = await ParadasPrimarias.find()

            const nearestPoint = turf.nearestPoint(point, busStops[0]._doc)

            res.status(200).json([nearestPoint])
        }
        catch(err){
            console.log(err)
            res.status(500).json({ message: err })
        }
    }


