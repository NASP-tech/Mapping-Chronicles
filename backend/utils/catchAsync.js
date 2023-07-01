module.exports = fn => { // review this definition later, this was coded this way to remove the repetitive try catch blocks
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}
