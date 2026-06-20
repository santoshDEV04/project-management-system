const asyncHandler = ( requesetHandler ) => {
    return (req, res, next) => {
        Promise.resolve(requesetHandler(req, res, next))
        .catch((err) => next(err))
    }
}

export { asyncHandler }