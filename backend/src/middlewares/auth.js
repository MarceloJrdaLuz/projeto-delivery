import Users from '../models/user'
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

class AuthMiddlewares {
  authMiddlewares (req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).send({ error: 'No token provided' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2) return res.status(401).send({ error: 'Token error' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) { return res.status(401).send({ error: ' Token malformatted' }) }

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) return res.status(401).send({ error: 'Token invalid' })

      req.userId = decoded.id

      return next()
    })
  }

  async IsAdmin (req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) return res.status(401).send({ error: 'No token provided' })

    const parts = authHeader.split(' ')

    if (!parts.length === 2) return res.status(401).send({ error: 'Token error' })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) { return res.status(401).send({ error: ' Token malformatted' }) }

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
      if (err) return res.status(401).send({ error: 'Token invalid' })

      req.userId = decoded.id
    })

    const user = await Users.findOne({ token })

    if (user.permissions !== 'ADMIN') {
      return res.status(403).send({ error: 'Acesso negado' })
    }
    next()
  }
}

export default new AuthMiddlewares()
