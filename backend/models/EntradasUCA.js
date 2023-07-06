/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
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