const moongose = require('mongoose');

const ParadasPrimariasSchema = new moongose.Schema({
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

module.exports = moongose.model('ParadasPrimarias', ParadasPrimariasSchema, 'paradas_primarias')