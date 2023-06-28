const moongose = require('mongoose');

const BufferEntradasUCASchema = new moongose.Schema({
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

module.exports = moongose.model('BufferEntradasUCA', BufferEntradasUCASchema, 'buffer_entradas_uca')