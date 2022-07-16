import User from "../models/user";
import bcrypt from 'bcryptjs';
import generateToken from "../functions/generateToken";
import user from "../models/user";
const crypto = require('crypto')
const mailer = require('../modules/mailer')

class AuthControllers {

    async create(req, res) {
        // insterceptando email na req para tentar ver se não existe ja esse email
        const { email } = req.body
        try {
            if (await User.findOne({ email })) {
                return res.status(400).send({ error: 'User already exists' })
            }

            const user = await User.create(req.body)

            // definindo o password como undefined para que o password nao venha como parte da resposta
            user.password = undefined

            res.send({
                user,
                token: generateToken({
                    id: user.id
                })
            })
        } catch (error) {
            return res.status(400).send({ error: 'Registration failed' })
        }
    }


    async auth(req, res) {
        const { email, password } = req.body
        // encontrar na base de dados se existe um usuario com esse email 
        const user = await User.findOne({ email }).select('+password') // select + password é usado para comparar com a senha, mas ela é apenas selecionada como foi definida no model

        if (!user)
            return res.status(400).send({ error: 'User not found' })

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Invalid password' })

        user.password = null

        res.send({
            user,
            token: generateToken({
                id: user.id
            })
        })
    }

    async getUsers(req, res) {
        try {
            const users = await user.find()
            res.status(200).send({
                users
            })
        } catch (error) {
            res.status(400).send({ error: 'Error Internal' })
        }

    }

    async forgot_password(req, res) {

        const { email } = req.body

        try {
            const user = await User.findOne({ email })

            if (!user) return res.status(400).send({ error: 'User not found' })

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()
            now.setHours(now.getHours() + 1)

            await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now
                }
            })

            mailer.sendMail({
                to: email,
                from: process.env.NODEMAILER_USER,
                subject: 'Redefinição de Senha',
                template: 'auth/forgot_password',
                context: { token, email }
            }, (err) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send({ error: 'Cannot send forgot password email' })
                }

                return res.send()
            })

        } catch (error) {
            res.status(400).send({ error: 'Erro on forgot password, try again' })
        }
    }

    async reset_password(req, res) {

        const { email, token, password } = req.body

        try {
            const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires')
            if (!user) return res.status(400).send({ error: 'User not found' })

            if (token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Token invalid' })

            const now = new Date()

            if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate a new one' })

            user.password = password
            user.passwordResetToken = null
            user.passwordResetExpires = null

            await user.save()

            res.send()


        } catch (error) {
            res.status(400).send({ error: 'Cannot reset password, try again' })
        }
    }
}

export default new AuthControllers()