const NotFoundError = (res, message) => {
     return res.status(404).json({ status: false, message: `${message} not found` })
}
const UnauthorizedError = (res, message) => {
     return res.status(401).json({ status: false, message: `Unauthorized ${message}` })
}
const InternalServerError = (res, err) => {
     return res.status(500).json({ status: false, message: `Internal server`, err })
}
const AlreadyExistError = (res, message) => {
     return res.status(403).json({ status: false, message: `${message} already exist` })
}
const NotAccessError = (res, message) => {
     return res.status(403).json({ status: false, message: message })
}
const InvalidError = (res, message) => {
     return res.status(401).json({ status: false, message: `Invalid ${message}` });
}
module.exports = { NotFoundError, UnauthorizedError, InternalServerError, AlreadyExistError, InvalidError, NotAccessError }