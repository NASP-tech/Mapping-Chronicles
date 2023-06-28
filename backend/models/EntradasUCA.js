const moongose = require('mongoose')

const EntradasUCASchema = new moongose.Schema({
    _id : moongose.Schema.Types.ObjectId,
    type:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
    })


    module.exports = moongose.model('EntradasUCA', EntradasUCASchema, 'entradas_uca')