const moongose = require('mongoose');

const RutasPrimariasSchema = new moongose.Schema({
    _id : moongose.Schema.Types.ObjectId,
    type:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    })

module.exports = moongose.model('RutasPrimarias', RutasPrimariasSchema, 'rutas_primarias')