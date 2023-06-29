const turf = require('@turf/turf');
const url = require('url');
const queryString = require('querystring');
const ParadasPrimarias = require('../models/ParadasPrimarias');
const BufferEntradasUCA = require('../models/BufferEntradasUCA');
const EntradasUCA = require('../models/EntradasUCA');
const RutasPrimarias = require('../models/RutasPrimarias');
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


exports.getBufferEntradasUCA = async function(req, res) {
    try{
        const bufferEntradasUCA = await BufferEntradasUCA.find();
        res.status(200).json(bufferEntradasUCA);
    }
    catch(err){
        res.status(500).json({ message: err });
    }
}


exports.getEntradasUCA = async function(req, res) {
    try{
        const entradasUCA = await EntradasUCA.find();
        res.status(200).json(entradasUCA);
    }
    catch(err){
        res.status(500).json({ message: err });
    }
}

exports.getParadasPrimarias = async function(req, res) {
    try{
        const paradasPrimarias = await ParadasPrimarias.find();
        res.status(200).json(paradasPrimarias);
    }
    catch(err){
        res.status(500).json({ message: err });
    }
}

exports.getRutasPrimarias = async function(req, res) {
    try {
        const rutasPrimarias = await RutasPrimarias.find();
        res.status(200).json(rutasPrimarias);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}