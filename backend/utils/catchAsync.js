/*
  Copyright 2023 Mapping Chronicles
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
module.exports = fn => { // review this definition later, this was coded this way to remove the repetitive try catch blocks
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}
